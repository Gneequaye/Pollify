import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  IconSettings,
  IconPalette,
  IconBell,
  IconShield,
  IconServer,
  IconCircleCheckFilled,
  IconAlertCircle,
  IconMoon,
  IconSun,
  IconDeviceDesktop,
} from '@tabler/icons-react';
import { toast } from 'sonner';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

export function TenantSettings() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState({
    newVoter: true,
    electionStart: true,
    electionEnd: true,
    resultsReady: true,
  });
  const [security, setSecurity] = useState({
    sessionTimeout: true,
    loginAlerts: true,
  });

  const toggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const toggleSec = (key: keyof typeof security) => {
    setSecurity(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your school dashboard preferences</p>
      </div>

      {/* Appearance */}
      <div className={`${panel} p-6`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="size-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
            <IconPalette className="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Appearance</h2>
            <p className="text-xs text-muted-foreground">Choose your dashboard theme</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                theme === t
                  ? 'border-primary bg-primary/5'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              {t === 'light' && <IconSun className="size-5 text-amber-500" />}
              {t === 'dark' && <IconMoon className="size-5 text-blue-500" />}
              {t === 'system' && <IconDeviceDesktop className="size-5 text-zinc-500" />}
              <span className="text-xs font-medium capitalize">{t}</span>
              {theme === t && <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">Active</Badge>}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className={`${panel} p-6`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="size-9 rounded-lg bg-green-50 dark:bg-green-950/40 flex items-center justify-center">
            <IconBell className="size-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Notification Preferences</h2>
            <p className="text-xs text-muted-foreground">Choose what you want to be notified about</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { key: 'newVoter' as const, label: 'New Voter Registered', desc: 'When a new student registers as a voter' },
            { key: 'electionStart' as const, label: 'Election Started', desc: 'When an election goes live' },
            { key: 'electionEnd' as const, label: 'Election Ended', desc: 'When an election closes' },
            { key: 'resultsReady' as const, label: 'Results Available', desc: 'When results are ready to view' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <button
                onClick={() => toggle(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[key] ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-600'
                }`}
              >
                <span className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${
                  notifications[key] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className={`${panel} p-6`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="size-9 rounded-lg bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center">
            <IconShield className="size-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Security</h2>
            <p className="text-xs text-muted-foreground">Manage session and login security</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { key: 'sessionTimeout' as const, label: 'Auto Session Timeout', desc: 'Automatically log out after 30 minutes of inactivity' },
            { key: 'loginAlerts' as const, label: 'Login Alerts', desc: 'Receive an alert when a new login is detected' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <button
                onClick={() => toggleSec(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  security[key] ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-600'
                }`}
              >
                <span className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${
                  security[key] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* School Status */}
      <div className={`${panel} p-6`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <IconServer className="size-5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">School Environment</h2>
            <p className="text-xs text-muted-foreground">Your school's platform status</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {[
            { label: 'Voter Registration', status: 'Operational' },
            { label: 'Election Engine', status: 'Operational' },
            { label: 'Results Service', status: 'Operational' },
            { label: 'Notification Service', status: 'Operational' },
          ].map(({ label, status }) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
              <span className="text-sm font-medium">{label}</span>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400 border-0 gap-1 text-xs">
                <IconCircleCheckFilled className="size-3" /> {status}
              </Badge>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
          <IconAlertCircle className="size-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-medium">School Info</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-muted-foreground">
              <span>Platform Version</span><span className="font-mono text-zinc-700 dark:text-zinc-300">v1.0.0</span>
              <span>Schema</span><span className="font-mono text-zinc-700 dark:text-zinc-300">tenant_ug</span>
              <span>Environment</span><span className="font-mono text-zinc-700 dark:text-zinc-300">Production</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => toast.success('Settings saved successfully')}
          >
            <IconSettings className="size-3.5 mr-1.5" /> Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
