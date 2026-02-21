import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveActivityChart } from '@/components/live-activity-chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  IconTrendingUp,
  IconCheckbox,
  IconUsers,
  IconChartBar,
  IconTrophy,
  IconClock,
  IconLayoutGrid,
  IconList,
  IconChevronDown,
  IconChevronUp,
  IconExternalLink,
  IconPlayerPlay,
  IconLock,
  IconEdit,
  IconProgress,
} from "@tabler/icons-react";

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const stats = [
  {
    label: "Total Elections",
    value: "8",
    change: "+2 this month",
    icon: IconCheckbox,
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    label: "Active Elections",
    value: "3",
    change: "Running now",
    icon: IconTrophy,
    iconColor: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-50 dark:bg-green-950/30",
  },
  {
    label: "Registered Voters",
    value: "1,284",
    change: "+48 this week",
    icon: IconUsers,
    iconColor: "text-orange-600 dark:text-orange-400",
    iconBg: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    label: "Votes Cast Today",
    value: "342",
    change: "+12% vs yesterday",
    icon: IconChartBar,
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-50 dark:bg-purple-950/30",
  },
];

type Election = {
  id: string;
  title: string;
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  candidates: { name: string; position: string; votes: number }[];
  totalVoters: number;
  endTime: string;
  createdAt: string;
};

