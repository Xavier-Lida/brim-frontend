"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckCircleIcon,
  FileTextIcon,
  FlagIcon,
  GearIcon,
  ReceiptIcon,
  ShieldIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { CompanySpendCard } from "@/components/layout/company-spend-card";
import { UserNav } from "@/components/layout/user-nav";
import { useMockStore } from "@/lib/hooks/use-mock-store";

const navItems = [
  { title: "Brim Assistant", href: "/assistant", icon: SparkleIcon },
  { title: "Approvals", href: "/approvals", icon: CheckCircleIcon, badge: "approvals" as const },
  { title: "Flagged", href: "/flagged", icon: FlagIcon, badge: "flags" as const },
  { title: "Transactions", href: "/transactions", icon: ReceiptIcon },
  { title: "Reports", href: "/reports", icon: FileTextIcon },
  { title: "Policy", href: "/policy", icon: ShieldIcon },
  { title: "Settings", href: "/settings", icon: GearIcon },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { pendingApprovalsCount, unreadFlagsCount } = useMockStore();

  const getBadgeCount = (type?: "approvals" | "flags") => {
    if (type === "approvals") return pendingApprovalsCount;
    if (type === "flags") return unreadFlagsCount;
    return 0;
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border/60 p-5">
        <Link href="/assistant" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/15 text-primary">
            <SparkleIcon weight="fill" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">
              Northwind Labs
            </span>
            <span className="text-xs text-muted-foreground">Brim workspace</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const count = getBadgeCount(item.badge);
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/assistant" && pathname.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {count > 0 && item.badge && (
                      <SidebarMenuBadge>{count}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-3 p-5">
        <CompanySpendCard />
        <SidebarSeparator />
        <UserNav />
      </SidebarFooter>
    </Sidebar>
  );
}
