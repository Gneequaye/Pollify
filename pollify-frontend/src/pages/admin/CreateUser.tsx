import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  IconArrowLeft,
  IconArrowRight,
  IconUser,
  IconShieldCheck,
  IconUserCheck,
  IconCircleCheckFilled,
  IconCopy,
  IconCheck,
  IconLoader,
  IconEye,
  IconEyeOff,
  IconRefresh,
  IconUsers,
} from '@tabler/icons-react';
import { toast } from 'sonner';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generatePassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const special = '@#$%&!';
  const all = upper + lower + digits + special;
  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  const required = [pick(upper), pick(lower), pick(digits), pick(special)];
  const rest = Array.from({ length: 8 }, () => pick(all));
  return [...required, ...rest].sort(() => Math.random() - 0.5).join('');
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const detailsSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

const roleSchema = z.object({
  role: z.enum(['SUPER_ADMIN', 'TENANT_ADMIN'], { required_error: 'Please select a role' }),
});

type DetailsFormData = z.infer<typeof detailsSchema>;
type RoleFormData = z.infer<typeof roleSchema>;

type CreatedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN';
  generatedPassword: string;
  createdAt: string;
};

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { n: 1, label: 'User Details' },
    { n: 2, label: 'Set Role' },
    { n: 3, label: 'Done' },
  ];
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={step.n} className="flex items-center gap-0">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`size-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              current > step.n
                ? 'bg-emerald-500 text-white'
                : current === step.n
                ? 'bg-primary text-primary-foreground'
                : 'bg-zinc-100 dark:bg-zinc-800 text-muted-foreground'
            }`}>
              {current > step.n ? <IconCircleCheckFilled className="size-4" /> : step.n}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${current === step.n ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-px w-16 sm:w-24 mx-2 mb-5 transition-all ${current > step.n ? 'bg-emerald-400' : 'bg-zinc-200 dark:bg-zinc-700'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label ?? 'Value'} copied to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      title={`Copy ${label ?? 'value'}`}
    >
      {copied ? <IconCheck className="size-4 text-emerald-500" /> : <IconCopy className="size-4" />}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CreateUser() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);

  // Shared state across steps
  const [detailsData, setDetailsData] = useState<DetailsFormData | null>(null);

  const detailsForm = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { firstName: '', lastName: '', email: '' },
  });

  const roleForm = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  });

  const selectedRole = roleForm.watch('role');

  // Step 1 → Step 2
  const handleDetailsSubmit = (data: DetailsFormData) => {
    setDetailsData(data);
    setStep(2);
  };

  // Step 2 → Step 3 (simulate creation)
  const handleRoleSubmit = async (data: RoleFormData) => {
    if (!detailsData) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    const password = generatePassword();
    const newUser: CreatedUser = {
      id: `USR-${Math.floor(Math.random() * 900 + 100)}`,
      firstName: detailsData.firstName,
      lastName: detailsData.lastName,
      email: detailsData.email,
      role: data.role,
      generatedPassword: password,
      createdAt: new Date().toLocaleDateString('en-GB'),
    };
    setCreatedUser(newUser);
    setSubmitting(false);
    setStep(3);
  };

  // ── Step 1: User Details ────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1" onClick={() => navigate('/dashboard/admin/users')}>
            <IconArrowLeft className="size-4" /> Back to Users
          </Button>
        </div>

        <div className={`${panel} p-6`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold">Create System User</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Add a new admin user to the Pollify platform</p>
            </div>
            <StepIndicator current={1} />
          </div>
          <Separator className="bg-zinc-100 dark:bg-zinc-800 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
                  <h2 className="text-base font-semibold">User Details</h2>
                </div>
                <p className="text-sm text-muted-foreground ml-8">Enter the personal information for this user account.</p>
              </div>

              <Form {...detailsForm}>
                <form onSubmit={detailsForm.handleSubmit(handleDetailsSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={detailsForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Kwame"
                              className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={detailsForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Asante"
                              className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={detailsForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="e.g. kwame.asante@pollify.com"
                            className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          This will be the user's login email address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-2">
                    <Button type="submit" className="gap-2 px-6">
                      Continue <IconArrowRight className="size-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            {/* Info Panel */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-3">
                  <IconUser className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">About this step</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Provide the basic identity information for the new admin user.</p>
                <div className="space-y-2.5">
                  {['Full name is used across the platform for identification', 'The email address is used to log in and receive notifications', 'A secure password will be auto-generated in the final step'].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <IconCircleCheckFilled className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: Set Role ────────────────────────────────────────────────────────
  if (step === 2) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1" onClick={() => setStep(1)}>
            <IconArrowLeft className="size-4" /> Back
          </Button>
        </div>

        <div className={`${panel} p-6`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold">Set User Role</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Assign an access role for <span className="font-semibold text-foreground">{detailsData?.firstName} {detailsData?.lastName}</span>
              </p>
            </div>
            <StepIndicator current={2} />
          </div>
          <Separator className="bg-zinc-100 dark:bg-zinc-800 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            <div className="lg:col-span-2">
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
                  <h2 className="text-base font-semibold">Choose a Role</h2>
                </div>
                <p className="text-sm text-muted-foreground ml-8">Select the level of access this user should have on the platform.</p>
              </div>

              <Form {...roleForm}>
                <form onSubmit={roleForm.handleSubmit(handleRoleSubmit)} className="space-y-4">
                  <FormField
                    control={roleForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Super Admin */}
                          <button
                            type="button"
                            onClick={() => field.onChange('SUPER_ADMIN')}
                            className={`relative text-left rounded-xl border-2 p-5 transition-all focus:outline-none ${
                              field.value === 'SUPER_ADMIN'
                                ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20'
                                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-800/30'
                            }`}
                          >
                            {field.value === 'SUPER_ADMIN' && (
                              <span className="absolute top-3 right-3">
                                <IconCircleCheckFilled className="size-5 text-violet-500" />
                              </span>
                            )}
                            <div className="size-10 rounded-xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center mb-3">
                              <IconShieldCheck className="size-5 text-violet-600 dark:text-violet-400" />
                            </div>
                            <h3 className="text-sm font-semibold mb-1">Super Admin</h3>
                            <p className="text-xs text-muted-foreground">Full platform access. Can manage tenants, send invitations, create users, and access all system settings.</p>
                          </button>

                          {/* Tenant Admin */}
                          <button
                            type="button"
                            onClick={() => field.onChange('TENANT_ADMIN')}
                            className={`relative text-left rounded-xl border-2 p-5 transition-all focus:outline-none ${
                              field.value === 'TENANT_ADMIN'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-800/30'
                            }`}
                          >
                            {field.value === 'TENANT_ADMIN' && (
                              <span className="absolute top-3 right-3">
                                <IconCircleCheckFilled className="size-5 text-blue-500" />
                              </span>
                            )}
                            <div className="size-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center mb-3">
                              <IconUserCheck className="size-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-sm font-semibold mb-1">Tenant Admin</h3>
                            <p className="text-xs text-muted-foreground">Scoped to a single school. Can manage elections, voters, and view results for their institution only.</p>
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-2">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="gap-2">
                      <IconArrowLeft className="size-4" /> Back
                    </Button>
                    <Button type="submit" disabled={!selectedRole || submitting} className="gap-2 px-6">
                      {submitting ? (
                        <><IconLoader className="size-4 animate-spin" /> Creating user...</>
                      ) : (
                        <>Create User <IconArrowRight className="size-4" /></>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            {/* Role comparison */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-semibold mb-3">Role Permissions</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Manage Tenants', superAdmin: true, tenantAdmin: false },
                    { label: 'Send Invitations', superAdmin: true, tenantAdmin: false },
                    { label: 'Create System Users', superAdmin: true, tenantAdmin: false },
                    { label: 'Manage Elections', superAdmin: true, tenantAdmin: true },
                    { label: 'Manage Voters', superAdmin: true, tenantAdmin: true },
                    { label: 'View Results', superAdmin: true, tenantAdmin: true },
                  ].map(perm => (
                    <div key={perm.label} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{perm.label}</span>
                      <div className="flex items-center gap-3">
                        <span title="Super Admin">
                          {perm.superAdmin
                            ? <IconCircleCheckFilled className="size-3.5 text-violet-500" />
                            : <span className="size-3.5 text-zinc-300 dark:text-zinc-600">—</span>}
                        </span>
                        <span title="Tenant Admin">
                          {perm.tenantAdmin
                            ? <IconCircleCheckFilled className="size-3.5 text-blue-500" />
                            : <span className="text-zinc-300 dark:text-zinc-600">—</span>}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-3 bg-zinc-200 dark:bg-zinc-700" />
                <div className="flex items-center justify-end gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><IconShieldCheck className="size-3 text-violet-500" /> Super</span>
                  <span className="flex items-center gap-1"><IconUserCheck className="size-3 text-blue-500" /> Tenant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 3: Success ─────────────────────────────────────────────────────────
  if (step === 3 && createdUser) {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <div className={`${panel} p-8`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold">User Created Successfully</h1>
              <p className="text-sm text-muted-foreground mt-0.5">The account is ready. Share the credentials securely.</p>
            </div>
            <StepIndicator current={3} />
          </div>
          <Separator className="bg-zinc-100 dark:bg-zinc-800 mb-8" />

          {/* Success Banner */}
          <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 mb-8">
            <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
              <IconCircleCheckFilled className="size-6 text-emerald-500" />
            </div>
            <div>
              <h2 className="font-semibold text-emerald-800 dark:text-emerald-300">Account created for {createdUser.firstName} {createdUser.lastName}</h2>
              <p className="text-sm text-emerald-700/70 dark:text-emerald-400/70 mt-0.5">Created on {createdUser.createdAt} · ID: <span className="font-mono">{createdUser.id}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Summary */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">User Summary</h3>
              <div className="space-y-3">
                {[
                  { label: 'Full Name', value: `${createdUser.firstName} ${createdUser.lastName}` },
                  { label: 'Email', value: createdUser.email },
                  { label: 'User ID', value: createdUser.id, mono: true },
                  { label: 'Role', value: createdUser.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Tenant Admin' },
                  { label: 'Created', value: createdUser.createdAt },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground shrink-0">{row.label}</span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`text-sm font-medium truncate ${row.mono ? 'font-mono text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded' : ''}`}>
                        {row.value}
                      </span>
                      <CopyButton value={row.value} label={row.label} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Password */}
            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">Generated Password</h3>
              <p className="text-xs text-amber-600/80 dark:text-amber-500/80 mb-4">
                This password is shown only once. Copy and share it securely with the user.
              </p>

              {/* Password Display */}
              <div className="bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800/60 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between gap-3">
                  <span className={`font-mono text-base font-semibold tracking-widest flex-1 ${!passwordVisible ? 'blur-sm select-none' : ''}`}>
                    {createdUser.generatedPassword}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setPasswordVisible(v => !v)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title={passwordVisible ? 'Hide password' : 'Show password'}
                    >
                      {passwordVisible ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                    </button>
                    <CopyButton value={createdUser.generatedPassword} label="Password" />
                  </div>
                </div>
              </div>

              {/* Password strength hint */}
              <div className="space-y-1.5">
                {['12 characters long', 'Contains uppercase & lowercase letters', 'Contains numbers & special characters'].map(hint => (
                  <div key={hint} className="flex items-center gap-2">
                    <IconCircleCheckFilled className="size-3.5 text-emerald-500 shrink-0" />
                    <span className="text-xs text-muted-foreground">{hint}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <Separator className="bg-zinc-100 dark:bg-zinc-800 my-6" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="outline" className="gap-2" onClick={() => navigate(`/dashboard/admin/users/${createdUser.id}`)}>
              <IconUser className="size-4" /> View User Profile
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={() => { setStep(1); setCreatedUser(null); detailsForm.reset(); roleForm.reset(); }}>
                <IconRefresh className="size-4" /> Create Another
              </Button>
              <Button className="gap-2" onClick={() => navigate('/dashboard/admin/users')}>
                <IconUsers className="size-4" /> Back to Users
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
