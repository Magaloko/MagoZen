import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/', icon: '⊞', label: 'Dashboard' },
  { to: '/phasen', icon: '◈', label: 'Phasen' },
  { to: '/checkliste', icon: '✓', label: 'Go-Live Checkliste' },
  { to: '/makros', icon: '⚡', label: 'Makros' },
  { to: '/dns', icon: '◎', label: 'DNS & E-Mail' },
  { to: '/risiken', icon: '△', label: 'Risiken' },
  { to: '/kunde', icon: '◇', label: 'Kundendaten' },
  { to: '/faq', icon: '?', label: 'Q&A Vorbereitung' },
  { to: '/intern', icon: '⊙', label: 'Intern (Kalkulation)' },
]

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 'var(--sidebar-w)',
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
      {/* Logo */}
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>
          DADAKAEV_LABS
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>HFK // Zendesk Setup</div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              borderRadius: 'var(--r)',
              marginBottom: 2,
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--green)' : 'var(--muted-l)',
              background: isActive ? 'var(--green-d)' : 'transparent',
              border: isActive ? '1px solid var(--green-b)' : '1px solid transparent',
              transition: 'all .15s',
            })}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>
              {icon}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--muted)' }}>
        <div style={{ fontFamily: 'var(--font-mono)' }}>v1.0 · März 2025</div>
        <div>Intern · Vertraulich</div>
      </div>
    </aside>
  )
}
