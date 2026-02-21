import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  IconUsers,
  IconUserPlus,
  IconSearch,
  IconEye,
  IconShieldCheck,
  IconUserCheck,
  IconCircleCheckFilled,
  IconBan,
  IconTrendingUp,
} from '@tabler/icons-react';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

type SystemUser = {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN';
  status: 'Active' | 'Inactive';
  tenantName: string | null;
  createdAt: string;
  lastLogin: string;
};

const MOCK_USERS: SystemUser[] = [
  { id: 'USR-001', name: 'Kwame Asante', email: 'kwame.asante@pollify.com', role: 'SUPER_ADMIN', status: 'Active', tenantName: null, createdAt: '2024-01-10', lastLogin: '2026-02-20' },
  { id: 'USR-002', name: 'Abena Mensah', email: 'abena.mensah@pollify.com', role: 'SUPER_ADMIN', status: 'Active', tenantName: null, createdAt: '2024-02-14', lastLogin: '2026-02-18' },
  { id: 'USR-003', name: 'Dr. Kofi Boateng', email: 'kofi.boateng@ug.edu.gh', role: 'TENANT_ADMIN', status: 'Active', tenantName: 'University of Ghana', createdAt: '2024-03-01', lastLogin: '2026-02-19' },
  { id: 'USR-004', name: 'Ama Osei', email: 'ama.osei@knust.edu.gh', role: 'TENANT_ADMIN', status: 'Active', tenantName: 'KNUST', createdAt: '2024-04-15', lastLogin: '2026-02-17' },
  { id: 'USR-005', name: 'Yaw Darko', email: 'yaw.darko@ucc.edu.gh', role: 'TENANT_ADMIN', status: 'Inactive', tenantName: 'University of Cape Coast', createdAt: '2024-05-20', lastLogin: '2026-01-30' },
  { id: 'USR-006', name: 'Efua Adjei', email: 'efua.adjei@pollify.com', role: 'SUPER_ADMIN', status: 'Active', tenantName: null, createdAt: '2025-01-05', lastLogin: '2026-02-21' },
];

export function SystemUsers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = MOCK_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = MOCK_USERS.length;
  const superAdmins = MOCK_USERS.filter(u => u.role === 'SUPER_ADMIN').length;
  const tenantAdmins = MOCK_USERS.filter(u => u.role === 'TENANT_ADMIN').length;
  const activeUsers = MOCK_USERS.filter(u => u.status === 'Active').length;

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: totalUsers, icon: IconUsers, trend: '+2 this month', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
          { label: 'Super Admins', value: superAdmins, icon: IconShieldCheck, trend: 'Platform admins', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
          { label: 'Tenant Admins', value: tenantAdmins, icon: IconUserCheck, trend: 'School admins', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
          { label: 'Active Users', value: activeUsers, icon: IconCircleCheckFilled, trend: `${totalUsers - activeUsers} inactive`, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
        ].map(stat => (
          <div key={stat.label} className={`${panel} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`size-4 ${stat.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
            <div className="flex items-center gap-1 mt-1.5">
              <IconTrendingUp className="size-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className={`${panel} overflow-hidden`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-semibold">All System Users</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} user{filtered.length !== 1 ? 's' : ''} found</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-9 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-sm"
              />
            </div>
            <Button
              size="sm"
              className="gap-1.5 h-9 shrink-0"
              onClick={() => navigate('/dashboard/admin/users/create')}
            >
              <IconUserPlus className="size-4" />
              <span className="hidden sm:inline">Create User</span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-100 dark:border-zinc-800 hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold pl-5">User</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">ID</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Role</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Tenant</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Last Login</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold pr-5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                    <IconUsers className="size-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No users match your search</p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(user => (
                  <TableRow
                    key={user.id}
                    className="border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                    onClick={() => navigate(`/dashboard/admin/users/${user.id}`)}
                  >
                    {/* User */}
                    <TableCell className="pl-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    {/* ID */}
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs bg-zinc-50 dark:bg-zinc-800">
                        {user.id}
                      </Badge>
                    </TableCell>
                    {/* Role */}
                    <TableCell>
                      {user.role === 'SUPER_ADMIN' ? (
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-0 gap-1 text-xs">
                          <IconShieldCheck className="size-3" /> Super Admin
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-0 gap-1 text-xs">
                          <IconUserCheck className="size-3" /> Tenant Admin
                        </Badge>
                      )}
                    </TableCell>
                    {/* Tenant */}
                    <TableCell className="text-sm text-muted-foreground">
                      {user.tenantName ?? <span className="italic opacity-50">Platform</span>}
                    </TableCell>
                    {/* Status */}
                    <TableCell>
                      {user.status === 'Active' ? (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-0 gap-1 text-xs">
                          <IconCircleCheckFilled className="size-3" /> Active
                        </Badge>
                      ) : (
                        <Badge className="bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-0 gap-1 text-xs">
                          <IconBan className="size-3" /> Inactive
                        </Badge>
                      )}
                    </TableCell>
                    {/* Last Login */}
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLogin}
                    </TableCell>
                    {/* Actions */}
                    <TableCell className="pr-5" onClick={e => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => navigate(`/dashboard/admin/users/${user.id}`)}
                      >
                        <IconEye className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Showing {filtered.length} of {totalUsers} users</p>
          <p className="text-xs text-muted-foreground">Last updated: Feb 21, 2026</p>
        </div>
      </div>
    </div>
  );
}
