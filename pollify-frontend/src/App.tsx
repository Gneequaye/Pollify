import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import DashboardPage from '@/pages/DashboardPage'
import { LoginPage, RegisterPage, ResetPasswordPage } from '@/pages/auth'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <Routes>
        {/* Auth Routes - Using /login, /register, /reset instead of /auth/* to avoid API conflicts */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Dashboard Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
