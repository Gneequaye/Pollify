import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  IconArrowLeft,
  IconLoader,
  IconUserPlus,
  IconInfoCircle,
  IconCircleCheckFilled,
  IconAlertCircle,
} from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

const registerVoterSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  studentId: z.string().min(4, 'Student ID must be at least 4 characters'),
});

type RegisterVoterForm = z.infer<typeof registerVoterSchema>;

export function RegisterVoter() {
  const navigate = useNavigate();

  const form = useForm<RegisterVoterForm>({
    resolver: zodResolver(registerVoterSchema),
    defaultValues: { firstName: '', lastName: '', email: '', studentId: '' },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (_data: RegisterVoterForm) => {
    await new Promise(res => setTimeout(res, 1000));
    toast.success('Voter registered successfully! A verification email has been sent.');
    navigate('/dashboard/tenant/voters');
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Back */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1"
          onClick={() => navigate('/dashboard/tenant/voters')}
        >
          <IconArrowLeft className="size-4" /> Back to Voters
        </Button>
      </div>

      {/* Main panel */}
      <div className={`${panel} p-6`}>
        <div className="mb-6">
          <h1 className="text-xl font-bold">Register Voter</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Add a new voter to the platform for your institution
          </p>
        </div>
        <Separator className="bg-zinc-100 dark:bg-zinc-800 mb-6" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">

              {/* LEFT: Form */}
              <div className="lg:col-span-2 flex flex-col gap-5">

                {/* Section label */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-base font-semibold">Voter Details</h2>
                  </div>
                  <p className="text-sm text-muted-foreground ml-8">
                    Enter the voter's personal and academic information.
                  </p>
                </div>

                {/* First + Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Kwame"
                            className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Mensah"
                            className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="e.g., kwame.mensah@university.edu.gh"
                          className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Student ID */}
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Student ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., UG-2025-0012"
                          className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isSubmitting} className="gap-2 px-6">
                    {isSubmitting ? (
                      <><IconLoader className="size-4 animate-spin" /> Registering…</>
                    ) : (
                      <><IconUserPlus className="size-4" /> Register Voter</>
                    )}
                  </Button>
                </div>
              </div>

              {/* RIGHT: Info panel */}
              <div className="lg:col-span-1 flex flex-col gap-4">

                {/* What happens next */}
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-3">
                    <IconInfoCircle className="size-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold">What happens next?</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      'The voter receives a registration confirmation email',
                      'They follow the link to set their password',
                      'Once verified, they can log in and cast votes',
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="text-xs text-muted-foreground leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-sm font-semibold mb-3">Good to know</h3>
                  <div className="space-y-2.5">
                    {[
                      'Use the student\'s official university email',
                      'Student ID must match university records',
                      'Voters can be managed from the Voters page',
                    ].map((tip, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <IconCircleCheckFilled className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-xs text-muted-foreground">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 px-4 py-3.5">
                  <IconAlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    Voters must <strong>verify their email</strong> before they can participate in any election.
                  </p>
                </div>
              </div>

            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
