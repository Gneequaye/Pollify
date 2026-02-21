import * as React from "react"
import {
  IconDashboard,
  IconBuilding,
  IconMail,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconInnerShadowTop,
  IconSend,
  IconUserPlus,
} from "@tabler/icons-react"

import { NavMain, type NavGroup } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/auth"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = getCurrentUser()

  const sidebarUser = {
    name: user ? `${user.firstName} ${user.lastName}` : "Super Admin",
    email: user?.email ?? "admin@pollify.com",
    avatar: "/avatars/shadcn.jpg",
  }

  const navGroups: NavGroup[] = [
    {
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard/admin",
          icon: IconDashboard,
          exactMatch: true,
        },
      ],
    },
    {
      label: "Tenants",
      items: [
        {
          title: "All Tenants",
          url: "/dashboard/admin/tenants",
          icon: IconBuilding,
        },
      ],
    },
    {
      label: "Invitations",
      items: [
        {
          title: "All Invitations",
          url: "/dashboard/admin/invitations",
          icon: IconMail,
        },
        {
          title: "Send Invitation",
          url: "/dashboard/admin/invitations/send",
          icon: IconSend,
        },
      ],
    },
    {
      label: "System",
      items: [
        {
          title: "System Users",
          url: "/dashboard/admin/users",
          icon: IconUsers,
        },
        {
          title: "Create User",
          url: "/dashboard/admin/users/create",
          icon: IconUserPlus,
        },
      ],
    },
  ]

  const navSecondary = [
    {
      title: "Settings",
      url: "/dashboard/admin/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
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
              <a href="/dashboard/admin">
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
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
