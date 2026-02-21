import { Badge } from '@/components/ui/badge';
import {
  IconTrophy,
  IconChartBar,
  IconUsers,
  IconTrendingUp,
} from '@tabler/icons-react';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

type Candidate = {
  name: string;
  votes: number;
};

type ClosedElection = {
  id: string;
  title: string;
  totalVotes: number;
  candidates: Candidate[];
};

const CLOSED_ELECTIONS: ClosedElection[] = [
  {
    id: 'EL004',
    title: 'Best Department Award 2024',
    totalVotes: 512,
    candidates: [
      { name: 'Computer Science Dept.', votes: 198 },
      { name: 'Engineering Dept.', votes: 157 },
      { name: 'Business School', votes: 102 },
      { name: 'Law Faculty', votes: 55 },
    ],
  },
  {
    id: 'EL006',
    title: 'Hall Week Queen Contest 2024',
    totalVotes: 348,
    candidates: [
      { name: 'Abena Mensah', votes: 142 },
      { name: 'Efua Asante', votes: 119 },
      { name: 'Adwoa Boateng', votes: 87 },
    ],
  },
];

const BAR_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-emerald-500',
  'bg-orange-500',
];

export function Results() {
  const totalVotesCast = CLOSED_ELECTIONS.reduce((sum, e) => sum + e.totalVotes, 0);

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Results &amp; Reports</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          View detailed results and analytics for completed elections
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Votes Cast',
            value: totalVotesCast.toLocaleString(),
            icon: IconChartBar,
            iconColor: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-50 dark:bg-blue-950/30',
            change: 'Across all elections',
          },
          {
            label: 'Participation Rate',
            value: '68.4%',
            icon: IconTrendingUp,
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
            change: '+5.2% vs last term',
          },
          {
            label: 'Elections Completed',
            value: String(CLOSED_ELECTIONS.length),
            icon: IconUsers,
            iconColor: 'text-purple-600 dark:text-purple-400',
            iconBg: 'bg-purple-50 dark:bg-purple-950/30',
            change: 'This academic year',
          },
        ].map(stat => (
          <div key={stat.label} className={`${panel} p-5`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.iconBg} ${stat.iconColor} p-2.5 rounded-lg`}>
                <stat.icon className="size-5" />
              </div>
              <Badge variant="outline" className="text-xs gap-1 font-normal">
                {stat.change}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">{stat.value}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Closed Elections with Bar Charts */}
      <div className="flex flex-col gap-4">
        {CLOSED_ELECTIONS.map(election => {
          const winner = [...election.candidates].sort((a, b) => b.votes - a.votes)[0];
          return (
            <div key={election.id} className={`${panel} p-6`}>
              {/* Election header */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{election.title}</h2>
                    <Badge className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-0 text-xs">
                      Closed
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">{election.id}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                    {election.totalVotes.toLocaleString()} total votes
                  </div>
                </div>
              </div>

              {/* Candidate bars */}
              <div className="flex flex-col gap-4">
                {[...election.candidates]
                  .sort((a, b) => b.votes - a.votes)
                  .map((candidate, i) => {
                    const pct = election.totalVotes > 0
                      ? Math.round((candidate.votes / election.totalVotes) * 100)
                      : 0;
                    const isWinner = candidate.name === winner.name;
                    return (
                      <div key={candidate.name}>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            {isWinner && (
                              <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                                <IconTrophy className="size-3.5" />
                                Winner
                              </span>
                            )}
                            <span className={`text-sm font-medium truncate ${isWinner ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-600 dark:text-zinc-400'}`}>
                              {candidate.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {candidate.votes.toLocaleString()} votes
                            </span>
                            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 w-10 text-right">
                              {pct}%
                            </span>
                          </div>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isWinner ? 'bg-amber-500' : BAR_COLORS[i % BAR_COLORS.length]}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
