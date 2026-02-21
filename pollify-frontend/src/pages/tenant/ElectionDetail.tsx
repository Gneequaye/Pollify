import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  IconArrowLeft,
  IconTrophy,
  IconUsers,
  IconClock,
  IconChartBar,
  IconPlayerPlay,
  IconPlayerStop,
} from '@tabler/icons-react';
import { toast } from 'sonner';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

type Candidate = {
  name: string;
  position: string;
  votes: number;
};

type Election = {
  id: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED';
  startDate: string;
  endDate: string;
  candidates: Candidate[];
};

const ELECTIONS: Election[] = [
  {
    id: 'EL001',
    title: 'SRC Presidential Election 2025',
    description: 'Annual Students Representative Council presidential election open to all registered students of the university.',
    status: 'ACTIVE',
    startDate: '2025-03-01',
    endDate: '2025-03-15',
    candidates: [
      { name: 'Kwame Asante', position: 'Presidential Candidate', votes: 98 },
      { name: 'Abena Boateng', position: 'Presidential Candidate', votes: 76 },
      { name: 'Kofi Mensah', position: 'Presidential Candidate', votes: 44 },
    ],
  },
  {
    id: 'EL002',
    title: 'Faculty Rep Election – Science',
    description: 'Election for the Faculty of Science student representative to the university senate.',
    status: 'ACTIVE',
    startDate: '2025-03-03',
    endDate: '2025-03-10',
    candidates: [
      { name: 'Efua Darko', position: 'Faculty Rep Candidate', votes: 52 },
      { name: 'Yaw Appiah', position: 'Faculty Rep Candidate', votes: 37 },
    ],
  },
  {
    id: 'EL003',
    title: 'Hall Week Queen Contest',
    description: 'Annual Hall Week Queen competition for female students residing in the university halls.',
    status: 'ACTIVE',
    startDate: '2025-03-05',
    endDate: '2025-03-08',
    candidates: [
      { name: 'Adwoa Frimpong', position: 'Contestant', votes: 18 },
      { name: 'Maame Serwaa', position: 'Contestant', votes: 11 },
      { name: 'Akua Poku', position: 'Contestant', votes: 6 },
    ],
  },
  {
    id: 'EL004',
    title: 'Best Department Award 2024',
    description: 'Student-voted award for the best performing academic department of the year.',
    status: 'CLOSED',
    startDate: '2025-01-10',
    endDate: '2025-01-20',
    candidates: [
      { name: 'Computer Science Dept.', position: 'Department', votes: 198 },
      { name: 'Engineering Dept.', position: 'Department', votes: 157 },
      { name: 'Business School', position: 'Department', votes: 102 },
      { name: 'Law Faculty', position: 'Department', votes: 55 },
    ],
  },
  {
    id: 'EL005',
    title: 'Student Union Treasurer',
    description: 'Election for the Student Union treasury position for the 2025/2026 academic year.',
    status: 'DRAFT',
    startDate: '2025-04-01',
    endDate: '2025-04-10',
    candidates: [
      { name: 'Nana Yaw Boadi', position: 'Treasurer Candidate', votes: 0 },
      { name: 'Esi Turkson', position: 'Treasurer Candidate', votes: 0 },
    ],
  },
  {
    id: 'EL006',
    title: 'Hall Week Queen Contest 2024',
    description: 'Previous year Hall Week Queen contest — now closed.',
    status: 'CLOSED',
    startDate: '2024-11-01',
    endDate: '2024-11-05',
    candidates: [
      { name: 'Abena Mensah', position: 'Contestant', votes: 142 },
      { name: 'Efua Asante', position: 'Contestant', votes: 119 },
      { name: 'Adwoa Boateng', position: 'Contestant', votes: 87 },
    ],
  },
];

function statusBadge(status: string) {
  if (status === 'ACTIVE')
    return <Badge className="bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300 border-0">Active</Badge>;
  if (status === 'CLOSED')
    return <Badge className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-0">Closed</Badge>;
  return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300 border-0">Draft</Badge>;
}

function timeRemaining(endDate: string, status: string): string {
  if (status === 'CLOSED') return 'Ended';
  if (status === 'DRAFT') return 'Not started';
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return 'Ending soon';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}

