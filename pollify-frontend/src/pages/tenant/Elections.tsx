import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  IconCheckbox,
  IconCircleCheckFilled,
  IconClock,
  IconEye,
  IconFileText,
  IconPlus,
  IconSearch,
  IconTrendingUp,
  IconTrophy,
} from '@tabler/icons-react';

const panel =
  'w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl';

type ElectionStatus = 'ACTIVE' | 'DRAFT' | 'CLOSED';

type Election = {
  id: string;
  title: string;
  status: ElectionStatus;
  candidates: number;
  votes: number;
  startDate: string;
  endDate: string;
};

const MOCK_ELECTIONS: Election[] = [
  {
    id: 'EL001',
    title: 'SRC Presidential Election 2025',
    status: 'ACTIVE',
    candidates: 4,
    votes: 218,
    startDate: '2025-03-01',
    endDate: '2025-03-15',
  },
  {
    id: 'EL002',
    title: 'Faculty Rep Election – Science',
    status: 'ACTIVE',
    candidates: 3,
    votes: 89,
    startDate: '2025-03-03',
    endDate: '2025-03-10',
  },
  {
    id: 'EL003',
    title: 'Hall Week Queen Contest',
    status: 'ACTIVE',
    candidates: 6,
    votes: 35,
    startDate: '2025-03-05',
    endDate: '2025-03-08',
  },
  {
    id: 'EL004',
    title: 'Best Department Award 2024',
    status: 'CLOSED',
    candidates: 8,
    votes: 512,
    startDate: '2025-01-10',
    endDate: '2025-01-20',
  },
  {
    id: 'EL005',
    title: 'Student Union Treasurer',
    status: 'DRAFT',
    candidates: 2,
    votes: 0,
    startDate: '2025-04-01',
    endDate: '2025-04-07',
  },
  {
    id: 'EL006',
    title: 'Departmental Welfare Officer',
    status: 'DRAFT',
    candidates: 3,
    votes: 0,
    startDate: '2025-04-15',
    endDate: '2025-04-22',
  },
];

type FilterTab = 'All' | ElectionStatus;

function statusBadge(status: ElectionStatus) {
  if (status === 'ACTIVE')
    return (
      <Badge className="bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300 border-0 gap-1 text-xs">
        <IconCircleCheckFilled className="size-3" /> Active
      </Badge>
    );
  if (status === 'DRAFT')
    return (
      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300 border-0 gap-1 text-xs">
        <IconFileText className="size-3" /> Draft
      </Badge>
    );
  return (
    <Badge className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-0 gap-1 text-xs">
      <IconClock className="size-3" /> Closed
    </Badge>
  );
}

export function Elections() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  const totalElections = MOCK_ELECTIONS.length;
  const activeCount = MOCK_ELECTIONS.filter((e) => e.status === 'ACTIVE').length;
  const draftCount = MOCK_ELECTIONS.filter((e) => e.status === 'DRAFT').length;

  const filtered = MOCK_ELECTIONS.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'All' || e.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabs: FilterTab[] = ['All', 'ACTIVE', 'DRAFT', 'CLOSED'];
  const tabLabels: Record<FilterTab, string> = {
    All: 'All',
    ACTIVE: 'Active',
    DRAFT: 'Draft',
    CLOSED: 'Closed',
  };

  const stats = [
    {
      label: 'Total Elections',
      value: totalElections,
      trend: 'All time',
      icon: IconCheckbox,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: 'Active',
      value: activeCount,
      trend: 'Running now',
      icon: IconTrophy,
      iconColor: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      label: 'Draft',
      value: draftCount,
      trend: 'Not yet started',
      icon: IconFileText,
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      iconBg: 'bg-yellow-50 dark:bg-yellow-950/30',
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">All Elections</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage and monitor all elections at your institution
          </p>
        </div>
        <Button
          className="gap-2 shrink-0"
          onClick={() => navigate('/dashboard/tenant/elections/create')}
        >
          <IconPlus className="size-4" />
          Create Election
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`${panel} p-5`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.iconBg} ${stat.iconColor} p-2.5 rounded-lg`}>
                <stat.icon className="size-5" />
              </div>
              <Badge variant="outline" className="text-xs gap-1 font-normal">
                <IconTrendingUp className="size-3" />
                {stat.trend}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table Panel */}
      <div className={`${panel} overflow-hidden`}>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="relative w-full sm:w-72">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search elections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-sm"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1 bg-zinc-50 dark:bg-zinc-800/30 self-start sm:self-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm border border-zinc-200 dark:border-zinc-700'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Election Title
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Candidates
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Votes
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Start Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  End Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide pr-5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-muted-foreground">
                    <IconCheckbox className="size-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No elections match your search</p>
                  </td>
                </tr>
              ) : (
                filtered.map((election, i) => (
                  <tr
                    key={election.id}
                    className={`border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 cursor-pointer transition-colors ${
                      i === filtered.length - 1 ? 'border-0' : ''
                    }`}
                    onClick={() =>
                      navigate(`/dashboard/tenant/elections/${election.id}`)
                    }
                  >
                    <td className="px-5 py-3.5">
                      <Badge
                        variant="outline"
                        className="font-mono text-xs bg-zinc-50 dark:bg-zinc-800"
                      >
                        {election.id}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {election.title}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">{statusBadge(election.status)}</td>
                    <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-400">
                      {election.candidates}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-400 font-medium">
                      {election.votes.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-500 dark:text-zinc-400">
                      {election.startDate}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-500 dark:text-zinc-400">
                      {election.endDate}
                    </td>
                    <td
                      className="px-4 py-3.5 pr-5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          navigate(`/dashboard/tenant/elections/${election.id}`)
                        }
                      >
                        <IconEye className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {totalElections} elections
          </p>
          <p className="text-xs text-muted-foreground">Last updated: Mar 07, 2025</p>
        </div>
      </div>
    </div>
  );
}
