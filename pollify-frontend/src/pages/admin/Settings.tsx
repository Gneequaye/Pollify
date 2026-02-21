import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  IconSettings,
  IconPalette,
  IconShieldLock,
  IconDatabase,
  IconBell,
  IconCircleCheckFilled,
  IconMoon,
  IconSun,
  IconDeviceDesktop,
  IconCheck,
} from '@tabler/icons-react';
import { useTheme } from '@/components/theme-provider';
import { toast } from 'sonner';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

type ToggleProps = { enabled: boolean; onChange: (v: boolean) => void };
function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? 'bg-primary' : 'bg-zinc-200 dark:bg-zinc-700'
      }`}
    >
      <span className={`inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [notifs, setNotifs] = useState({
    tenantActivity: true,
    invitations: true,
    systemAlerts: true,
    userCreation: false,
    weeklyReport: true,
  });
  const [security, setSecurity] = useState({
    sessionTimeout: true,
    loginAlerts: true,
    twoFactor: false,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const themes = [
    { value: 'light', label: 'Light', icon: IconSun },
    { value: 'dark', label: 'Dark', icon: IconMoon },
    { value: 'system', label: 'System', icon: IconDeviceDesktop },
  ] as const;

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">

          {/* Appearance */}
          <div className={`${panel} p-6`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <IconPalette className="size-3.5" />
              </span>
              <h2 className="text-base font-semibold">Appearance</h2>
            </div>
            <p className="text-sm text-muted-foreground ml-8 mb-5">Customise how the platform looks for you.</p>
            <Separator className="bg-zinc-100 dark:bg-zinc-800 mb-5" />

            <div>
              <p className="text-sm font-medium mb-3">Theme</p>
              <div className="grid grid-cols-3 gap-3">
                {themes.map(t => {
                  const Icon = t.icon;
                  const active = theme === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        active
                          ? 'border-primary bg-primary/5'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                      }`}
                    >
                      {active && <IconCheck className="absolute top-2 right-2 size-3.5 text-primary" />}
                      <Icon className={`size-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`text-xs font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className={`${panel} p-6`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <IconBell className="size-3.5" />
              </span>
              <h2 className="text-base font-semibold">Notification Preferences</h2>
            </div>
            <p className="text-sm text-muted-foreground ml-8 mb-5">Choose which events trigger notifications.</p>
            <Separator className="bg-zinc-100 dark:bg-zinc-800 mb-5" />

            <div className="space-y-4">
              {[
                { key: 'tenantActivity', label: 'Tenant Activity', desc: 'Onboarding completions, status changes' },
                { key: 'invitations', label: 'Invitation Updates', desc: 'Accepted, expired or revoked invitations' },
                { key: 'systemAlerts', label: 'System Alerts', desc: 'Migration failures, health check warnings' },
                { key: 'userCreation', label: 'User Creation', desc: 'When new system users are added' },
                { key: 'weeklyReport', label: 'Weekly Report', desc: 'Summary of platform activity each week' },
              ].map((item, i, arr) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle
                      enabled={notifs[item.key as keyof typeof notifs]}
                      onChange={v => setNotifs(prev => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                  {i < arr.length - 1 && <Separator className="mt-4 bg-zinc-100 dark:bg-zinc-800" />}
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className={`${panel} p-6`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <IconShieldLock className="size-3.5" />
              </span>
              <h2 className="text-base font-semibold">Security</h2>
            </div>
            <p className="text-sm text-muted-foreground ml-8 mb-5">Control account security preferences.</p>
            <Separator className="bg-zinc-100 dark:bg-zinc-800 mb-5" />

            <div className="space-y-4">
              {[
                { key: 'sessionTimeout', label: 'Auto Session Timeout', desc: 'Automatically log out after 30 minutes of inactivity' },
                { key: 'loginAlerts', label: 'Login Alerts', desc: 'Receive an email when a new login is detected' },
                { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Require a second verification step on login' },
              ].map((item, i, arr) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{item.label}</p>
                        {item.key === 'twoFactor' && (
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-0 text-xs">Recommended</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle
                      enabled={security[item.key as keyof typeof security]}
                      onChange={v => setSecurity(prev => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                  {i < arr.length - 1 && <Separator className="mt-4 bg-zinc-100 dark:bg-zinc-800" />}
                </div>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <Button className="gap-2 px-6" onClick={handleSave}>
              <IconCircleCheckFilled className="size-4" /> Save Settings
            </Button>
          </div>
        </div>

        {/* RIGHT: Platform info */}
        <div className="flex flex-col gap-4">
          <div className={`${panel} p-6`}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Platform Status</h3>
            <div className="space-y-3">
              {[
                { label: 'API', status: 'Operational', ok: true },
                { label: 'Database', status: 'Operational', ok: true },
                { label: 'WebSocket', status: 'Operational', ok: true },
                { label: 'Auth Service', status: 'Operational', ok: true },
                { label: 'File Storage', status: 'Degraded', ok: false },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className={`flex items-center gap-1 text-xs font-medium ${s.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    <span className={`size-1.5 rounded-full ${s.ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <IconDatabase className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Platform Info</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Version', value: 'v1.0.0' },
                { label: 'Environment', value: 'Production' },
                { label: 'DB Schema', value: 'master' },
                { label: 'Last Deploy', value: 'Feb 21, 2026' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{row.label}</span>
                  <span className="text-xs font-medium font-mono">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${panel} p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <IconSettings className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Quick Actions</h3>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs h-8">
                <IconDatabase className="size-3.5" /> Run DB Health Check
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs h-8">
                <IconShieldLock className="size-3.5" /> Audit Security Log
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
