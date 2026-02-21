import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { IconUsers, IconShieldCheck, IconWifi } from "@tabler/icons-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type DataPoint = {
  time: string
  voters: number
  admins: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function smoothWalk(current: number, min: number, max: number, step: number): number {
  const mid = (min + max) / 2
  const pull = (mid - current) * 0.03
  const noise = (Math.random() - 0.5) * step
  return Math.round(Math.min(max, Math.max(min, current + pull + noise)))
}

function nowLabel(): string {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  })
}

// Seed 60 seconds of smooth history so the chart looks full on mount
function seedHistory(): DataPoint[] {
  const points: DataPoint[] = []
  let voters = 48
  let admins = 8
  for (let i = 59; i >= 0; i--) {
    const t = new Date(Date.now() - i * 1000)
    points.push({
      time: t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      voters,
      admins,
    })
    voters = smoothWalk(voters, 15, 100, 3)
    admins = smoothWalk(admins, 2, 18, 1)
  }
  return points
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function LiveTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg px-3.5 py-2.5 text-xs">
      <p className="text-muted-foreground mb-1.5 font-mono">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-0.5">
          <span className="size-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LiveActivityChart() {
  const [data, setData] = React.useState<DataPoint[]>(seedHistory)
  const [pulse, setPulse] = React.useState(false)

  const latest = data[data.length - 1]

  React.useEffect(() => {
    const id = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1]
        return [
          ...prev.slice(-59),
          {
            time: nowLabel(),
            voters: smoothWalk(last.voters, 15, 100, 8),
            admins: smoothWalk(last.admins, 2, 18, 3),
          },
        ]
      })
      setPulse(true)
      setTimeout(() => setPulse(false), 400)
    }, 1500)

    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 px-5 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-semibold">Live Platform Activity</h3>
            <span className="relative flex size-2.5">
              <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${pulse ? 'animate-ping' : ''}`} />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Active users on the platform — updates every second</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700 rounded-lg px-3 py-1.5">
            <span className="size-2 rounded-full bg-[hsl(var(--chart-1))]" />
            <IconUsers className="size-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Voters</span>
            <span className="text-sm font-bold tabular-nums">{latest?.voters ?? 0}</span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700 rounded-lg px-3 py-1.5">
            <span className="size-2 rounded-full bg-[hsl(var(--chart-2))]" />
            <IconShieldCheck className="size-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Admins</span>
            <span className="text-sm font-bold tabular-nums">{latest?.admins ?? 0}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <IconWifi className="size-3.5" />
            <span className="hidden sm:inline">Live</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 pt-4 pb-2 sm:px-4 sm:pt-5">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fillVoters" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillAdmins" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              interval={9}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              width={36}
            />
            <Tooltip
              content={<LiveTooltip />}
              isAnimationActive={false}
              cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '4 2' }}
            />
            <Area
              dataKey="voters"
              name="Active Voters"
              type="monotoneX"
              fill="url(#fillVoters)"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={950}
              animationEasing="ease-in-out"
            />
            <Area
              dataKey="admins"
              name="Active Admins"
              type="monotoneX"
              fill="url(#fillAdmins)"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={950}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Showing last 60 seconds of activity</p>
        <p className="text-xs text-muted-foreground font-mono">{latest?.time}</p>
      </div>
    </div>
  )
}
