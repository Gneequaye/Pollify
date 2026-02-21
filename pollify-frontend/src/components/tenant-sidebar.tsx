import * as React from "react"
import {
  IconDashboard,
  IconCheckbox,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconHelp,
  IconSearch,
  IconInnerShadowTop,
  IconUserPlus,
  IconTrophy,
  IconBell,
  IconUser,
} from "@tabler/icons-react"
import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { getCurrentUser } from '@/lib/auth'

export function TenantSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = getCurrentUser()

  const user = {
    name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Tenant Admin',
    email: currentUser?.email ?? 'admin@university.edu',
    avatar: '',
  }

  const navGroups = [
    {
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard/tenant",
          icon: IconDashboard,
        },
      ],
    },
    {
      label: "Elections",
      items: [
        {
          title: "All Elections",
          url: "/dashboard/tenant/elections",
          icon: IconCheckbox,
        },
        {
          title: "Create Election",
          url: "/dashboard/tenant/elections/create",
          icon: IconTrophy,
        },
      ],
    },
    {
      label: "Voters",
      items: [
        {
          title: "All Voters",
          url: "/dashboard/tenant/voters",
          icon: IconUsers,
        },
        {
          title: "Register Voter",
          url: "/dashboard/tenant/voters/register",
          icon: IconUserPlus,
        },
      ],
    },
    {
      label: "Analytics",
      items: [
        {
          title: "Results & Reports",
          url: "/dashboard/tenant/results",
          icon: IconChartBar,
        },
      ],
    },
  ]

  const navSecondary = [
    { title: "Settings", url: "/dashboard/tenant/settings", icon: IconSettings },
    { title: "Get Help", url: "#", icon: IconHelp },
    { title: "Search", url: "#", icon: IconSearch },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard/tenant">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Pollify</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={navGroups} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} basePath="/dashboard/tenant" />
      </SidebarFooter>
    </Sidebar>
  )
}
