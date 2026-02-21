import { Routes, Route } from 'react-router-dom';
import { Overview } from './Overview';
import { Tenants } from './Tenants';
import { TenantDetail } from './TenantDetail';
import { SendInvitation } from './SendInvitation';
import { InvitationSuccess } from './InvitationSuccess';
import { Invitations } from './Invitations';
import { SystemUsers } from './SystemUsers';
import { UserDetail } from './UserDetail';
import { CreateUser } from './CreateUser';
import { Settings } from './Settings';
import { Profile } from './Profile';
import { Notifications } from './Notifications';
import { AdminSidebar } from '@/components/admin-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

/**
 * Super Admin Dashboard
 * - View all tenants (active, pending, invited)
 * - Create invitations
 * - View all invitations (table format)
 * - View individual tenant details
 * - Check migration health
 * - Create system users
 * - View system users
 * - Metrics: Total tenants, Active tenants, Total invited, Pending tenants
 */
export function AdminDashboard() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <Routes>
                <Route index element={<Overview />} />
                <Route path="tenants" element={<Tenants />} />
                <Route path="tenants/:tenantId" element={<TenantDetail />} />
                <Route path="invitations" element={<Invitations />} />
                <Route path="invitations/send" element={<SendInvitation />} />
                <Route path="invitations/success" element={<InvitationSuccess />} />
                <Route path="users" element={<SystemUsers />} />
                <Route path="users/create" element={<CreateUser />} />
                <Route path="users/:userId" element={<UserDetail />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="notifications" element={<Notifications />} />
              </Routes>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
