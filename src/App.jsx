import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { SessionProvider } from "./context/SessionContext"

import { UserGuard }     from "./guards/UserGuard"
import { AnalystGuard }  from "./guards/AnalystGuard"
import { AdminGuard }    from "./guards/AdminGuard"

import LandingPage        from "./pages/LandingPage"
import LoginPage          from "./pages/LoginPage"
import RegisterPage       from "./pages/RegisterPage"
import BankingHome        from "./pages/BankingHome"
import TransferPage       from "./pages/TransferPage"
import TransactionHistory from "./pages/TransactionHistory"
import SecurityDashboard  from "./pages/SecurityDashboard"
import SessionMonitor     from "./pages/SessionMonitor"
import AlertsCenter       from "./pages/AlertsCenter"
import AdminPanel         from "./pages/AdminPanel"
import UserManagement     from "./pages/UserManagement"
import SystemConfig       from "./pages/SystemConfig"
import AuditLogs          from "./pages/AuditLogs"
import NotFound           from "./pages/NotFound"

function RootRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === "user")    return <Navigate to="/banking"   replace />
  if (user.role === "analyst") return <Navigate to="/dashboard" replace />
  if (user.role === "admin")   return <Navigate to="/admin"     replace />
  return <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"        element={<LandingPage />} />
      <Route path="/login"   element={<LoginPage />} />
      <Route path="/register"   element={<RegisterPage />} />
      <Route path="/"        element={<RootRedirect />} />

      <Route path="/banking"          element={<UserGuard><BankingHome /></UserGuard>} />
      <Route path="/banking/transfer" element={<UserGuard><TransferPage /></UserGuard>} />
      <Route path="/banking/history"  element={<UserGuard><TransactionHistory /></UserGuard>} />

      <Route path="/dashboard" element={<AnalystGuard><SecurityDashboard /></AnalystGuard>} />
      <Route path="/monitor"   element={<AnalystGuard><SessionMonitor /></AnalystGuard>} />
      <Route path="/alerts"    element={<AnalystGuard><AlertsCenter /></AnalystGuard>} />

     
      <Route path="/admin"        element={<AdminGuard><AdminPanel /></AdminGuard>} />
      <Route path="/admin/users"  element={<AdminGuard><UserManagement /></AdminGuard>} />
      <Route path="/admin/system" element={<AdminGuard><SystemConfig /></AdminGuard>} />
      <Route path="/admin/audit"  element={<AdminGuard><AuditLogs /></AdminGuard>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <div className="scan-bar" />
        <AppRoutes />
      </SessionProvider>
    </AuthProvider>
  )
}