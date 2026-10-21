import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import ScrollToTop from "./components/ScrollToTop";
import BarberPage from "@/pages/BarberPage";
import Login from "@/pages/Login";
import UserDashboard from "@/pages/UserDashboard";
import SuperAdminDashboard from "@/pages/admin/SuperAdminDashboard";
import DashboardHome from "@/pages/admin/DashboardHome";
import BusinessManagement from "@/pages/admin/BusinessManagement";
import UsersManagement from "@/pages/admin/UsersManagement";
import Reports from "@/pages/admin/Reports";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#080808]">
        <div className="w-8 h-8 border border-champagne/30 border-t-champagne rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === "user_not_registered") {
      return <UserNotRegisteredError />;
    } else if (authError.type === "auth_required") {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<BarberPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      
      {/* Admin Routes */}
      <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="businesses" element={<BusinessManagement />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;