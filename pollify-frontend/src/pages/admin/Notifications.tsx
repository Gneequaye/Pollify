import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  IconBell,
  IconBellOff,
  IconCircleCheckFilled,
  IconBuilding,
  IconMail,
  IconUsers,
  IconAlertCircle,
  IconInfoCircle,
  IconCheck,
  IconTrash,
} from '@tabler/icons-react';
import { toast } from 'sonner';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

type NotificationType = 'tenant' | 'invitation' | 'user' | 'system' | 'alert';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'N001', type: 'tenant', title: 'New Tenant Onboarded', message: 'Ashesi University has completed onboarding and is now active on the platform.', time: '2 minutes ago', read: false },
  { id: 'N002', type: 'invitation', title: 'Invitation Accepted', message: 'University of Cape Coast has accepted the invitation and set up their admin account.', time: '1 hour ago', read: false },
  { id: 'N003', type: 'alert', title: 'Invitation Expired', message: 'The invitation sent to Ghana Institute of Management has expired without response.', time: '3 hours ago', read: false },
  { id: 'N004', type: 'user', title: 'New System User Created', message: 'Efua Adjei was added as a Super Admin to the platform.', time: '5 hours ago', read: true },
  { id: 'N005', type: 'system', title: 'Database Migration Complete', message: 'Tenant schema migration for KNUST completed successfully with no errors.', time: 'Yesterday', read: true },
  { id: 'N006', type: 'invitation', title: 'Invitation Sent', message: 'An invitation was sent to University of Education, Winneba.', time: 'Yesterday', read: true },
  { id: 'N007', type: 'tenant', title: 'Tenant Suspended', message: 'University of Mines and Technology tenant has been suspended by the system.', time: '2 days ago', read: true },
  { id: 'N008', type: 'system', title: 'System Health Check', message: 'All services are running normally. Database response time: 12ms.', time: '3 days ago', read: true },
];

const TYPE_CONFIG: Record<NotificationType, { icon: typeof IconBell; color: string; bg: string; label: string }> = {
  tenant:     { icon: IconBuilding,      color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-100 dark:bg-blue-950/40',    label: 'Tenant' },
  invitation: { icon: IconMail,          color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-950/40', label: 'Invitation' },
  user:       { icon: IconUsers,         color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-950/40', label: 'User' },
  system:     { icon: IconInfoCircle,    color: 'text-zinc-600 dark:text-zinc-400',    bg: 'bg-zinc-100 dark:bg-zinc-800',       label: 'System' },
  alert:      { icon: IconAlertCircle,   color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-100 dark:bg-amber-950/40',  label: 'Alert' },
};

export function Notifications() {
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

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: notifications.length, color: 'text-zinc-600 dark:text-zinc-400', bg: 'bg-zinc-50 dark:bg-zinc-800/40' },
          { label: 'Unread', value: unreadCount, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/20' },
          { label: 'Alerts', value: notifications.filter(n => n.type === 'alert').length, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20' },
          { label: 'System', value: notifications.filter(n => n.type === 'system').length, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20' },
        ].map(stat => (
          <div key={stat.label} className={`${panel} p-4 flex items-center justify-between`}>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <span className={`text-2xl font-bold tabular-nums ${stat.color}`}>{stat.value}</span>
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
              <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border-0 text-xs">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Filter toggle */}
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
                  className={`flex items-start gap-4 px-5 py-4 transition-colors ${
                    !notification.read ? 'bg-violet-50/40 dark:bg-violet-950/10' : 'hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30'
                  }`}
                >
                  {/* Icon */}
                  <div className={`size-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className={`size-4 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-foreground/80'}`}>
                          {notification.title}
                        </p>
                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-4">
                          {config.label}
                        </Badge>
                        {!notification.read && (
                          <span className="size-1.5 rounded-full bg-violet-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{notification.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notification.message}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    {!notification.read && (
                      <button
                        onClick={() => markRead(notification.id)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                        title="Mark as read"
                      >
                        <IconCircleCheckFilled className="size-4" />
                      </button>
                    )}
                    <button
                      onClick={() => dismiss(notification.id)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Dismiss"
                    >
                      <IconTrash className="size-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {displayed.length > 0 && (
          <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-muted-foreground">Showing {displayed.length} notification{displayed.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}
