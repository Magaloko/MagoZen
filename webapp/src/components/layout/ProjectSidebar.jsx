import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useProjects } from '../../context/ProjectContext'
import { useAuth } from '../../context/AuthContext'
import { LANGUAGES } from '../../i18n/translations'

// ── Grouped navigation structure ──
const NAV_GROUPS = [
  {
    id: 'overview',
    label: 'ÜBERSICHT',
    defaultOpen: true,
    items: [
      { seg: '', key: 'nav.dashboard', icon: '⊞', end: true },
    ],
  },
  {
    id: 'setup',
    label: 'SETUP & TECHNIK',
    defaultOpen: true,
    items: [
      { seg: 'phasen', key: 'nav.phases', icon: '◈' },
      { seg: 'dns', key: 'nav.dns', icon: '◎' },
      { seg: 'checkliste', key: 'nav.checklist', icon: '✓' },
    ],
  },
  {
    id: 'content',
    label: 'INHALTE & VORLAGEN',
    defaultOpen: true,
    items: [
      { seg: 'makros', key: 'nav.macros', icon: '⚡' },
      { seg: 'faq', key: 'nav.faq', icon: '?' },
      { seg: 'fragen', key: 'nav.questions', icon: '≡' },
    ],
  },
  {
    id: 'project',
    label: 'PROJEKT-INFOS',
    defaultOpen: true,
    items: [
      { seg: 'kunde', key: 'nav.customer', icon: '◇' },
      { seg: 'risiken', key: 'nav.risks', icon: '△' },
      { seg: 'demo', key: 'nav.demo', icon: '▷' },
    ],
  },
  {
    id: 'admin',
    label: 'INTERN',
    adminOnly: true,
    defaultOpen: true,
    items: [
      { seg: 'intern', key: 'nav.intern', icon: '⊙', adminOnly: true },
      { seg: 'angebot', key: 'nav.angebot', icon: '€', adminOnly: true },
    ],
  },
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
  padding: '8px 12px 8px 20px',
  borderRadius: 'var(--r)',
  marginBottom: 1,
  fontSize: 13,
  fontWeight: isActive ? 600 : 400,
  color: isActive ? 'var(--green)' : 'var(--muted-l)',
  background: isActive ? 'var(--green-d)' : 'transparent',
  border: isActive ? '1px solid var(--green-b)' : '1px solid transparent',
  transition: 'all .15s',
  minHeight: 36,
  textDecoration: 'none',
})

function NavGroup({ group, projectId, isAdmin, membership, t, onClose, openGroups, toggleGroup }) {
  const isOpen = openGroups[group.id] ?? group.defaultOpen

  // Filter items by role
  const visibleItems = group.items.filter(({ seg, adminOnly }) => {
    if (isAdmin) return true
    if (adminOnly) return false
    if (seg === '') return true
    return (membership?.visible_pages || []).includes(seg)
  })

  // Don't render group if no visible items
  if (visibleItems.length === 0) return null

  // Single-item groups (like Dashboard) render without header
  if (group.id === 'overview') {
    return (
      <div style={{ marginBottom: 4 }}>
        {visibleItems.map(({ seg, key, icon, end }) => {
          const to = seg ? `/projects/${projectId}/${seg}` : `/projects/${projectId}`
          return (
            <NavLink key={seg} to={to} end={end} onClick={onClose} style={({ isActive }) => ({ ...navStyle(isActive), padding: '9px 12px' })}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
              {t(key)}
            </NavLink>
          )
        })}
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 4 }}>
      {/* Category header — clickable to toggle */}
      <button
        onClick={() => toggleGroup(group.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          width: '100%',
          padding: '8px 12px 4px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          borderTop: '1px solid var(--border)',
          marginTop: 6,
          paddingTop: 10,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          flex: 1,
          textAlign: 'left',
        }}>
          {group.label}
        </span>
        <span style={{
          fontSize: 10,
          color: 'var(--muted)',
          transition: 'transform .2s',
          transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
        }}>
          ▾
        </span>
      </button>

      {/* Collapsible items */}
      <div style={{
        overflow: 'hidden',
        maxHeight: isOpen ? visibleItems.length * 44 : 0,
        opacity: isOpen ? 1 : 0,
        transition: 'max-height .25s ease, opacity .2s ease',
      }}>
        {visibleItems.map(({ seg, key, icon, end }) => {
          const to = seg ? `/projects/${projectId}/${seg}` : `/projects/${projectId}`
          return (
            <NavLink key={seg} to={to} end={end} onClick={onClose} style={({ isActive }) => navStyle(isActive)}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
              {t(key)}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

export default function ProjectSidebar({ projectId, isOpen, onClose }) {
  const { t, lang, switchLang } = useLanguage()
  const { projects } = useProjects()
  const { isAdmin, isCustomer, membership } = useAuth()
  const { pathname } = useLocation()

  const currentProject = projectId ? projects.find((p) => p.id === projectId) : null

  // Track open/closed state of each group
  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {}
    NAV_GROUPS.forEach(g => { initial[g.id] = g.defaultOpen })
    return initial
  })

  const toggleGroup = (id) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <aside
      className={`app-sidebar${isOpen ? ' sidebar-open' : ''}`}
      style={{
        width: 280,
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
            {isCustomer ? 'KUNDENPORTAL' : 'DADAKAEV_LABS'}
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
          /* ── PROJECT MODE — Grouped Navigation ── */
          <>
            {isAdmin && (
              <Link
                to="/"
                onClick={onClose}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', fontSize: 12, color: 'var(--muted)', borderBottom: '1px solid var(--border)', marginBottom: 8, textDecoration: 'none' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)' }}>←</span>
                {t('nav.back')}
              </Link>
            )}

            {currentProject && (
              <div style={{ padding: '8px 12px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 'var(--r)', marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)', wordBreak: 'break-word' }}>
                  {currentProject.name}
                </div>
                <div style={{ fontSize: 10, color: STATUS_COLOR[currentProject.status] || 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: 2, textTransform: 'uppercase' }}>
                  {currentProject.status}
                </div>
              </div>
            )}

            {NAV_GROUPS.map(group => {
              // Skip admin-only groups for customers
              if (group.adminOnly && !isAdmin) return null
              return (
                <NavGroup
                  key={group.id}
                  group={group}
                  projectId={projectId}
                  isAdmin={isAdmin}
                  membership={membership}
                  t={t}
                  onClose={onClose}
                  openGroups={openGroups}
                  toggleGroup={toggleGroup}
                />
              )
            })}

            {isAdmin && (
              <NavLink
                to={`/projects/${projectId}/settings`}
                onClick={onClose}
                style={({ isActive }) => ({
                  ...navStyle(isActive),
                  padding: '9px 12px',
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
          /* ── GENERAL MODE (admin home) ── */
          <>
            <NavLink to="/" end onClick={onClose} style={({ isActive }) => ({ ...navStyle(isActive), padding: '9px 12px' })}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>⌂</span>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/general" onClick={onClose} style={({ isActive }) => ({ ...navStyle(isActive), padding: '9px 12px' })}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>◇</span>
              {t('nav.general')}
            </NavLink>
            <NavLink to="/users" onClick={onClose} style={({ isActive }) => ({ ...navStyle(isActive), padding: '9px 12px' })}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>◎</span>
              Benutzer
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
                  style={() => ({ ...navStyle(isActive), padding: '9px 12px' })}
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
