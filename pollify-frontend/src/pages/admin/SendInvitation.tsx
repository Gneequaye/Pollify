import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
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
import {
  IconMail,
  IconCircleCheckFilled,
  IconLoader,
  IconSend,
  IconAlertCircle,
  IconArrowLeft,
} from "@tabler/icons-react";
import { Separator } from '@/components/ui/separator';
import { invitationService } from '@/services/invitationService';
import { ApiError } from '@/lib/api';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

// ── Zod schema ───────────────────────────────────────────────────────────────
const sendInvitationSchema = z.object({
  universityName: z
    .string()
    .min(3, 'University name must be at least 3 characters')
    .max(100, 'University name must be under 100 characters'),
  universityEmail: z
    .string()
    .email('Please enter a valid email address')
    .refine(
      (v) => v.includes('.edu') || v.includes('.ac.'),
      'Must be an institutional email (.edu or .ac.)'
    ),
  invitationCode: z
    .string()
    .min(4, 'Invitation code must be 4–20 characters')
    .max(20, 'Invitation code must be under 20 characters')
    .regex(/^[A-Z0-9-]+$/, 'Uppercase letters, numbers, and hyphens only (e.g. INV-001)'),
});

type SendInvitationForm = z.infer<typeof sendInvitationSchema>;

export function SendInvitation() {
  const navigate = useNavigate();

  const form = useForm<SendInvitationForm>({
    resolver: zodResolver(sendInvitationSchema),
    defaultValues: {
      universityName: '',
      universityEmail: '',
      invitationCode: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: SendInvitationForm) => {
    try {
      const response = await invitationService.sendInvitation(data);
      navigate('/dashboard/admin/invitations/success', {
        state: {
          universityName: response.universityName,
          universityEmail: response.universityEmail,
          invitationToken: response.invitationToken,
          invitationCode: response.invitationCode,
          invitationUrl: response.invitationUrl,
          expiresAt: new Date(response.expiresAt).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          }),
        },
      });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to send invitation. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Back */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1"
          onClick={() => navigate('/dashboard/admin/invitations')}
        >
          <IconArrowLeft className="size-4" /> Back to Invitations
        </Button>
      </div>

      {/* Main panel */}
      <div className={`${panel} p-6`}>
        <div className="mb-6">
          <h1 className="text-xl font-bold">Send Invitation</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Invite a university or school to join the Pollify platform
          </p>
        </div>
        <Separator className="bg-zinc-100 dark:bg-zinc-800 mb-6" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">

              {/* LEFT: Form fields */}
              <div className="lg:col-span-2 flex flex-col gap-5">

                {/* School Name */}
                <FormField
                  control={form.control}
                  name="universityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">School / University Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., University of Ghana"
                          className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Email */}
                <FormField
                  control={form.control}
                  name="universityEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Official Contact Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="e.g., registrar@ug.edu.gh"
                          className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Must end in{' '}
                        <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">.edu</code>
                        {' '}or{' '}
                        <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">.ac.</code>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Invitation Code */}
                <FormField
                  control={form.control}
                  name="invitationCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Invitation Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., KNUST2024"
                          className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 font-mono"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        4–20 characters. Uppercase letters, numbers, and hyphens (e.g. <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">INV-001</code>).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isSubmitting} className="gap-2 px-6">
                    {isSubmitting ? (
                      <><IconLoader className="size-4 animate-spin" /> Sending Invitation…</>
                    ) : (
                      <><IconSend className="size-4" /> Send Invitation</>
                    )}
                  </Button>
                </div>
              </div>

              {/* RIGHT: Info panel */}
              <div className="lg:col-span-1 flex flex-col gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-3">
                    <IconMail className="size-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold">What happens after you send?</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      'An invitation email is delivered to the contact address',
                      'The school clicks the "Accept Invitation" link in the email',
                      'They complete onboarding and set up their admin account',
                      'Their isolated school environment is automatically provisioned',
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

                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-sm font-semibold mb-3">Good to know</h3>
                  <div className="space-y-2.5">
                    {[
                      'Use the official registrar or admin email address',
                      'The invitation link is valid for 7 days',
                      'The invitation code uniquely identifies the school',
                    ].map((tip, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <IconCircleCheckFilled className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-xs text-muted-foreground">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 px-4 py-3.5">
                  <IconAlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    The invitation link expires in <strong>7 days</strong>. If the school doesn't respond in time, contact your system administrator.
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
