import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
} from '@tabler/icons-react';

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
      return <Badge>{status}</Badge>;
  }
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3">
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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <IconBuilding className="size-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Tenant Not Found</h3>
              <p className="text-sm text-muted-foreground mt-1">No tenant with ID <span className="font-mono">{tenantId}</span> exists.</p>
            </div>
            <Button onClick={() => navigate('/dashboard/admin/tenants')}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Back button + header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/dashboard/admin/tenants')}>
          <IconArrowLeft className="size-4" />
          Back
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <div>
          <h2 className="text-lg font-semibold leading-none">{tenant.universityName}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Tenant ID: <span className="font-mono">{tenant.tenantId}</span></p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={tenant.tenantStatus} />
        </div>
      </div>

      {/* Stat cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-4">
        {[
          { label: 'Total Voters', value: tenant.stats.totalVoters },
          { label: 'Active Elections', value: tenant.stats.activeElections },
          { label: 'Total Elections', value: tenant.stats.totalElections },
          { label: 'Votes Cast', value: tenant.stats.totalVotes },
        ].map((stat) => (
          <Card key={stat.label} className="@container/card">
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stat.value.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Two-column detail grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Institution Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <IconBuilding className="size-4" /> Institution Details
            </CardTitle>
            <CardDescription>General information about this school</CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            <InfoRow icon={IconBuilding} label="University Name" value={tenant.universityName} />
            <InfoRow icon={IconMail} label="Official Email" value={tenant.universityEmail} />
            <InfoRow icon={IconSchool} label="School Type" value={
              <Badge variant="secondary">
                {tenant.schoolType === 'DOMAIN_SCHOOL' ? 'Domain School' : 'Code School'}
              </Badge>
            } />
            {tenant.schoolType === 'DOMAIN_SCHOOL' && (
              <InfoRow icon={IconWorldWww} label="Email Domain" value={
                <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{tenant.emailDomain}</span>
              } />
            )}
            {tenant.schoolType === 'CODE_SCHOOL' && (
              <InfoRow icon={IconHash} label="School Code" value={
                <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{tenant.schoolCode}</span>
              } />
            )}
            <InfoRow icon={IconDatabase} label="DB Schema" value={
              <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{tenant.databaseSchema}</span>
            } />
          </CardContent>
        </Card>

        {/* Admin & Timestamps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <IconUser className="size-4" /> Admin & Timeline
            </CardTitle>
            <CardDescription>Administrator account and key dates</CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            <InfoRow icon={IconUser} label="Admin Name" value={`${tenant.adminFirstName} ${tenant.adminLastName}`} />
            <InfoRow icon={IconMail} label="Admin Email" value={tenant.adminEmail} />
            <InfoRow icon={IconCircleCheckFilled} label="Onboarding" value={
              tenant.onboardingCompleted
                ? <Badge className="bg-green-50 text-green-700 border border-green-300 dark:bg-green-950/20 dark:text-green-400">Completed</Badge>
                : <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-300 dark:bg-yellow-950/20 dark:text-yellow-400">Pending</Badge>
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
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
          <CardDescription>Manage this tenant's account status</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {tenant.tenantStatus === 'ACTIVE' && (
            <Button variant="destructive" size="sm">Suspend Tenant</Button>
          )}
          {tenant.tenantStatus === 'SUSPENDED' && (
            <Button variant="outline" size="sm">Reactivate Tenant</Button>
          )}
          {tenant.tenantStatus === 'PENDING' && (
            <Button variant="outline" size="sm">Resend Invitation</Button>
          )}
          <Button variant="outline" size="sm">View Elections</Button>
          <Button variant="outline" size="sm">View Voters</Button>
        </CardContent>
      </Card>
    </div>
  );
}
