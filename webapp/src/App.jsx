import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProjectProvider } from './context/ProjectContext'
import AppLayout from './components/layout/AppLayout'
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

export default function App() {
  return (
    <BrowserRouter>
      <ProjectProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="general" element={<GeneralPage />} />
            <Route path="projects/new" element={<NewProjectWizard />} />
            <Route path="projects/:projectId" element={<Dashboard />} />
            <Route path="projects/:projectId/phasen" element={<PhasesPage />} />
            <Route path="projects/:projectId/checkliste" element={<ChecklistPage />} />
            <Route path="projects/:projectId/makros" element={<MacrosPage />} />
            <Route path="projects/:projectId/dns" element={<DNSPage />} />
            <Route path="projects/:projectId/risiken" element={<RisksPage />} />
            <Route path="projects/:projectId/kunde" element={<CustomerPage />} />
            <Route path="projects/:projectId/fragen" element={<FragenPage />} />
            <Route path="projects/:projectId/faq" element={<FAQPage />} />
            <Route path="projects/:projectId/intern" element={<InternPage />} />
            <Route path="projects/:projectId/demo" element={<DemoPage />} />
            <Route path="projects/:projectId/angebot" element={<AngebotPage />} />
          </Route>
        </Routes>
      </ProjectProvider>
    </BrowserRouter>
  )
}
