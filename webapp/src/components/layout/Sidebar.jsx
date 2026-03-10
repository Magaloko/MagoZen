import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { LANGUAGES } from '../../i18n/translations'

const NAV = [
  { to: '/', key: 'nav.dashboard', icon: '⊞' },
  { to: '/phasen', key: 'nav.phases', icon: '◈' },
  { to: '/checkliste', key: 'nav.checklist', icon: '✓' },
  { to: '/makros', key: 'nav.macros', icon: '⚡' },
  { to: '/dns', key: 'nav.dns', icon: '◎' },
  { to: '/risiken', key: 'nav.risks', icon: '△' },
  { to: '/kunde', key: 'nav.customer', icon: '◇' },
  { to: '/fragen', key: 'nav.questions', icon: '≡' },
  { to: '/faq', key: 'nav.faq', icon: '?' },
  { to: '/intern', key: 'nav.intern', icon: '⊙' },
  { to: '/demo', key: 'nav.demo', icon: '▷' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { t, lang, switchLang } = useLanguage()

  return (
    <aside
      className={`app-sidebar${isOpen ? ' sidebar-open' : ''}`}
      style={{
        width: 'var(--sidebar-w, 240px)',
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
        width: 240,
      }}
    >
      {/* Logo + close button */}
      <div style={{ padding: '16px 16px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>
            DADAKAEV_LABS
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>HFK // Zendesk Setup</div>
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

      {/* Nav */}
      <nav style={{ padding: '10px 8px', flex: 1 }}>
        {NAV.map(({ to, key, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            style={({ isActive }) => ({
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
            })}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>
              {icon}
            </span>
            {t(key)}
          </NavLink>
        ))}
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
                flex: 1,
                padding: '6px 4px',
                borderRadius: 4,
                border: lang === code ? '1px solid var(--green-b)' : '1px solid var(--border)',
                background: lang === code ? 'var(--green-d)' : 'transparent',
                color: lang === code ? 'var(--green)' : 'var(--muted-l)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                fontWeight: lang === code ? 700 : 400,
                cursor: 'pointer',
                transition: 'all .15s',
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
