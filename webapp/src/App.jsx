import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="phasen" element={<PhasesPage />} />
          <Route path="checkliste" element={<ChecklistPage />} />
          <Route path="makros" element={<MacrosPage />} />
          <Route path="dns" element={<DNSPage />} />
          <Route path="risiken" element={<RisksPage />} />
          <Route path="kunde" element={<CustomerPage />} />
          <Route path="fragen" element={<FragenPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="intern" element={<InternPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