const recentElections: Election[] = [
  {
    id: "EL001",
    title: "SRC Presidential Election 2025",
    status: "ACTIVE",
    totalVoters: 1284,
    endTime: "2025-03-15",
    createdAt: "2025-02-01",
    candidates: [
      { name: "Kwame Asante", position: "President", votes: 118 },
      { name: "Ama Boateng", position: "President", votes: 67 },
      { name: "Kofi Mensah", position: "President", votes: 33 },
    ],
  },
  {
    id: "EL002",
    title: "Faculty Rep Election – Science",
    status: "ACTIVE",
    totalVoters: 420,
    endTime: "2025-03-10",
    createdAt: "2025-02-05",
    candidates: [
      { name: "Abena Osei", position: "Faculty Rep", votes: 52 },
      { name: "Yaw Darko", position: "Faculty Rep", votes: 37 },
    ],
  },
  {
    id: "EL003",
    title: "Hall Week Queen Contest",
    status: "ACTIVE",
    totalVoters: 310,
    endTime: "2025-03-08",
    createdAt: "2025-02-10",
    candidates: [
      { name: "Efua Sarpong", position: "Queen", votes: 20 },
      { name: "Adwoa Mensah", position: "Queen", votes: 15 },
    ],
  },
  {
    id: "EL004",
    title: "Best Department Award 2024",
    status: "CLOSED",
    totalVoters: 890,
    endTime: "2025-01-20",
    createdAt: "2025-01-01",
    candidates: [
      { name: "Computer Science", position: "Department", votes: 312 },
      { name: "Engineering", position: "Department", votes: 200 },
    ],
  },
  {
    id: "EL005",
    title: "Student Union Treasurer",
    status: "DRAFT",
    totalVoters: 0,
    endTime: "2025-04-01",
    createdAt: "2025-02-18",
    candidates: [
      { name: "Nana Frimpong", position: "Treasurer", votes: 0 },
      { name: "Esi Amoah", position: "Treasurer", votes: 0 },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusBadge(status: string) {
  if (status === "ACTIVE") return <Badge className="bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300 border-0 text-xs">Active</Badge>;
  if (status === "CLOSED") return <Badge className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-0 text-xs">Closed</Badge>;
  return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300 border-0 text-xs">Draft</Badge>;
}

function getTotalVotes(e: Election) {
  return e.candidates.reduce((s, c) => s + c.votes, 0);
}

function getTurnout(e: Election) {
  if (!e.totalVoters) return 0;
  return Math.round((getTotalVotes(e) / e.totalVoters) * 100);
}

function getLeader(e: Election) {
  return [...e.candidates].sort((a, b) => b.votes - a.votes)[0];
}

// ─── Election Metrics Panel ────────────────────────────────────────────────────

function ElectionMetrics({ election }: { election: Election }) {
  const total = getTotalVotes(election);
  const turnout = getTurnout(election);
  const leader = getLeader(election);
  const maxVotes = Math.max(...election.candidates.map(c => c.votes), 1);

  return (
    <div className="px-4 pb-4 pt-2 bg-zinc-50/70 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Turnout */}
        <div className="bg-white dark:bg-zinc-900/60 rounded-lg p-3 border border-zinc-100 dark:border-zinc-800">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Voter Turnout</div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{turnout}%</div>
          <div className="mt-2 h-1.5 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${turnout}%` }}
            />
          </div>
          <div className="text-xs text-zinc-400 mt-1">{total} of {election.totalVoters} voters</div>
        </div>

        {/* Leading Candidate */}
        <div className="bg-white dark:bg-zinc-900/60 rounded-lg p-3 border border-zinc-100 dark:border-zinc-800">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Currently Leading</div>
          {election.status === 'DRAFT' ? (
            <div className="text-sm text-zinc-400 italic mt-1">Election not started</div>
          ) : (
            <>
              <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50 truncate">{leader.name}</div>
              <div className="text-xs text-zinc-400">{leader.votes} votes</div>
              <div className="flex items-center gap-1 mt-1.5">
                <IconTrophy className="size-3 text-yellow-500" />
                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                  {total > 0 ? Math.round((leader.votes / total) * 100) : 0}% of votes
                </span>
              </div>
            </>
          )}
        </div>

        {/* End Date */}
        <div className="bg-white dark:bg-zinc-900/60 rounded-lg p-3 border border-zinc-100 dark:border-zinc-800">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            {election.status === 'CLOSED' ? 'Ended On' : 'Ends On'}
          </div>
          <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{election.endTime}</div>
          <div className="text-xs text-zinc-400 mt-1">{election.candidates.length} candidates</div>
        </div>
      </div>

      {/* Candidate Breakdown */}
      <div className="bg-white dark:bg-zinc-900/60 rounded-lg p-3 border border-zinc-100 dark:border-zinc-800">
        <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">Candidate Breakdown</div>
        <div className="flex flex-col gap-2.5">
          {[...election.candidates].sort((a, b) => b.votes - a.votes).map((c, i) => (
            <div key={c.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {i === 0 && election.status !== 'DRAFT' && total > 0 && (
                    <IconTrophy className="size-3 text-yellow-500 shrink-0" />
                  )}
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">{c.votes} votes</span>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 w-8 text-right">
                    {total > 0 ? Math.round((c.votes / total) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-orange-400' : 'bg-zinc-400'}`}
                  style={{ width: `${maxVotes > 0 ? (c.votes / maxVotes) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Election Card (card view) ─────────────────────────────────────────────────

function ElectionCard({ election, onView }: { election: Election; onView: () => void }) {
  const total = getTotalVotes(election);
  const turnout = getTurnout(election);
  const leader = getLeader(election);

  return (
    <div className={`${panel} p-5 flex flex-col gap-3`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-zinc-900 dark:text-zinc-50 truncate">{election.title}</div>
          <div className="text-xs text-zinc-400 font-mono mt-0.5">{election.id}</div>
        </div>
        {statusBadge(election.status)}
      </div>

      {/* Turnout bar */}
      <div>
        <div className="flex justify-between text-xs text-zinc-500 mb-1">
          <span>Turnout</span>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">{turnout}%</span>
        </div>
        <div className="h-1.5 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${turnout}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span className="flex items-center gap-1"><IconUsers className="size-3" /> {total.toLocaleString()} votes</span>
        <span className="flex items-center gap-1"><IconClock className="size-3" /> {election.endTime}</span>
      </div>

      {election.status !== 'DRAFT' && total > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg px-3 py-2">
          <IconTrophy className="size-3 text-yellow-500" />
          <span>Leading: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{leader.name}</span></span>
        </div>
      )}

      <Button size="sm" variant="outline" onClick={onView} className="w-full mt-auto">
        <IconExternalLink className="size-3.5" /> View Details
      </Button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function TenantOverview() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = React.useState<'table' | 'card'>('table');
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Welcome back — here's what's happening at your institution</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`${panel} p-5`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.iconBg} ${stat.iconColor} p-2.5 rounded-lg`}>
                <stat.icon className="size-5" />
              </div>
              <Badge variant="outline" className="text-xs gap-1 font-normal">
                <IconTrendingUp className="size-3" />
                {stat.change}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">{stat.value}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Live Activity Chart */}
      <div className={panel}>
        <LiveActivityChart />
      </div>

      {/* Recent Elections */}
      <div className={`${panel} overflow-hidden`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Recent Elections</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Click any election to expand its live metrics</p>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 gap-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-50' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                title="Table view"
              >
                <IconList className="size-4" />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'card' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-50' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                title="Card view"
              >
                <IconLayoutGrid className="size-4" />
              </button>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/dashboard/tenant/elections')}>
              View all →
            </Button>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Election</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Turnout</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Votes</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Ends</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide"></th>
                </tr>
              </thead>
              <tbody>
                {recentElections.map((e, i) => {
                  const total = getTotalVotes(e);
                  const turnout = getTurnout(e);
                  const isExpanded = expandedId === e.id;
                  return (
                    <React.Fragment key={e.id}>
                      <tr
                        className={`border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer ${i === recentElections.length - 1 && !isExpanded ? 'border-0' : ''}`}
                        onClick={() => toggleExpand(e.id)}
                      >
                        <td className="px-6 py-3.5">
                          <div className="font-medium text-zinc-900 dark:text-zinc-100">{e.title}</div>
                          <div className="text-xs text-zinc-400 font-mono">{e.id}</div>
                        </td>
                        <td className="px-4 py-3.5">{statusBadge(e.status)}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${turnout}%` }} />
                            </div>
                            <span className="text-xs text-zinc-500">{turnout}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-400 font-medium">{total.toLocaleString()}</td>
                        <td className="px-4 py-3.5 text-zinc-500 dark:text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <IconClock className="size-3.5" />
                            {e.endTime}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(ev) => { ev.stopPropagation(); navigate(`/dashboard/tenant/elections/${e.id}`); }}
                              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                              title="View election"
                            >
                              <IconExternalLink className="size-3.5" />
                            </button>
                            {isExpanded
                              ? <IconChevronUp className="size-4 text-zinc-400" />
                              : <IconChevronDown className="size-4 text-zinc-400" />
                            }
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${e.id}-metrics`} className={`${i === recentElections.length - 1 ? '' : 'border-b border-zinc-100 dark:border-zinc-800'}`}>
                          <td colSpan={6} className="p-0">
                            <ElectionMetrics election={e} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Card View */}
        {viewMode === 'card' && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentElections.map((e) => (
              <ElectionCard
                key={e.id}
                election={e}
                onView={() => navigate(`/dashboard/tenant/elections/${e.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
