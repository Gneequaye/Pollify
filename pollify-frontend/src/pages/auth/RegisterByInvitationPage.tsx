import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { invitationService, ValidateInvitationResponse } from '@/services/invitationService';
import { apiRequest, ApiError } from '@/lib/api';
import {
  IconLoader,
  IconCircleCheckFilled,
  IconAlertCircle,
  IconClockHour4,
  IconArrowRight,
  IconWorld,
  IconHash,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// ─── States ──────────────────────────────────────────────────────────────────
type PageState = 'loading' | 'valid' | 'onboarding' | 'expired' | 'invalid';

// ─── Onboarding schema ────────────────────────────────────────────────────────
const onboardingSchema = z
  .object({
    adminFirstName: z.string().min(2, 'First name must be at least 2 characters'),
    adminLastName: z.string().min(2, 'Last name must be at least 2 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/\d/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    schoolType: z.enum(['DOMAIN_SCHOOL', 'CODE_SCHOOL']),
    emailDomain: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (d) =>
      d.schoolType !== 'DOMAIN_SCHOOL' ||
      (d.emailDomain && d.emailDomain.trim().length >= 3 && d.emailDomain.includes('.')),
    { message: 'A valid email domain is required (e.g. st.ug.edu.gh)', path: ['emailDomain'] }
  );

type OnboardingForm = z.infer<typeof onboardingSchema>;

export function RegisterByInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [invitationData, setInvitationData] = useState<ValidateInvitationResponse | null>(null);
  const [schoolType, setSchoolType] = useState<'DOMAIN_SCHOOL' | 'CODE_SCHOOL'>('DOMAIN_SCHOOL');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      adminFirstName: '',
      adminLastName: '',
      password: '',
      confirmPassword: '',
      schoolType: 'DOMAIN_SCHOOL',
      emailDomain: '',
    },
  });

  const handleSchoolTypeChange = (type: 'DOMAIN_SCHOOL' | 'CODE_SCHOOL') => {
    setSchoolType(type);
    form.setValue('schoolType', type);
    form.clearErrors('emailDomain');
  };

  const onSubmit = async (data: OnboardingForm) => {
    try {
      const payload = {
        invitationToken: token,
        universityName: invitationData?.universityName,
        adminFirstName: data.adminFirstName,
        adminLastName: data.adminLastName,
        password: data.password,
        schoolType: data.schoolType,
        emailDomain: data.schoolType === 'DOMAIN_SCHOOL' ? data.emailDomain : undefined,
      };

      const response = await apiRequest<{
        tenantId: string;
        universityName: string;
        schoolType: string;
        schoolCode: string;
        loginToken: string;
        message: string;
      }>('/public/onboarding/complete', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      sessionStorage.setItem('pollify_auth_token', response.loginToken);
      sessionStorage.setItem('pollify_user', JSON.stringify({
        universityName: response.universityName,
        tenantId: response.tenantId,
        role: 'TENANT_ADMIN',
      }));

      toast.success('Onboarding complete! Welcome to Pollify 🎉');
      navigate('/dashboard/tenant', { replace: true });

    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Onboarding failed. Please try again.';
      toast.error(message);
    }
  };

  useEffect(() => {
    if (!token) {
      setPageState('invalid');
      return;
    }

    invitationService
      .validateToken(token)
      .then((data) => {
        setInvitationData(data);
        if (!data.valid) {
          const msg = data.message?.toLowerCase() ?? '';
          setPageState(msg.includes('expir') ? 'expired' : 'invalid');
        } else {
          setPageState('valid');
        }
      })
      .catch((err) => {
        // Backend returns 400 with a ValidateInvitationResponse body for invalid/expired tokens
        // ApiError.data contains the parsed response body
        if (err instanceof ApiError && err.data) {
          const data = err.data as ValidateInvitationResponse;
          setInvitationData(data);
          const msg = data.message?.toLowerCase() ?? '';
          setPageState(msg.includes('expir') ? 'expired' : 'invalid');
        } else {
          setPageState('invalid');
        }
      });
  }, [token]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <IconLoader className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying your invitation…</p>
        </div>
      </div>
    );
  }

  // ── Expired ────────────────────────────────────────────────────────────────
  if (pageState === 'expired') {
    return (
      <AuthShell imageType="error">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/30">
            <IconClockHour4 className="size-8 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Invitation Expired</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              This invitation link has expired. Invitation links are valid for 7 days from the time they are sent.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 px-5 py-4 text-sm text-amber-700 dark:text-amber-400 max-w-sm w-full text-left">
            <strong>What to do next:</strong>
            <p className="mt-1 text-xs leading-relaxed">
              Please contact the Pollify administrator who sent you this invitation and ask them to send a new invitation link.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </AuthShell>
    );
  }

  // ── Invalid ────────────────────────────────────────────────────────────────
  if (pageState === 'invalid') {
    return (
      <AuthShell imageType="error">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30">
            <IconAlertCircle className="size-8 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Invalid Invitation</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              {invitationData?.message ?? 'This invitation link is not valid. It may have already been used or does not exist.'}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </AuthShell>
    );
  }

  // ── Onboarding form ────────────────────────────────────────────────────────
  if (pageState === 'onboarding') {
    return (
      <AuthShell imageType="onboarding">
        <div className="w-full max-w-lg flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Set Up Your School</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Complete your account setup for <strong>{invitationData?.universityName}</strong>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
              {invitationData?.invitationCode}
            </span>
            <span>·</span>
            <span>{invitationData?.universityEmail}</span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="adminFirstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl><Input placeholder="Kwame" className="h-10" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="adminLastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl><Input placeholder="Mensah" className="h-10" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 8 characters with a number"
                        className="h-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    At least 8 characters with at least one number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Repeat your password"
                        className="h-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">How will students verify their identity?</label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { value: 'DOMAIN_SCHOOL', icon: IconWorld, label: 'Domain School', desc: 'Students use their institutional email' },
                    { value: 'CODE_SCHOOL', icon: IconHash, label: 'Code School', desc: 'Students enter a school code to register' },
                  ] as const).map(({ value, icon: Icon, label, desc }) => (
                    <button key={value} type="button" onClick={() => handleSchoolTypeChange(value)}
                      className={`flex flex-col gap-1.5 rounded-xl border p-4 text-left transition-all ${
                        schoolType === value
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`size-4 ${schoolType === value ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-sm font-medium">{label}</span>
                        {schoolType === value && <IconCircleCheckFilled className="size-3.5 text-primary ml-auto" />}
                      </div>
                      <span className="text-xs text-muted-foreground">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {schoolType === 'DOMAIN_SCHOOL' && (
                <FormField control={form.control} name="emailDomain" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Email Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., st.ug.edu.gh" className="h-10" {...field}
                        onChange={(e) => field.onChange(e.target.value.toLowerCase())} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Students with emails ending in this domain can register as voters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              {schoolType === 'CODE_SCHOOL' && (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    A unique school code will be automatically generated for your students to use during voter registration.
                  </p>
                </div>
              )}

              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full gap-2 h-11">
                {form.formState.isSubmitting
                  ? <><IconLoader className="size-4 animate-spin" /> Setting up your school…</>
                  : <>Complete Setup <IconArrowRight className="size-4" /></>
                }
              </Button>

            </form>
          </Form>
        </div>
      </AuthShell>
    );
  }

  // ── Valid — Welcome & proceed to onboarding ────────────────────────────────
  return (
    <AuthShell imageType="verify">
      <div className="flex flex-col items-center gap-6 w-full max-w-md">

        {/* Success icon */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
            <IconCircleCheckFilled className="size-9 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome to Pollify!</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your invitation has been verified. Let's set up your school.
            </p>
          </div>
        </div>

        {/* Invitation details card */}
        <div className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 flex flex-col gap-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Invitation Details
          </p>
          <Row label="University" value={invitationData?.universityName ?? '—'} />
          <Row label="Contact Email" value={invitationData?.universityEmail ?? '—'} />
          <Row label="Invitation Code" value={invitationData?.invitationCode ?? '—'} mono />
        </div>

        {/* CTA */}
        <Button
          className="w-full gap-2"
          onClick={() => setPageState('onboarding')}
        >
          Continue to Onboarding
          <IconArrowRight className="size-4" />
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Already have an account?{' '}
          <button
            className="underline underline-offset-2 hover:text-foreground transition-colors"
            onClick={() => navigate('/login')}
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthShell>
  );
}

// ─── Split-screen layout shell ────────────────────────────────────────────────
function AuthShell({
  children,
  imageType = 'verify',
}: {
  children: React.ReactNode;
  imageType?: 'verify' | 'onboarding' | 'error';
}) {
  const imageContent = {
    verify: {
      image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&q=80',
      title: 'Your Invitation Awaits',
      description: "You've been selected to bring secure, modern e-voting to your university. Let's get started.",
    },
    onboarding: {
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
      title: 'Set Up Your School',
      description: "Configure your school's voting environment. Choose how students verify their identity and set up your admin account.",
    },
    error: {
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
      title: 'Something Went Wrong',
      description: 'Please contact the Pollify administrator who sent your invitation to resolve this.',
    },
  }[imageType];

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-3">
              <svg className="w-10 h-10 text-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-2xl font-bold text-foreground">Pollify</span>
            </div>
          </div>
          {children}
        </div>
      </div>

      {/* Right — Image panel */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={imageContent.image}
            alt="Pollify onboarding"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-purple-600/70 to-indigo-700/80" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="text-center max-w-md">
            <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">{imageContent.title}</h2>
            <p className="text-xl text-white/90 leading-relaxed drop-shadow-md">{imageContent.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Small helper row ─────────────────────────────────────────────────────────
function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`font-medium text-right truncate ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
