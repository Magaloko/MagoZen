import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProjectProvider } from './context/ProjectContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/shared/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import GeneralPage from './pages/GeneralPage'
import NewProjectWizard from './pages/NewProjectWizard'
import Dashboard from './pages/Dashboard'
import PhasesPage from './pages/PhasesPage'
import ChecklistPage from './pages/ChecklistPage'
import MacrosPage from './pages/MacrosPage'
import DNSPage from './pages/DNSPage'
import RisksPage from './pages/RisksPage'
import CustomerPage from './pages/CustomerPage'
import FAQPage from './pages/FAQPage'
import InternPage from './pages/InternPage'
import FragenPage from './pages/FragenPage'
import DemoPage from './pages/DemoPage'
import AngebotPage from './pages/AngebotPage'
import WissenPage from './pages/WissenPage'
import AutomatisierungPage from './pages/AutomatisierungPage'
import ProjectSettingsPage from './pages/ProjectSettingsPage'
import UserManagementPage from './pages/UserManagementPage'
import RechnerPage from './pages/RechnerPage'

// Shown to authenticated customers who have no project assigned yet
function WaitingPage() {
  const { profile, signOut } = useAuth()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 20 }}>
      <div style={{ maxWidth: 420, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--green)', marginBottom: 8 }}>DADAKAEV_LABS</div>
        <div style={{ fontSize: 32, margin: '20px 0', color: 'var(--muted)' }}>◷</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--white)', marginBottom: 12 }}>Zugang wird eingerichtet</div>
        <div style={{ fontSize: 14, color: 'var(--muted-l)', lineHeight: 1.6, marginBottom: 24 }}>
          Hallo <strong style={{ color: 'var(--white-d)' }}>{profile?.display_name || profile?.email}</strong>.<br/>
          Ihr Account wurde erstellt. Sobald ein Administrator Ihnen den Projektzugang freigeschaltet hat, werden Sie automatisch weitergeleitet.
        </div>
        <div style={{ padding: '12px 16px', background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
          {profile?.email}
        </div>
        <button onClick={signOut} style={{ fontSize: 13, color: 'var(--muted-l)', background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>
          Abmelden
        </button>
      </div>
    </div>
  )
}

// Public root: landing page for guests, redirect for authenticated users
function PublicHome() {
  const { user, isAdmin, isCustomer, membership, loading } = useAuth()
  if (loading) return null
  if (!user) return <LandingPage />
  if (isCustomer) {
    return membership?.project_id
      ? <Navigate to={`/projects/${membership.project_id}`} replace />
      : <Navigate to="/waiting" replace />
  }
  if (isAdmin) return <Navigate to="/home" replace />
  return <LandingPage />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            {/* Public routes — no layout, no auth required */}
            <Route index element={<PublicHome />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/rechner" element={<RechnerPage />} />
            <Route path="/waiting" element={<WaitingPage />} />

            {/* Protected routes — auth required */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                {/* Admin-only global routes */}
                <Route element={<ProtectedRoute requireAdmin />}>
                  <Route path="home" element={<HomePage />} />
                  <Route path="general" element={<GeneralPage />} />
                  <Route path="projects/new" element={<NewProjectWizard />} />
                  <Route path="users" element={<UserManagementPage />} />
                </Route>

                {/* Project routes — both roles, visibility checked in ProtectedRoute */}
                <Route path="projects/:projectId" element={<Dashboard />} />
                <Route path="projects/:projectId/phasen" element={<PhasesPage />} />
                <Route path="projects/:projectId/checkliste" element={<ChecklistPage />} />
                <Route path="projects/:projectId/makros" element={<MacrosPage />} />
                <Route path="projects/:projectId/dns" element={<DNSPage />} />
                <Route path="projects/:projectId/risiken" element={<RisksPage />} />
                <Route path="projects/:projectId/kunde" element={<CustomerPage />} />
                <Route path="projects/:projectId/fragen" element={<FragenPage />} />
                <Route path="projects/:projectId/faq" element={<FAQPage />} />
                <Route path="projects/:projectId/demo" element={<DemoPage />} />

                {/* Admin-only project routes */}
                <Route element={<ProtectedRoute requireAdmin />}>
                  <Route path="projects/:projectId/intern" element={<InternPage />} />
                  <Route path="projects/:projectId/angebot" element={<AngebotPage />} />
                  <Route path="projects/:projectId/automatisierung" element={<AutomatisierungPage />} />
                  <Route path="projects/:projectId/wissen" element={<WissenPage />} />
                  <Route path="projects/:projectId/settings" element={<ProjectSettingsPage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
