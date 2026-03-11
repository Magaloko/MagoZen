import { useState } from 'react'
import { Outlet, useLocation, useMatch } from 'react-router-dom'
import ProjectSidebar from './ProjectSidebar'
import { useLanguage } from '../../context/LanguageContext'
import { useProjects } from '../../context/ProjectContext'

const SEGMENT_TITLE = {
  '':          'title.home',
  'general':   'title.general',
  'phasen':    'title.phases',
  'checkliste':'title.checklist',
  'makros':    'title.macros',
  'dns':       'title.dns',
  'risiken':   'title.risks',
  'kunde':     'title.customer',
  'fragen':    'title.questions',
  'faq':       'title.faq',
  'intern':    'title.intern',
  'demo':      'title.demo',
  'angebot':   'title.angebot',
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Detect project route: /projects/:projectId/...
  const projectMatch = useMatch({ path: '/projects/:projectId', end: false })
  const projectId = (projectMatch?.params?.projectId && projectMatch.params.projectId !== 'new')
    ? projectMatch.params.projectId
    : null

  const { getProjectById } = useProjects()
  const project = projectId ? getProjectById(projectId) : null

  // Derive page title key
  const parts = pathname.split('/').filter(Boolean)
  let titleKey
  if (parts.length === 0) {
    titleKey = 'title.home'
  } else if (parts[0] === 'general') {
    titleKey = 'title.general'
  } else if (parts[0] === 'projects' && parts[1] === 'new') {
    titleKey = 'title.newProject'
  } else if (parts[0] === 'projects' && parts[2]) {
    titleKey = SEGMENT_TITLE[parts[2]] || 'title.dashboard'
  } else if (parts[0] === 'projects') {
    titleKey = 'title.dashboard'
  } else {
    titleKey = 'title.home'
  }

  const pageTitle = project && (parts[0] === 'projects' && !parts[2])
    ? project.name           // Use project name as title on project dashboard
    : t(titleKey)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <ProjectSidebar
        projectId={projectId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className="app-content"
        style={{ flex: 1, marginLeft: 'var(--sidebar-w)', display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }}
      >
        <header
          className="app-topbar"
          style={{
            height: 'var(--topbar-h)',
            display: 'flex', alignItems: 'center',
            padding: '0 24px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--ink)',
            position: 'sticky', top: 0, zIndex: 5, gap: 12,
          }}
        >
          <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Menu">
            <span /><span /><span />
          </button>

          <h1 style={{ fontSize: 15, fontWeight: 600, color: 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
            {pageTitle}
          </h1>
          <div style={{ flex: 1 }} />

          {project ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 4, whiteSpace: 'nowrap' }}>
                {project.short_name || project.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10,
                padding: '4px 10px', borderRadius: 4, whiteSpace: 'nowrap',
                background: project.status === 'active' ? 'var(--green-d)' : 'var(--border)',
                color: project.status === 'active' ? 'var(--green)' : 'var(--muted)',
                border: `1px solid ${project.status === 'active' ? 'var(--green-b)' : 'var(--border)'}`,
              }}>
                {project.status?.toUpperCase()}
              </div>
            </div>
          ) : (
            <div
              className="topbar-badge"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', padding: '4px 12px', border: '1px solid var(--border)', borderRadius: 4, whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              DADAKAEV_LABS
            </div>
          )}
        </header>

        <main className="app-main fade-in" style={{ flex: 1, padding: '24px', overflowY: 'auto', minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
