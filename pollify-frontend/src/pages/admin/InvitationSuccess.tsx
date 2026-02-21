import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";
import {
  IconCircleCheckFilled,
  IconMail,
  IconBuilding,
  IconCalendar,
  IconHash,
  IconArrowLeft,
  IconSend,
  IconList,
} from '@tabler/icons-react';

type SuccessState = {
  universityName: string;
  universityEmail: string;
  invitationId: string;
  expiresAt: string;
};

export function InvitationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SuccessState | null;

  // Guard: if someone navigates here directly with no state, redirect away
  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="text-muted-foreground text-sm">No invitation data found.</p>
        <Button variant="outline" onClick={() => navigate('/dashboard/admin/invitations')}>
          <IconArrowLeft className="size-4 mr-2" />
          Back to Invitations
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 max-w-xl mx-auto py-8 w-full">

      {/* Success icon + heading */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
          <IconCircleCheckFilled className="size-9 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Invitation Sent!</h2>
          <p className="text-sm text-muted-foreground mt-1">
            The invitation has been successfully dispatched to{' '}
            <span className="font-medium text-foreground">{state.universityName}</span>.
          </p>
        </div>
      </div>

      {/* Summary panel */}
      <div className={`${panel} p-6 flex flex-col gap-4 w-full`}>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Invitation Summary
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconHash className="size-4 shrink-0" /> Invitation ID
            </div>
            <Badge variant="outline" className="font-mono text-xs">{state.invitationId}</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconBuilding className="size-4 shrink-0" /> School
            </div>
            <span className="text-sm font-medium text-right">{state.universityName}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconMail className="size-4 shrink-0" /> Sent to
            </div>
            <span className="text-sm font-medium text-right">{state.universityEmail}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconCalendar className="size-4 shrink-0" /> Expires on
            </div>
            <span className="text-sm font-medium text-right">{state.expiresAt}</span>
          </div>
        </div>
        <div className="flex items-center justify-center mt-1">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 dark:bg-green-950/20 dark:text-green-400 gap-1.5 px-3 py-1">
            <IconCircleCheckFilled className="size-3.5" />
            Pending acceptance
          </Badge>
        </div>
      </div>

      {/* What to expect panel */}
      <div className={`${panel} p-6 flex flex-col gap-4 w-full`}>
        <p className="text-sm font-semibold">What happens next?</p>
        <ol className="flex flex-col gap-3">
          {[
            'The school admin receives the invitation email',
            'They click the link and set up their account',
            'Their isolated school environment is provisioned automatically',
            'They appear as Active in your Tenants list',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Action buttons */}
      <div className="flex w-full gap-3">
        <Button variant="outline" className="flex-1" onClick={() => navigate('/dashboard/admin/invitations')}>
          <IconList className="size-4 mr-2" />
          View All Invitations
        </Button>
        <Button className="flex-1 gap-2" onClick={() => navigate('/dashboard/admin/invitations/send')}>
          <IconSend className="size-4" />
          Send Another
        </Button>
      </div>
    </div>
  );
}
