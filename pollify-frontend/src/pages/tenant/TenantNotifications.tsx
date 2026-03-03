import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  IconBell,
  IconBellOff,
  IconCircleCheckFilled,
  IconChartBar,
  IconUsers,
  IconInfoCircle,
  IconTrophy,
  IconCheck,
  IconTrash,
} from '@tabler/icons-react';
import { toast } from 'sonner';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

type NotificationType = 'election' | 'voter' | 'system' | 'results';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'N001',
    type: 'election',
    title: 'SRC Election — 50 New Votes',
    message: 'The SRC Presidential Election 2025 has received 50 new votes in the last hour. Total votes cast: 218.',
    time: '5 minutes ago',
    read: false,
  },
  {
    id: 'N002',
    type: 'voter',
    title: 'New Voter Registered',
    message: 'John Mensah (Student ID: UG-2025-0042) has been registered as a voter and is pending email verification.',
    time: '32 minutes ago',
    read: false,
  },
  {
    id: 'N003',
    type: 'election',
    title: "Election 'Faculty Rep' Ending Soon",
    message: "The Faculty Rep Election – Science is ending in 2 hours. Remind eligible voters to cast their ballots.",
    time: '1 hour ago',
    read: false,
  },
  {
    id: 'N004',
    type: 'system',
    title: 'System Maintenance Scheduled',
    message: 'Scheduled maintenance is planned for Sunday, 23 Feb 2026 from 2:00 AM – 4:00 AM. Elections will be paused during this window.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: 'N005',
    type: 'results',
    title: 'Results Published — Best Department Award',
    message: 'Final results for the Best Department Award 2024 have been published. Computer Science won with 198 votes (38.7%).',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 'N006',
    type: 'voter',
    title: 'Voter List Updated',
    message: '24 new voters were bulk-imported from the student registry. They will receive verification emails shortly.',
    time: '2 days ago',
    read: true,
  },
];

const TYPE_CONFIG: Record<NotificationType, { icon: typeof IconBell; color: string; bg: string; label: string }> = {
  election: { icon: IconChartBar, color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-100 dark:bg-blue-950/40',    label: 'Election' },
  voter:    { icon: IconUsers,    color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-950/40',  label: 'Voter' },
  system:   { icon: IconInfoCircle, color: 'text-zinc-600 dark:text-zinc-400', bg: 'bg-zinc-100 dark:bg-zinc-800',       label: 'System' },
  results:  { icon: IconTrophy,   color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-950/40', label: 'Results' },
};

export function TenantNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayed = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification dismissed');
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Stats cards — matches design system */}
      <div className="grid grid-cols-2 gap-4 @xl/main:grid-cols-4">
        {[
          { label: 'Total',     value: notifications.length,                                     badge: 'All',      icon: <IconBell className="size-3" />,        footer: 'All notifications',    sub: 'Lifetime total' },
          { label: 'Unread',    value: unreadCount,                                              badge: 'New',      icon: <IconBell className="size-3" />,        footer: 'Awaiting your review', sub: 'Action needed' },
          { label: 'Elections', value: notifications.filter(n => n.type === 'election').length,  badge: 'Election', icon: <IconChartBar className="size-3" />,    footer: 'Election activity',    sub: 'Votes & updates' },
          { label: 'Results',   value: notifications.filter(n => n.type === 'results').length,   badge: 'Results',  icon: <IconTrophy className="size-3" />,      footer: 'Published results',    sub: 'Completed elections' },
        ].map((c) => (
          <div key={c.label} className={`${panel} p-5 flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <Badge variant="outline" className="gap-1 text-xs">{c.icon} {c.badge}</Badge>
            </div>
            <p className="text-3xl font-semibold tabular-nums">{c.value}</p>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">{c.footer}</p>
              <p className="text-xs text-muted-foreground">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Notification list */}
      <div className={`${panel} overflow-hidden`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-0 text-xs">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
              {(['all', 'unread'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize ${
                    filter === f
                      ? 'bg-white dark:bg-zinc-700 text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" onClick={markAllRead}>
                <IconCheck className="size-3.5" /> Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <IconBellOff className="size-10 text-muted-foreground opacity-30" />
              <div>
                <p className="text-sm font-medium">No notifications</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {filter === 'unread' ? 'You have no unread notifications' : 'You are all caught up!'}
                </p>
              </div>
            </div>
          ) : (
            displayed.map(notification => {
              const config = TYPE_CONFIG[notification.type];
              const Icon = config.icon;
              return (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && markRead(notification.id)}
                  className={`flex items-start gap-3 px-5 py-4 transition-colors cursor-default ${
                    !notification.read ? 'bg-blue-50/40 dark:bg-blue-950/10' : 'hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30'
                  }`}
                >
                  {/* Icon */}
                  <div className={`size-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className={`size-4 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        {!notification.read && (
                          <span className="size-1.5 rounded-full bg-blue-500 shrink-0" />
                        )}
                        <p className={`text-sm font-medium truncate ${!notification.read ? 'text-foreground' : 'text-foreground/80'}`}>
                          {notification.title}
                        </p>
                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 shrink-0">
                          {config.label}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{notification.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notification.message}</p>

                    {/* Actions inline below message */}
                    <div className="flex items-center gap-2 mt-2">
                      {!notification.read && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markRead(notification.id); }}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-emerald-600 transition-colors"
                        >
                          <IconCircleCheckFilled className="size-3.5" /> Mark read
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); dismiss(notification.id); }}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <IconTrash className="size-3.5" /> Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {displayed.length > 0 && (
          <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-muted-foreground">
              Showing {displayed.length} notification{displayed.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
