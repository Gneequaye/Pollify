import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  IconArrowLeft,
  IconShieldCheck,
  IconUserCheck,
  IconCircleCheckFilled,
  IconBan,
  IconMail,
  IconCalendar,
  IconClock,
  IconEdit,
  IconKey,
} from '@tabler/icons-react';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

type SystemUser = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN';
  status: 'Active' | 'Inactive';
  tenantName: string | null;
  tenantId: string | null;
  createdAt: string;
  lastLogin: string;
  emailVerified: boolean;
};

const MOCK_USERS: SystemUser[] = [
  { id: 'USR-001', name: 'Kwame Asante', firstName: 'Kwame', lastName: 'Asante', email: 'kwame.asante@pollify.com', role: 'SUPER_ADMIN', status: 'Active', tenantName: null, tenantId: null, createdAt: '2024-01-10', lastLogin: '2026-02-20', emailVerified: true },
  { id: 'USR-002', name: 'Abena Mensah', firstName: 'Abena', lastName: 'Mensah', email: 'abena.mensah@pollify.com', role: 'SUPER_ADMIN', status: 'Active', tenantName: null, tenantId: null, createdAt: '2024-02-14', lastLogin: '2026-02-18', emailVerified: true },
  { id: 'USR-003', name: 'Dr. Kofi Boateng', firstName: 'Kofi', lastName: 'Boateng', email: 'kofi.boateng@ug.edu.gh', role: 'TENANT_ADMIN', status: 'Active', tenantName: 'University of Ghana', tenantId: 'TEN-UG-001', createdAt: '2024-03-01', lastLogin: '2026-02-19', emailVerified: true },
  { id: 'USR-004', name: 'Ama Osei', firstName: 'Ama', lastName: 'Osei', email: 'ama.osei@knust.edu.gh', role: 'TENANT_ADMIN', status: 'Active', tenantName: 'KNUST', tenantId: 'TEN-KN-002', createdAt: '2024-04-15', lastLogin: '2026-02-17', emailVerified: true },
  { id: 'USR-005', name: 'Yaw Darko', firstName: 'Yaw', lastName: 'Darko', email: 'yaw.darko@ucc.edu.gh', role: 'TENANT_ADMIN', status: 'Inactive', tenantName: 'University of Cape Coast', tenantId: 'TEN-UC-003', createdAt: '2024-05-20', lastLogin: '2026-01-30', emailVerified: false },
  { id: 'USR-006', name: 'Efua Adjei', firstName: 'Efua', lastName: 'Adjei', email: 'efua.adjei@pollify.com', role: 'SUPER_ADMIN', status: 'Active', tenantName: null, tenantId: null, createdAt: '2025-01-05', lastLogin: '2026-02-21', emailVerified: true },
];

export function UserDetail() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const user = MOCK_USERS.find(u => u.id === userId);

  if (!user) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <div className={`${panel} p-12 flex flex-col items-center justify-center text-center gap-4`}>
          <IconShieldCheck className="size-12 text-muted-foreground opacity-30" />
          <div>
            <h2 className="text-lg font-semibold">User Not Found</h2>
            <p className="text-sm text-muted-foreground mt-1">No user exists with ID <span className="font-mono">{userId}</span></p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard/admin/users')}>
            <IconArrowLeft className="size-4 mr-2" /> Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Back */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1"
          onClick={() => navigate('/dashboard/admin/users')}
        >
          <IconArrowLeft className="size-4" />
          Back to Users
        </Button>
      </div>

      {/* Profile Hero */}
      <div className={`${panel} p-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="size-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-bold">{user.name}</h1>
              {user.role === 'SUPER_ADMIN' ? (
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-0 gap-1 text-xs">
                  <IconShieldCheck className="size-3" /> Super Admin
                </Badge>
              ) : (
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-0 gap-1 text-xs">
                  <IconUserCheck className="size-3" /> Tenant Admin
                </Badge>
              )}
              {user.status === 'Active' ? (
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-0 gap-1 text-xs">
                  <IconCircleCheckFilled className="size-3" /> Active
                </Badge>
              ) : (
                <Badge className="bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-0 gap-1 text-xs">
                  <IconBan className="size-3" /> Inactive
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <IconMail className="size-3.5" /> {user.email}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5 h-8">
              <IconKey className="size-3.5" /> Reset Password
            </Button>
            <Button size="sm" className="gap-1.5 h-8">
              <IconEdit className="size-3.5" /> Edit User
            </Button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Account Details */}
        <div className={`${panel} p-6`}>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Account Details</h2>
          <div className="space-y-4">
            {[
              { label: 'User ID', value: user.id, mono: true },
              { label: 'First Name', value: user.firstName },
              { label: 'Last Name', value: user.lastName },
              { label: 'Email Address', value: user.email },
              { label: 'Email Verified', value: user.emailVerified ? '✓ Verified' : '✗ Not Verified' },
              { label: 'Account Status', value: user.status },
            ].map((row, i, arr) => (
              <div key={row.label}>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted-foreground w-36 shrink-0">{row.label}</span>
                  <span className={`text-sm font-medium text-right ${row.mono ? 'font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded' : ''}`}>
                    {row.value}
                  </span>
                </div>
                {i < arr.length - 1 && <Separator className="mt-4 bg-zinc-100 dark:bg-zinc-800" />}
              </div>
            ))}
          </div>
        </div>

        {/* Role & Access */}
        <div className={`${panel} p-6`}>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Role & Access</h2>
          <div className="space-y-4">
            {[
              { label: 'Assigned Role', value: user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Tenant Admin' },
              { label: 'Scope', value: user.role === 'SUPER_ADMIN' ? 'Platform-wide' : 'Single Tenant' },
              { label: 'Tenant', value: user.tenantName ?? 'N/A — Platform' },
              { label: 'Tenant ID', value: user.tenantId ?? '—', mono: !!user.tenantId },
              { label: 'Created', value: user.createdAt },
              { label: 'Last Login', value: user.lastLogin },
            ].map((row, i, arr) => (
              <div key={row.label}>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted-foreground w-36 shrink-0">{row.label}</span>
                  <span className={`text-sm font-medium text-right ${row.mono ? 'font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded' : ''}`}>
                    {row.value}
                  </span>
                </div>
                {i < arr.length - 1 && <Separator className="mt-4 bg-zinc-100 dark:bg-zinc-800" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className={`${panel} p-6`}>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Activity Timeline</h2>
        <div className="flex flex-col gap-4">
          {[
            { icon: IconCircleCheckFilled, color: 'text-emerald-500', label: 'Last Login', date: user.lastLogin, desc: 'Successful login to the platform' },
            { icon: IconCalendar, color: 'text-blue-500', label: 'Account Created', date: user.createdAt, desc: 'User account was created by a super admin' },
            { icon: IconMail, color: 'text-blue-500', label: 'Email Verified', date: user.createdAt, desc: user.emailVerified ? 'Email address verified successfully' : 'Email not yet verified' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className={`mt-0.5 ${item.color}`}>
                <item.icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                    <IconClock className="size-3" /> {item.date}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="w-full bg-white dark:bg-zinc-900/70 border border-red-100 dark:border-red-900/40 rounded-xl shadow-sm backdrop-blur-xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-red-500 mb-1">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">These actions are irreversible. Proceed with caution.</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30 gap-1.5">
            <IconBan className="size-4" />
            {user.status === 'Active' ? 'Deactivate Account' : 'Reactivate Account'}
          </Button>
        </div>
      </div>

    </div>
  );
}
