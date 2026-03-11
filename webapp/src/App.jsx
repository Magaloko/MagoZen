import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProjectProvider } from './context/ProjectContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/shared/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
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
import ProjectSettingsPage from './pages/ProjectSettingsPage'

// Redirect component that sends customers to their project
function HomeRedirect() {
  const { isCustomer, membership, loading } = useAuth()
  if (loading) return null
  if (isCustomer && membership?.project_id) {
    return <Navigate to={`/projects/${membership.project_id}`} replace />
  }
  return <HomePage />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            {/* Public routes — no layout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes — auth required */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                {/* Home — admin sees all projects, customer redirects */}
                <Route index element={<HomeRedirect />} />

                {/* Admin-only global routes */}
                <Route element={<ProtectedRoute requireAdmin />}>
                  <Route path="general" element={<GeneralPage />} />
                  <Route path="projects/new" element={<NewProjectWizard />} />
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
