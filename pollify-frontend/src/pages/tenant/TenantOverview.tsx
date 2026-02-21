import { Badge } from '@/components/ui/badge';
import { LiveActivityChart } from '@/components/live-activity-chart';
import {
  IconTrendingUp,
  IconCheckbox,
  IconUsers,
  IconChartBar,
  IconTrophy,
  IconClock,
} from "@tabler/icons-react";

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

const stats = [
  {
    label: "Total Elections",
    value: "8",
    change: "+2 this month",
    trend: "up",
    icon: IconCheckbox,
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    label: "Active Elections",
    value: "3",
    change: "Running now",
    trend: "up",
    icon: IconTrophy,
    iconColor: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-50 dark:bg-green-950/30",
  },
  {
    label: "Registered Voters",
    value: "1,284",
    change: "+48 this week",
    trend: "up",
    icon: IconUsers,
    iconColor: "text-orange-600 dark:text-orange-400",
    iconBg: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    label: "Votes Cast Today",
    value: "342",
    change: "+12% vs yesterday",
    trend: "up",
    icon: IconChartBar,
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-50 dark:bg-purple-950/30",
  },
];

const recentElections = [
  { id: "EL001", title: "SRC Presidential Election 2025", status: "ACTIVE", candidates: 4, votes: 218, endTime: "2025-03-15" },
  { id: "EL002", title: "Faculty Rep Election – Science", status: "ACTIVE", candidates: 3, votes: 89, endTime: "2025-03-10" },
  { id: "EL003", title: "Hall Week Queen Contest", status: "ACTIVE", candidates: 6, votes: 35, endTime: "2025-03-08" },
  { id: "EL004", title: "Best Department Award 2024", status: "CLOSED", candidates: 8, votes: 512, endTime: "2025-01-20" },
  { id: "EL005", title: "Student Union Treasurer", status: "DRAFT", candidates: 2, votes: 0, endTime: "2025-04-01" },
];

function statusBadge(status: string) {
  if (status === "ACTIVE") return <Badge className="bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300 border-0 text-xs">Active</Badge>;
  if (status === "CLOSED") return <Badge className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-0 text-xs">Closed</Badge>;
  return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300 border-0 text-xs">Draft</Badge>;
}

export function TenantOverview() {
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
      <div className={`${panel}`}>
        <LiveActivityChart />
      </div>

      {/* Recent Elections Table */}
      <div className={`${panel} overflow-hidden`}>
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Recent Elections</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Latest election activity at your institution</p>
          </div>
          <a href="/dashboard/tenant/elections" className="text-xs text-primary font-medium hover:underline">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Election</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Candidates</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Votes</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">End Date</th>
              </tr>
            </thead>
            <tbody>
              {recentElections.map((e, i) => (
                <tr key={e.id} className={`border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors ${i === recentElections.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-6 py-3.5">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{e.title}</div>
                    <div className="text-xs text-zinc-400 font-mono">{e.id}</div>
                  </td>
                  <td className="px-4 py-3.5">{statusBadge(e.status)}</td>
                  <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-400">{e.candidates}</td>
                  <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-400 font-medium">{e.votes.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <IconClock className="size-3.5" />
                    {e.endTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
