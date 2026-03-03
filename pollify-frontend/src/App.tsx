import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { LoginPage, RegisterPage, ResetPasswordPage } from '@/pages/auth'
import { RegisterByInvitationPage } from '@/pages/auth/RegisterByInvitationPage'
import { AdminDashboard } from '@/pages/admin'
import { TenantDashboard } from '@/pages/tenant'
import { VoterDashboard } from '@/pages/voter'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Invitation registration — school clicks link from email */}
        <Route path="/register/:token" element={<RegisterByInvitationPage />} />

        {/* Dashboard Routes — protected by AuthGuard */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard/admin/*" element={
          <AuthGuard requiredRole="SUPER_ADMIN"><AdminDashboard /></AuthGuard>
        } />
        <Route path="/dashboard/tenant/*" element={
          <AuthGuard requiredRole="TENANT_ADMIN"><TenantDashboard /></AuthGuard>
        } />
        <Route path="/dashboard/voter/*" element={
          <AuthGuard requiredRole="VOTER"><VoterDashboard /></AuthGuard>
        } />
      </Routes>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
