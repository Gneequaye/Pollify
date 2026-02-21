import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { LoginPage, RegisterPage, ResetPasswordPage } from '@/pages/auth'
import { AdminDashboard } from '@/pages/admin'
import { TenantDashboard } from '@/pages/tenant'
import { VoterDashboard } from '@/pages/voter'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <Routes>
        {/* Auth Routes - Using /login, /register, /reset instead of /auth/* to avoid API conflicts */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Dashboard Routes - Three separate dashboards based on role */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
        <Route path="/dashboard/tenant/*" element={<TenantDashboard />} />
        <Route path="/dashboard/voter/*" element={<VoterDashboard />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
