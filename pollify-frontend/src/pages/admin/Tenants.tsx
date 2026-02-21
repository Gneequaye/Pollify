import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  IconTrendingUp,
  IconBuilding,
  IconCircleCheckFilled,
  IconClock,
  IconBan,
  IconCalendar,
  IconEye,
  IconSearch,
  IconSchool,
} from "@tabler/icons-react";

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

// Simulated data — replace with API call when backend is wired up
const MOCK_TENANTS = [
  {
    tenantId: 'TEN001',
    universityName: 'University of Ghana',
    universityEmail: 'admin@ug.edu.gh',
    schoolType: 'DOMAIN_SCHOOL',
    tenantStatus: 'ACTIVE',
    adminEmail: 'jkwame@ug.edu.gh',
    adminFirstName: 'Kwame',
    adminLastName: 'Mensah',
    onboardingCompleted: true,
    createdAt: '2024-01-15T10:30:00Z',
    onboardedAt: '2024-01-20T14:00:00Z',
  },
  {
    tenantId: 'TEN002',
    universityName: 'Kwame Nkrumah University of Science and Technology',
    universityEmail: 'admin@knust.edu.gh',
    schoolType: 'CODE_SCHOOL',
    tenantStatus: 'ACTIVE',
    adminEmail: 'aboateng@knust.edu.gh',
    adminFirstName: 'Ama',
    adminLastName: 'Boateng',
    onboardingCompleted: true,
    createdAt: '2024-02-01T09:00:00Z',
    onboardedAt: '2024-02-05T11:30:00Z',
  },
  {
    tenantId: 'TEN003',
    universityName: 'University of Cape Coast',
    universityEmail: 'admin@ucc.edu.gh',
    schoolType: 'DOMAIN_SCHOOL',
    tenantStatus: 'PENDING',
    adminEmail: 'eaddo@ucc.edu.gh',
    adminFirstName: 'Efua',
    adminLastName: 'Addo',
    onboardingCompleted: false,
    createdAt: '2024-03-10T08:00:00Z',
    onboardedAt: null,
  },
  {
    tenantId: 'TEN004',
    universityName: 'Ashesi University',
    universityEmail: 'admin@ashesi.edu.gh',
    schoolType: 'CODE_SCHOOL',
    tenantStatus: 'SUSPENDED',
    adminEmail: 'kofori@ashesi.edu.gh',
    adminFirstName: 'Kofi',
    adminLastName: 'Ofori',
    onboardingCompleted: true,
    createdAt: '2023-11-01T12:00:00Z',
    onboardedAt: '2023-11-10T16:00:00Z',
  },
];

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'ACTIVE':
      return (
        <Badge className="bg-green-50 text-green-700 border border-green-300 dark:bg-green-950/20 dark:text-green-400 gap-1">
          <IconCircleCheckFilled className="size-3" /> Active
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-300 dark:bg-yellow-950/20 dark:text-yellow-400 gap-1">
          <IconClock className="size-3" /> Pending
        </Badge>
      );
    case 'SUSPENDED':
      return (
        <Badge className="bg-red-50 text-red-700 border border-red-300 dark:bg-red-950/20 dark:text-red-400 gap-1">
          <IconBan className="size-3" /> Suspended
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function Tenants() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = MOCK_TENANTS.filter(
    (t) =>
      t.universityName.toLowerCase().includes(search.toLowerCase()) ||
      t.adminEmail.toLowerCase().includes(search.toLowerCase()) ||
      t.tenantId.toLowerCase().includes(search.toLowerCase())
  );

  const totalActive = MOCK_TENANTS.filter((t) => t.tenantStatus === 'ACTIVE').length;
  const totalPending = MOCK_TENANTS.filter((t) => t.tenantStatus === 'PENDING').length;
  const totalDomain = MOCK_TENANTS.filter((t) => t.schoolType === 'DOMAIN_SCHOOL').length;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[
          { label: "Total Schools", value: MOCK_TENANTS.length, badge: "All time", badgeIcon: <IconTrendingUp className="size-3" />, footer: "Registered universities", sub: "All onboarded institutions", icon: <IconTrendingUp className="size-3.5" /> },
          { label: "Active", value: totalActive, badge: "Live", badgeIcon: <IconCircleCheckFilled className="size-3" />, footer: "Currently active", sub: "Schools with active accounts", icon: <IconCircleCheckFilled className="size-3.5" /> },
          { label: "Pending", value: totalPending, badge: "Awaiting", badgeIcon: <IconClock className="size-3" />, footer: "Awaiting onboarding", sub: "Invitation accepted, setup pending", icon: <IconClock className="size-3.5" /> },
          { label: "Domain Schools", value: totalDomain, badge: "Type", badgeIcon: <IconSchool className="size-3" />, footer: "Email-domain verified", sub: "Using institutional email domains", icon: <IconSchool className="size-3.5" /> },
        ].map((c) => (
          <div key={c.label} className={`${panel} p-5 flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <Badge variant="outline" className="gap-1 text-xs">{c.badgeIcon} {c.badge}</Badge>
            </div>
            <p className="text-3xl font-semibold tabular-nums">{c.value}</p>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium flex items-center gap-1">{c.footer} {c.icon}</p>
              <p className="text-xs text-muted-foreground">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tenants Table */}
      <div className={`${panel} flex flex-col gap-0 overflow-hidden`}>
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-semibold">All Schools</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Schools that have accepted invitations and completed onboarding
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search schools..."
              className="pl-8 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table or empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3 px-6">
            <IconBuilding className="size-10 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">No schools found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {search ? `No results for "${search}"` : 'Schools will appear here after onboarding'}
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <TableHead className="pl-6 w-[110px] font-semibold text-xs uppercase tracking-wide">ID</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">School Name</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Admin</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Type</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Status</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Onboarded</TableHead>
                <TableHead className="pr-6 text-right font-semibold text-xs uppercase tracking-wide">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tenant) => (
                <TableRow
                  key={tenant.tenantId}
                  className="cursor-pointer group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
                  onClick={() => navigate(`/dashboard/admin/tenants/${tenant.tenantId}`)}
                >
                  <TableCell className="pl-6">
                    <span className="font-mono text-xs text-muted-foreground bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                      {tenant.tenantId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium leading-none">{tenant.universityName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{tenant.universityEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{tenant.adminFirstName} {tenant.adminLastName}</p>
                      <p className="text-xs text-muted-foreground">{tenant.adminEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {tenant.schoolType === 'DOMAIN_SCHOOL' ? 'Domain' : 'Code School'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={tenant.tenantStatus} />
                  </TableCell>
                  <TableCell>
                    {tenant.onboardedAt ? (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <IconCalendar className="size-3" />
                        {new Date(tenant.onboardedAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Not yet</span>
                    )}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 opacity-70 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/admin/tenants/${tenant.tenantId}`);
                      }}
                    >
                      <IconEye className="size-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Footer count */}
        <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {MOCK_TENANTS.length} schools
          </p>
        </div>
      </div>
    </div>
  );
}
