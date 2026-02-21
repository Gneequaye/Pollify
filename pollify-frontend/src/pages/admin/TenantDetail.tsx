import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  IconArrowLeft,
  IconBuilding,
  IconMail,
  IconUser,
  IconCalendar,
  IconCircleCheckFilled,
  IconClock,
  IconBan,
  IconDatabase,
  IconSchool,
  IconHash,
  IconWorldWww,
  IconUsers,
  IconChartBar,
  IconCheckbox,
  IconThumbUp,
} from '@tabler/icons-react';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

// Simulated tenant data — replace with API call when backend is ready
const MOCK_TENANTS: Record<string, any> = {
  'TEN001': {
    tenantId: 'TEN001',
    tenantUuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    universityName: 'University of Ghana',
    universityEmail: 'admin@ug.edu.gh',
    databaseSchema: 'tenant_ug',
    schoolType: 'DOMAIN_SCHOOL',
    emailDomain: 'st.ug.edu.gh',
    tenantStatus: 'ACTIVE',
    adminEmail: 'jkwame@ug.edu.gh',
    adminFirstName: 'Kwame',
    adminLastName: 'Mensah',
    onboardingCompleted: true,
    createdAt: '2024-01-15T10:30:00Z',
    onboardedAt: '2024-01-20T14:00:00Z',
    stats: { totalVoters: 1240, activeElections: 2, totalElections: 5, totalVotes: 3820 },
  },
  'TEN002': {
    tenantId: 'TEN002',
    tenantUuid: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    universityName: 'Kwame Nkrumah University of Science and Technology',
    universityEmail: 'admin@knust.edu.gh',
    databaseSchema: 'tenant_knust',
    schoolType: 'CODE_SCHOOL',
    schoolCode: 'KNUST2024',
    tenantStatus: 'ACTIVE',
    adminEmail: 'aboateng@knust.edu.gh',
    adminFirstName: 'Ama',
    adminLastName: 'Boateng',
    onboardingCompleted: true,
    createdAt: '2024-02-01T09:00:00Z',
    onboardedAt: '2024-02-05T11:30:00Z',
    stats: { totalVoters: 980, activeElections: 1, totalElections: 3, totalVotes: 2100 },
  },
  'TEN003': {
    tenantId: 'TEN003',
    tenantUuid: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    universityName: 'University of Cape Coast',
    universityEmail: 'admin@ucc.edu.gh',
    databaseSchema: 'tenant_ucc',
    schoolType: 'DOMAIN_SCHOOL',
    emailDomain: 'stu.ucc.edu.gh',
    tenantStatus: 'PENDING',
    adminEmail: 'eaddo@ucc.edu.gh',
    adminFirstName: 'Efua',
    adminLastName: 'Addo',
    onboardingCompleted: false,
    createdAt: '2024-03-10T08:00:00Z',
    onboardedAt: null,
    stats: { totalVoters: 0, activeElections: 0, totalElections: 0, totalVotes: 0 },
  },
  'TEN004': {
    tenantId: 'TEN004',
    tenantUuid: 'd4e5f6a7-b8c9-0123-defa-234567890123',
    universityName: 'Ashesi University',
    universityEmail: 'admin@ashesi.edu.gh',
    databaseSchema: 'tenant_ashesi',
    schoolType: 'CODE_SCHOOL',
    schoolCode: 'ASH2024',
    tenantStatus: 'SUSPENDED',
    adminEmail: 'kofori@ashesi.edu.gh',
    adminFirstName: 'Kofi',
    adminLastName: 'Ofori',
    onboardingCompleted: true,
    createdAt: '2023-11-01T12:00:00Z',
    onboardedAt: '2023-11-10T16:00:00Z',
    stats: { totalVoters: 320, activeElections: 0, totalElections: 2, totalVotes: 640 },
  },
};

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'ACTIVE':
      return (
        <Badge className="bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/20 dark:text-green-400 gap-1">
          <IconCircleCheckFilled className="size-3" /> Active
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 gap-1">
          <IconClock className="size-3" /> Pending
        </Badge>
      );
    case 'SUSPENDED':
      return (
        <Badge className="bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/20 dark:text-red-400 gap-1">
          <IconBan className="size-3" /> Suspended
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <div className="flex items-center gap-2 w-44 shrink-0 text-muted-foreground text-sm">
        <Icon className="size-4" />
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium">{value ?? <span className="text-muted-foreground italic">—</span>}</div>
    </div>
  );
}

