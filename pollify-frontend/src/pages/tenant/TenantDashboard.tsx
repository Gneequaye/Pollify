import { Routes, Route } from 'react-router-dom';
import { TenantSidebar } from '@/components/tenant-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TenantOverview } from './TenantOverview';
import { Elections } from './Elections';
import { CreateElection } from './CreateElection';
import { ElectionDetail } from './ElectionDetail';
import { Voters } from './Voters';
import { RegisterVoter } from './RegisterVoter';
import { Results } from './Results';
import { TenantSettings } from './TenantSettings';
import { TenantProfile } from './TenantProfile';
import { TenantNotifications } from './TenantNotifications';

export function TenantDashboard() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <TenantSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <Routes>
            <Route index element={<TenantOverview />} />
            <Route path="elections" element={<Elections />} />
            <Route path="elections/create" element={<CreateElection />} />
            <Route path="elections/:electionId" element={<ElectionDetail />} />
            <Route path="voters" element={<Voters />} />
            <Route path="voters/register" element={<RegisterVoter />} />
            <Route path="results" element={<Results />} />
            <Route path="settings" element={<TenantSettings />} />
            <Route path="profile" element={<TenantProfile />} />
            <Route path="notifications" element={<TenantNotifications />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
