import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useLanguage } from '../../context/LanguageContext'

const TITLE_KEYS = {
  '/': 'title.dashboard',
  '/phasen': 'title.phases',
  '/checkliste': 'title.checklist',
  '/makros': 'title.macros',
  '/dns': 'title.dns',
  '/risiken': 'title.risks',
  '/kunde': 'title.customer',
  '/fragen': 'title.questions',
  '/faq': 'title.faq',
  '/intern': 'title.intern',
  '/demo':   'title.demo',
  '/angebot': 'title.angebot',
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className="app-content"
        style={{ flex: 1, marginLeft: 'var(--sidebar-w)', display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }}
      >
        <header
          className="app-topbar"
          style={{
            height: 'var(--topbar-h)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--ink)',
            position: 'sticky',
            top: 0,
            zIndex: 5,
            gap: 12,
          }}
        >
          <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Menu">
            <span /><span /><span />
          </button>

          <h1 style={{ fontSize: 15, fontWeight: 600, color: 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
            {t(TITLE_KEYS[pathname] || 'title.dashboard')}
          </h1>
          <div style={{ flex: 1 }} />
          <div
            className="topbar-badge"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', padding: '4px 12px', border: '1px solid var(--border)', borderRadius: 4, whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {t('topbar.project')}
          </div>
        </header>

        <main className="app-main fade-in" style={{ flex: 1, padding: '24px', overflowY: 'auto', minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
