import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { Badge } from '@/components/ui/badge'
import { LiveActivityChart } from '@/components/live-activity-chart'

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

export function Overview() {
  // TODO: Fetch real data from API
  const metrics = {
    totalTenants: 4,
    activeTenants: 2,
    totalInvitations: 6,
    pendingInvitations: 2,
  };

  const cards = [
    {
      label: "Total Tenants",
      value: metrics.totalTenants,
      badge: "All time",
      badgeIcon: <IconTrendingUp className="size-3" />,
      footer: "Registered schools",
      sub: "All universities on the platform",
      icon: <IconTrendingUp className="size-3.5" />,
    },
    {
      label: "Active Tenants",
      value: metrics.activeTenants,
      badge: "Live",
      badgeIcon: <IconTrendingUp className="size-3" />,
      footer: "Currently active",
      sub: "Schools running elections now",
      icon: <IconTrendingUp className="size-3.5" />,
    },
    {
      label: "Total Invitations",
      value: metrics.totalInvitations,
      badge: "All time",
      badgeIcon: <IconTrendingUp className="size-3" />,
      footer: "Invitations sent",
      sub: "Total invitations dispatched",
      icon: <IconTrendingUp className="size-3.5" />,
    },
    {
      label: "Pending Invitations",
      value: metrics.pendingInvitations,
      badge: "Awaiting",
      badgeIcon: <IconTrendingDown className="size-3" />,
      footer: "Awaiting acceptance",
      sub: "Schools yet to onboard",
      icon: <IconTrendingDown className="size-3.5" />,
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className={`${panel} p-5 flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <Badge variant="outline" className="gap-1 text-xs">
                {c.badgeIcon} {c.badge}
              </Badge>
            </div>
            <p className="text-3xl font-semibold tabular-nums">{c.value}</p>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium flex items-center gap-1">
                {c.footer} {c.icon}
              </p>
              <p className="text-xs text-muted-foreground">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Live Activity Chart */}
      <div className={`${panel} overflow-hidden`}>
        <LiveActivityChart />
      </div>
    </div>
  );
}
