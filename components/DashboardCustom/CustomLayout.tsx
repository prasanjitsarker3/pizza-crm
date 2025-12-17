"use client";
import { adminRoutes } from "@/components/DashboardCustom/Admin/admin.routes";
import Header from "@/components/DashboardCustom/Admin/Header";
import Sidebar from "@/components/DashboardCustom/Admin/Sidebar";
import { useMediaQuery } from "@/hooks/useMobile";
import type React from "react";
import { useState } from "react";
import { userRoutes } from "./other/user.routes";

interface LayoutProps {
  children: React.ReactNode;
}

enum Role {
  Admin = "Admin",
  User = "User",
}

const CustomLayout = ({ children }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [role] = useState<Role>(Role.Admin);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  let routes;
  switch (role) {
    case Role.Admin:
      routes = adminRoutes();
      break;
    case Role.User:
      routes = userRoutes();
      break;
  }

  return (
    <div className="flex h-screen  bg-gray-50  dark:bg-[#1F1F1F] dark:text-white">
      <Sidebar
        routes={routes}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Fixed Header */}
        <Header
          onMenuClick={toggleMobileSidebar}
          showMenuButton={isMobile}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default CustomLayout;
