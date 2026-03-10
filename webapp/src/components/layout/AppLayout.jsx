import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/phasen': 'Phasen & Aufgaben',
  '/checkliste': 'Go-Live Checkliste',
  '/makros': 'Makros (Antwortvorlagen)',
  '/dns': 'DNS & E-Mail Setup',
  '/risiken': 'Risiken & Besonderheiten',
  '/kunde': 'Kundendaten HFK',
  '/faq': 'Q&A Vorbereitung',
  '/intern': 'Intern – Kalkulation',
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || 'HFK Dashboard'

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 'var(--sidebar-w)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Topbar */}
        <header
          style={{
            height: 'var(--topbar-h)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 28px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--ink)',
            position: 'sticky',
            top: 0,
            zIndex: 5,
            gap: 14,
          }}
        >
          <h1 style={{ fontSize: 15, fontWeight: 600, color: 'var(--white)' }}>{title}</h1>
          <div style={{ flex: 1 }} />
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--muted)',
              padding: '4px 12px',
              border: '1px solid var(--border)',
              borderRadius: 4,
            }}
          >
            Projekt: HFK Zendesk+JTL+Copilot
          </div>
        </header>
        {/* Content */}
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }} className="fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