export function ElectionDetail() {
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();

  const election = ELECTIONS.find(e => e.id === electionId);

  const goBack = () => navigate('/dashboard/tenant/elections');

  if (!election) {
    return (
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1 w-fit"
          onClick={goBack}
        >
          <IconArrowLeft className="size-4" /> Back to Elections
        </Button>
        <div className={`${panel} p-12 flex flex-col items-center text-center gap-4`}>
          <IconChartBar className="size-12 text-muted-foreground opacity-30" />
          <div>
            <p className="text-base font-semibold">Election not found</p>
            <p className="text-sm text-muted-foreground mt-1">
              The election with ID <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{electionId}</code> does not exist.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={goBack}>
            Return to Elections
          </Button>
        </div>
      </div>
    );
  }

  const totalVotes = election.candidates.reduce((sum, c) => sum + c.votes, 0);
  const winner = totalVotes > 0
    ? [...election.candidates].sort((a, b) => b.votes - a.votes)[0]
    : null;

  const handleActivate = async () => {
    await new Promise(r => setTimeout(r, 800));
    toast.success(`"${election.title}" has been activated`);
  };

  const handleClose = async () => {
    await new Promise(r => setTimeout(r, 800));
    toast.success(`"${election.title}" has been closed`);
  };

  const BAR_COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-rose-500', 'bg-teal-500'];

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1 w-fit"
        onClick={goBack}
      >
        <IconArrowLeft className="size-4" /> Back to Elections
      </Button>

      {/* Hero panel */}
      <div className={`${panel} p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{election.title}</h1>
              {statusBadge(election.status)}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{election.description}</p>
            <div className="flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <IconClock className="size-3.5" />
                Start: {election.startDate}
              </span>
              <span className="flex items-center gap-1.5">
                <IconClock className="size-3.5" />
                End: {election.endDate}
              </span>
              <span className="font-mono text-zinc-400">{election.id}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0">
            {election.status === 'DRAFT' && (
              <Button size="sm" className="gap-1.5" onClick={handleActivate}>
                <IconPlayerPlay className="size-3.5" /> Activate
              </Button>
            )}
            {election.status === 'ACTIVE' && (
              <Button size="sm" variant="outline" className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30" onClick={handleClose}>
                <IconPlayerStop className="size-3.5" /> Close Election
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stat mini-cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Votes',
            value: totalVotes.toLocaleString(),
            icon: IconChartBar,
            iconColor: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-50 dark:bg-blue-950/30',
          },
          {
            label: 'Candidates',
            value: String(election.candidates.length),
            icon: IconUsers,
            iconColor: 'text-purple-600 dark:text-purple-400',
            iconBg: 'bg-purple-50 dark:bg-purple-950/30',
          },
          {
            label: 'Time Remaining',
            value: timeRemaining(election.endDate, election.status),
            icon: IconClock,
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
          },
        ].map(stat => (
          <div key={stat.label} className={`${panel} p-5 flex items-center gap-4`}>
            <div className={`${stat.iconBg} ${stat.iconColor} p-3 rounded-xl`}>
              <stat.icon className="size-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Candidates panel */}
      <div className={`${panel} overflow-hidden`}>
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-base font-semibold">Candidates</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {election.status === 'CLOSED' ? 'Final results' : 'Live vote counts'}
          </p>
        </div>
        <Separator className="bg-zinc-100 dark:bg-zinc-800" />
        <div className="p-6 flex flex-col gap-5">
          {[...election.candidates]
            .sort((a, b) => b.votes - a.votes)
            .map((candidate, i) => {
              const pct = totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0;
              const isWinner = election.status === 'CLOSED' && winner?.name === candidate.name;
              return (
                <div key={candidate.name}>
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="size-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold flex items-center justify-center text-zinc-500 shrink-0">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-medium ${isWinner ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-700 dark:text-zinc-300'}`}>
                            {candidate.name}
                          </span>
                          {isWinner && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                              <IconTrophy className="size-3.5" /> Winner
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{candidate.position}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-right">
                      <span className="text-xs text-zinc-500">{candidate.votes.toLocaleString()} votes</span>
                      <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 w-10">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden ml-8">
                    <div
                      className={`h-full rounded-full ${isWinner ? 'bg-amber-500' : BAR_COLORS[i % BAR_COLORS.length]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

    </div>
  );
}
