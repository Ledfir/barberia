import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#080808] to-[#0f0f0f] text-foreground">
        <div className="flex gap-0 lg:gap-0">
          {/* Sidebar */}
          <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Header */}
            <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}
