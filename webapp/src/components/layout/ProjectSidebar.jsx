import { NavLink, Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useProjects } from '../../context/ProjectContext'
import { useAuth } from '../../context/AuthContext'
import { LANGUAGES } from '../../i18n/translations'

const PROJECT_NAV = [
  { seg: '',        key: 'nav.dashboard',  icon: '⊞', end: true },
  { seg: 'phasen',  key: 'nav.phases',     icon: '◈' },
  { seg: 'checkliste', key: 'nav.checklist', icon: '✓' },
  { seg: 'makros',  key: 'nav.macros',     icon: '⚡' },
  { seg: 'dns',     key: 'nav.dns',        icon: '◎' },
  { seg: 'risiken', key: 'nav.risks',      icon: '△' },
  { seg: 'kunde',   key: 'nav.customer',   icon: '◇' },
  { seg: 'fragen',  key: 'nav.questions',  icon: '≡' },
  { seg: 'faq',     key: 'nav.faq',        icon: '?' },
  { seg: 'intern',  key: 'nav.intern',     icon: '⊙', adminOnly: true },
  { seg: 'demo',    key: 'nav.demo',       icon: '▷' },
  { seg: 'angebot', key: 'nav.angebot',    icon: '€', adminOnly: true },
]

const STATUS_COLOR = {
  active: 'var(--green)',
  planning: 'var(--blue)',
  paused: 'var(--amber)',
  completed: 'var(--muted)',
}

const navStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '9px 12px',
  borderRadius: 'var(--r)',
  marginBottom: 2,
  fontSize: 13,
  fontWeight: isActive ? 600 : 400,
  color: isActive ? 'var(--green)' : 'var(--muted-l)',
  background: isActive ? 'var(--green-d)' : 'transparent',
  border: isActive ? '1px solid var(--green-b)' : '1px solid transparent',
  transition: 'all .15s',
  minHeight: 40,
  textDecoration: 'none',
})

export default function ProjectSidebar({ projectId, isOpen, onClose }) {
  const { t, lang, switchLang } = useLanguage()
  const { projects } = useProjects()
  const { isAdmin, isCustomer, membership } = useAuth()
  const { pathname } = useLocation()

  const currentProject = projectId ? projects.find((p) => p.id === projectId) : null

  // Filter nav items based on role
  const visibleNav = PROJECT_NAV.filter(({ seg, adminOnly }) => {
    if (isAdmin) return true
    if (adminOnly) return false
    // Dashboard is always visible for customers
    if (seg === '') return true
    // Check visible_pages from membership
    return (membership?.visible_pages || []).includes(seg)
  })

  return (
    <aside
      className={`app-sidebar${isOpen ? ' sidebar-open' : ''}`}
      style={{
        width: 240,
        background: 'var(--ink)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        overflowY: 'auto',
        zIndex: 10,
      }}
    >
      {/* Logo / Header */}
      <div style={{ padding: '16px 16px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>
            DADAKAEV_LABS
          </div>
          {currentProject ? (
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentProject.short_name || currentProject.name}
            </div>
          ) : (
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>CRM Platform</div>
          )}
        </div>
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close menu"
          style={{ background: 'transparent', border: 'none', color: 'var(--muted-l)', fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: '2px 4px', flexShrink: 0 }}
        >
          ×
        </button>
      </div>

      <nav style={{ padding: '10px 8px', flex: 1 }}>
        {projectId ? (
          /* ── PROJECT MODE ── */
          <>
            {isAdmin && (
              <Link
                to="/"
                onClick={onClose}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', fontSize: 12, color: 'var(--muted)', borderBottom: '1px solid var(--border)', marginBottom: 10, textDecoration: 'none' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)' }}>←</span>
                {t('nav.back')}
              </Link>
            )}

            {currentProject && (
              <div style={{ padding: '8px 12px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 'var(--r)', marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentProject.name}
                </div>
                <div style={{ fontSize: 10, color: STATUS_COLOR[currentProject.status] || 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: 2, textTransform: 'uppercase' }}>
                  {currentProject.status}
                </div>
              </div>
            )}

            {visibleNav.map(({ seg, key, icon, end }) => {
              const to = seg ? `/projects/${projectId}/${seg}` : `/projects/${projectId}`
              return (
                <NavLink
                  key={seg}
                  to={to}
                  end={end}
                  onClick={onClose}
                  style={({ isActive }) => navStyle(isActive)}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
                  {t(key)}
                </NavLink>
              )
            })}

            {isAdmin && (
              <NavLink
                to={`/projects/${projectId}/settings`}
                onClick={onClose}
                style={({ isActive }) => ({
                  ...navStyle(isActive),
                  marginTop: 8,
                  borderTop: '1px solid var(--border)',
                  paddingTop: 12,
                })}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>⚙</span>
                Einstellungen
              </NavLink>
            )}
          </>
        ) : (
          /* ── GENERAL MODE (admin only) ── */
          <>
            <NavLink to="/" end onClick={onClose} style={({ isActive }) => navStyle(isActive)}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>⌂</span>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/general" onClick={onClose} style={({ isActive }) => navStyle(isActive)}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>◇</span>
              {t('nav.general')}
            </NavLink>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', padding: '10px 12px 4px', marginTop: 4 }}>
              {t('nav.projects')}
            </div>

            {projects.map((p) => {
              const isActive = pathname.startsWith(`/projects/${p.id}`)
              return (
                <NavLink
                  key={p.id}
                  to={`/projects/${p.id}`}
                  onClick={onClose}
                  style={navStyle(isActive)}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, width: 18, textAlign: 'center', flexShrink: 0, color: STATUS_COLOR[p.status] || 'var(--muted)' }}>●</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.short_name || p.name}
                  </span>
                </NavLink>
              )
            })}

            <Link
              to="/projects/new"
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                borderRadius: 'var(--r)', marginBottom: 2, fontSize: 13,
                color: 'var(--green)', border: '1px dashed var(--green-b)',
                background: 'transparent', transition: 'all .15s', minHeight: 40,
                textDecoration: 'none', marginTop: 4,
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>+</span>
              {t('nav.newProject')}
            </Link>
          </>
        )}
      </nav>

      {/* Language switcher */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
          Language
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => switchLang(code)}
              style={{
                flex: 1, padding: '6px 4px', borderRadius: 4,
                border: lang === code ? '1px solid var(--green-b)' : '1px solid var(--border)',
                background: lang === code ? 'var(--green-d)' : 'transparent',
                color: lang === code ? 'var(--green)' : 'var(--muted-l)',
                fontFamily: 'var(--font-mono)', fontSize: 12,
                fontWeight: lang === code ? 700 : 400,
                cursor: 'pointer', transition: 'all .15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', fontSize: 11, color: 'var(--muted)' }}>
        <div style={{ fontFamily: 'var(--font-mono)' }}>{t('sidebar.footer.version')}</div>
        <div>{t('sidebar.footer.confidential')}</div>
      </div>
    </aside>
  )
}
