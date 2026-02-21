import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  IconBuilding,
  IconCircleCheckFilled,
  IconLoader,
  IconSend,
  IconAlertCircle,
  IconArrowLeft,
} from "@tabler/icons-react";
import { Separator } from '@/components/ui/separator';

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
      (val) => val.includes('.edu') || val.includes('.ac.'),
      'Please use an official institutional email address (e.g., .edu or .ac.)'
    ),
});

type SendInvitationForm = z.infer<typeof sendInvitationSchema>;

export function SendInvitation() {
  const navigate = useNavigate();

  const form = useForm<SendInvitationForm>({
    resolver: zodResolver(sendInvitationSchema),
    defaultValues: { universityName: '', universityEmail: '' },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: SendInvitationForm) => {
    await new Promise((res) => setTimeout(res, 1200));
    navigate('/dashboard/admin/invitations/success', {
      state: {
        universityName: data.universityName,
        universityEmail: data.universityEmail,
        invitationId: `INV-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        }),
      },
    });
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
        {/* Panel header */}
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

                {/* Section label */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
                    <h2 className="text-base font-semibold">Institution Details</h2>
                  </div>
                  <p className="text-sm text-muted-foreground ml-8">
                    Provide the official name and contact email for the institution you want to invite.
                  </p>
                </div>

                {/* School Name */}
                <FormField
                  control={form.control}
                  name="universityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        School / University Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., University of Ghana"
                          className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        The full official name of the institution
                      </FormDescription>
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
                      <FormLabel className="text-sm font-medium">
                        Official Contact Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="e.g., registrar@ug.edu.gh"
                          className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Must be an institutional email ending in{' '}
                        <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">.edu</code>
                        {' '}or{' '}
                        <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">.ac.</code>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Actions */}
                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2 px-6"
                  >
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

                {/* What happens next */}
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-3">
                    <IconMail className="size-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold">What happens after you send?</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      'An invitation email is delivered to the contact address',
                      'The school representative clicks the "Accept Invitation" link',
                      'They set up their admin account and configure their school type',
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

                {/* Tips */}
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-sm font-semibold mb-3">Good to know</h3>
                  <div className="space-y-2.5">
                    {[
                      'Use the official registrar or admin email address',
                      'The invitation is valid for 7 days before it expires',
                      'You can resend or revoke from the All Invitations page',
                    ].map((tip, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <IconCircleCheckFilled className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-xs text-muted-foreground">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expiry warning */}
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 px-4 py-3.5">
                  <IconAlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    The invitation link expires in <strong>7 days</strong>. If the school doesn't respond in time, you can resend it from the All Invitations page.
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
