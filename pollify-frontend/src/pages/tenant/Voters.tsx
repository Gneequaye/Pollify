import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  IconCircleCheckFilled,
  IconClock,
  IconEye,
  IconSearch,
  IconTrendingUp,
  IconUserCheck,
  IconUserPlus,
  IconUsers,
} from '@tabler/icons-react';

const panel =
  'w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl';

type VoterStatus = 'Verified' | 'Pending';

type Voter = {
  id: string;
  fullName: string;
  email: string;
  studentId: string;
  status: VoterStatus;
  registeredDate: string;
  hasVoted: boolean;
};

const MOCK_VOTERS: Voter[] = [
  {
    id: 'VOT-001',
    fullName: 'Ama Osei',
    email: 'ama.osei@ug.edu.gh',
    studentId: 'UG-10234567',
    status: 'Verified',
    registeredDate: '2025-01-15',
    hasVoted: true,
  },
  {
    id: 'VOT-002',
    fullName: 'Kofi Mensah',
    email: 'kofi.mensah@ug.edu.gh',
    studentId: 'UG-10234891',
    status: 'Verified',
    registeredDate: '2025-01-17',
    hasVoted: true,
  },
  {
    id: 'VOT-003',
    fullName: 'Abena Darko',
    email: 'abena.darko@ug.edu.gh',
    studentId: 'UG-10235102',
    status: 'Verified',
    registeredDate: '2025-02-01',
    hasVoted: false,
  },
  {
    id: 'VOT-004',
    fullName: 'Yaw Asante',
    email: 'yaw.asante@ug.edu.gh',
    studentId: 'UG-10235340',
    status: 'Pending',
    registeredDate: '2025-02-10',
    hasVoted: false,
  },
  {
    id: 'VOT-005',
    fullName: 'Efua Boateng',
    email: 'efua.boateng@ug.edu.gh',
    studentId: 'UG-10235677',
    status: 'Pending',
    registeredDate: '2025-02-18',
    hasVoted: false,
  },
  {
    id: 'VOT-006',
    fullName: 'Kwame Adjei',
    email: 'kwame.adjei@ug.edu.gh',
    studentId: 'UG-10235999',
    status: 'Verified',
    registeredDate: '2025-02-20',
    hasVoted: true,
  },
];

function statusBadge(status: VoterStatus) {
  if (status === 'Verified') {
    return (
      <Badge className="bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300 border-0 gap-1 text-xs">
        <IconCircleCheckFilled className="size-3" /> Verified
      </Badge>
    );
  }
  return (
    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300 border-0 gap-1 text-xs">
      <IconClock className="size-3" /> Pending
    </Badge>
  );
}

function votedBadge(hasVoted: boolean) {
  if (hasVoted) {
    return (
      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-0 text-xs">
        Yes
      </Badge>
    );
  }
  return (
    <Badge className="bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-0 text-xs">
      No
    </Badge>
  );
}

export function Voters() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const totalVoters = MOCK_VOTERS.length;
  const verifiedCount = MOCK_VOTERS.filter((v) => v.status === 'Verified').length;
  const votedTodayCount = MOCK_VOTERS.filter((v) => v.hasVoted).length;

  const filtered = MOCK_VOTERS.filter(
    (v) =>
      v.fullName.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      v.studentId.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    {
      label: 'Total Voters',
      value: totalVoters,
      trend: 'Registered',
      icon: IconUsers,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: 'Verified',
      value: verifiedCount,
      trend: 'Identity confirmed',
      icon: IconUserCheck,
      iconColor: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      label: 'Voted Today',
      value: votedTodayCount,
      trend: 'Ballots cast',
      icon: IconCircleCheckFilled,
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-50 dark:bg-purple-950/30',
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">All Voters</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage registered voters for your institution's elections
          </p>
        </div>
        <Button
          className="gap-2 shrink-0"
          onClick={() => navigate('/dashboard/tenant/voters/register')}
        >
          <IconUserPlus className="size-4" />
          Register Voter
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
          <div>
            <h2 className="text-base font-semibold">Registered Voters</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filtered.length} voter{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search voters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-sm"
            />
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
                  Voter
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Student ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Registered
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Has Voted
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide pr-5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-muted-foreground">
                    <IconUsers className="size-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No voters match your search</p>
                  </td>
                </tr>
              ) : (
                filtered.map((voter, i) => (
                  <tr
                    key={voter.id}
                    className={`border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors ${
                      i === filtered.length - 1 ? 'border-0' : ''
                    }`}
                  >
                    {/* ID */}
                    <td className="px-5 py-3.5">
                      <Badge
                        variant="outline"
                        className="font-mono text-xs bg-zinc-50 dark:bg-zinc-800"
                      >
                        {voter.id}
                      </Badge>
                    </td>
                    {/* Voter */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {voter.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {voter.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground">{voter.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Student ID */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded">
                        {voter.studentId}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3.5">{statusBadge(voter.status)}</td>
                    {/* Registered */}
                    <td className="px-4 py-3.5 text-zinc-500 dark:text-zinc-400 text-sm">
                      {voter.registeredDate}
                    </td>
                    {/* Has Voted */}
                    <td className="px-4 py-3.5">{votedBadge(voter.hasVoted)}</td>
                    {/* Actions */}
                    <td className="px-4 py-3.5 pr-5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          toast.info('Feature coming soon', {
                            description: `Voter detail view for ${voter.fullName} is not yet available.`,
                          })
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
            Showing {filtered.length} of {totalVoters} voters
          </p>
          <p className="text-xs text-muted-foreground">Last updated: Mar 07, 2025</p>
        </div>
      </div>
    </div>
  );
}