export function TenantDetail() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();

  const tenant = MOCK_TENANTS[tenantId ?? ''];

  if (!tenant) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <Button variant="ghost" size="sm" className="w-fit gap-2" onClick={() => navigate('/dashboard/admin/tenants')}>
          <IconArrowLeft className="size-4" />
          Back to Tenants
        </Button>
        <div className={`${panel} p-12 flex flex-col items-center justify-center text-center gap-4`}>
          <div className="size-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <IconBuilding className="size-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Tenant Not Found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              No tenant with ID <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">{tenantId}</span> exists.
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard/admin/tenants')}>Go Back</Button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Voters', value: tenant.stats.totalVoters, icon: IconUsers, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { label: 'Active Elections', value: tenant.stats.activeElections, icon: IconChartBar, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30' },
    { label: 'Total Elections', value: tenant.stats.totalElections, icon: IconCheckbox, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/30' },
    { label: 'Votes Cast', value: tenant.stats.totalVotes, icon: IconThumbUp, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30' },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Back button + header */}
      <div className={`${panel} p-4 flex items-center gap-3`}>
        <Button variant="ghost" size="sm" className="gap-2 shrink-0" onClick={() => navigate('/dashboard/admin/tenants')}>
          <IconArrowLeft className="size-4" />
          Back
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold leading-none truncate">{tenant.universityName}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Tenant ID: <span className="font-mono">{tenant.tenantId}</span>
          </p>
        </div>
        <StatusBadge status={tenant.tenantStatus} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 @xl/main:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`${panel} p-5 flex items-center gap-4`}>
            <div className={`size-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
              <stat.icon className={`size-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold tabular-nums">{stat.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column detail grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Institution Info */}
        <div className={`${panel} p-6`}>
          <div className="mb-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <IconBuilding className="size-4 text-muted-foreground" /> Institution Details
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">General information about this school</p>
          </div>
          <div>
            <InfoRow icon={IconBuilding} label="University Name" value={tenant.universityName} />
            <InfoRow icon={IconMail} label="Official Email" value={tenant.universityEmail} />
            <InfoRow icon={IconSchool} label="School Type" value={
              <Badge variant="secondary">
                {tenant.schoolType === 'DOMAIN_SCHOOL' ? 'Domain School' : 'Code School'}
              </Badge>
            } />
            {tenant.schoolType === 'DOMAIN_SCHOOL' && (
              <InfoRow icon={IconWorldWww} label="Email Domain" value={
                <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{tenant.emailDomain}</span>
              } />
            )}
            {tenant.schoolType === 'CODE_SCHOOL' && (
              <InfoRow icon={IconHash} label="School Code" value={
                <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{tenant.schoolCode}</span>
              } />
            )}
            <InfoRow icon={IconDatabase} label="DB Schema" value={
              <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{tenant.databaseSchema}</span>
            } />
          </div>
        </div>

        {/* Admin & Timestamps */}
        <div className={`${panel} p-6`}>
          <div className="mb-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <IconUser className="size-4 text-muted-foreground" /> Admin & Timeline
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">Administrator account and key dates</p>
          </div>
          <div>
            <InfoRow icon={IconUser} label="Admin Name" value={`${tenant.adminFirstName} ${tenant.adminLastName}`} />
            <InfoRow icon={IconMail} label="Admin Email" value={tenant.adminEmail} />
            <InfoRow icon={IconCircleCheckFilled} label="Onboarding" value={
              tenant.onboardingCompleted
                ? <Badge className="bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/20 dark:text-green-400">Completed</Badge>
                : <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400">Pending</Badge>
            } />
            <InfoRow icon={IconCalendar} label="Invited On" value={
              new Date(tenant.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            } />
            <InfoRow icon={IconCalendar} label="Onboarded On" value={
              tenant.onboardedAt
                ? new Date(tenant.onboardedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                : null
            } />
            <InfoRow icon={IconHash} label="Tenant UUID" value={
              <span className="font-mono text-xs text-muted-foreground break-all">{tenant.tenantUuid}</span>
            } />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={`${panel} p-6`}>
        <div className="mb-5">
          <h3 className="text-base font-semibold">Actions</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Manage this tenant's account status</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {tenant.tenantStatus === 'ACTIVE' && (
            <Button variant="destructive" size="sm">Suspend Tenant</Button>
          )}
          {tenant.tenantStatus === 'SUSPENDED' && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Reactivate Tenant</Button>
          )}
          {tenant.tenantStatus === 'PENDING' && (
            <Button variant="outline" size="sm">Resend Invitation</Button>
          )}
          <Button variant="outline" size="sm">View Elections</Button>
          <Button variant="outline" size="sm">View Voters</Button>
        </div>
      </div>

    </div>
  );
}
