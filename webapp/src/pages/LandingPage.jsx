import { Link } from 'react-router-dom'

// ── Design tokens (explicit hex — no CSS variable ambiguity) ─────────────────
const C = {
  page:    '#F5F7FA',
  surface: '#FFFFFF',
  border:  '#E2E8F0',
  borderM: '#CBD5E1',
  text:    '#1C2536',
  sub:     '#374151',
  muted:   '#64748B',
  green:   '#5C7A6A',
  greenBg: 'rgba(92,122,106,0.07)',
  greenBd: 'rgba(92,122,106,0.20)',
  greenPl: 'rgba(92,122,106,0.12)',
  blue:    '#0078D4',
  blueBg:  'rgba(0,120,212,0.07)',
  blueBd:  'rgba(0,120,212,0.20)',
  hero:    '#EFF6F3',
}

// ── Data ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: '🎯',
    name: 'Zendesk Suite',
    sub: 'Customer Support Platform',
    accent: C.green,
    bg: C.greenBg,
    bd: C.greenBd,
    features: [
      'Tickets, E-Mail, Chat & Voice',
      'SLA-Management & Eskalationsregeln',
      'Help Center & mehrsprachiger FAQ',
      'JTL Shop- & WAWI-Integration',
      'KI Copilot & erweiterte Analytics',
      'Multi-Brand Support',
    ],
  },
  {
    icon: '⚡',
    name: 'Power Automate',
    sub: 'Microsoft Automation Platform',
    accent: C.blue,
    bg: C.blueBg,
    bd: C.blueBd,
    features: [
      'Cloud Flows (Automated & Scheduled)',
      'JTL Custom Connector',
      'Outlook, Teams, SharePoint',
      'Fehlerbehandlung & Monitoring',
      'RPA & Desktop-Automatisierung',
      'Schulung & Dokumentation',
    ],
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Projekt anlegen',
    desc: 'Dienst-Typ wählen, Kundendaten eingeben, Plan konfigurieren. Wizard-geführt in unter 5 Minuten.',
  },
  {
    n: '02',
    title: 'Phasen & Tasks pflegen',
    desc: 'Vorgefertigte Projektphasen direkt einsatzbereit. Anpassen, Tasks abhaken, Fortschritt tracken.',
  },
  {
    n: '03',
    title: 'Kunde einladen',
    desc: 'Kunden erhalten einen eigenen Zugang und sehen Fortschritt, FAQ und offene Fragen live.',
  },
]

const APP_FEATURES = [
  { icon: '📋', label: 'Projektphasen',      desc: 'Phasen mit Tasks, Stunden-Tracking und Fortschrittsbalken.' },
  { icon: '✅', label: 'Go-Live Checkliste', desc: 'Alle Punkte sicher abhaken — nichts vergessen.' },
  { icon: '⚠️', label: 'Risikomanagement',   desc: 'Risiken erfassen, bewerten und Maßnahmen dokumentieren.' },
  { icon: '👤', label: 'Kundenportal',       desc: 'Kunden sehen ihren Projektstand direkt im Tool.' },
  { icon: '💬', label: 'Fragen & FAQ',       desc: 'Offene Kundenfragen strukturiert sammeln und beantworten.' },
  { icon: '📊', label: 'Dashboard',          desc: 'Überblick über Phasen, Checkliste & KPIs auf einen Blick.' },
  { icon: '🔗', label: 'DNS / Umgebungen',   desc: 'DNS-Einträge oder Power Platform Umgebungen verwalten.' },
  { icon: '💼', label: 'Angebot & Intern',   desc: 'Internes Briefing, Upsells und Angebotsdetails für Admins.' },
]

const STATS = [
  { value: '2',  label: 'Service-Typen' },
  { value: '5',  label: 'Projektphasen' },
  { value: '12', label: 'Go-Live Punkte' },
  { value: '∞',  label: 'Projekte' },
]

// ── Shared sub-components ────────────────────────────────────────────────────
function Section({ children, style = {} }) {
  return (
    <section style={{ padding: '64px 24px', ...style }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>{children}</div>
    </section>
  )
}

function SectionHead({ title, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 44 }}>
      <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.8, color: C.text, marginBottom: 10 }}>{title}</h2>
      {sub && <p style={{ color: C.muted, fontSize: 16 }}>{sub}</p>}
    </div>
  )
}

// ── Landing Page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const font = "'IBM Plex Sans', system-ui, sans-serif"

  return (
    <div style={{ background: C.page, minHeight: '100vh', fontFamily: font, color: C.text, fontSize: 15, lineHeight: 1.6 }}>

      {/* ── NAV ── */}
      <header style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontWeight: 800, fontSize: 17, color: C.green, letterSpacing: -0.4, userSelect: 'none' }}>
            Projekt<span style={{ color: C.text, fontWeight: 600 }}>Tool</span>
          </span>
          <div style={{ flex: 1 }} />
          <Link to="/rechner" style={{ fontSize: 13, color: C.muted, textDecoration: 'none', padding: '6px 4px' }}>
            Rechner
          </Link>
          <Link
            to="/login"
            style={{ fontSize: 13, color: C.text, padding: '7px 14px', border: `1px solid ${C.border}`, borderRadius: 6, textDecoration: 'none', fontWeight: 500 }}
          >
            Anmelden
          </Link>
          <Link
            to="/register"
            style={{ fontSize: 13, color: '#fff', background: C.green, padding: '7px 16px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}
          >
            Kostenlos starten →
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(160deg, ${C.hero} 0%, #FFFFFF 65%)`, padding: '80px 24px 72px', textAlign: 'center' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: C.greenBg, border: `1px solid ${C.greenBd}`, borderRadius: 20,
            padding: '5px 14px', fontSize: 12, color: C.green, fontWeight: 700,
            letterSpacing: 0.6, marginBottom: 28, textTransform: 'uppercase',
          }}>
            ✦ Zendesk · Power Automate · JTL
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 54px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.8, marginBottom: 20, color: C.text }}>
            Implementierungs-Projekte,<br />
            <span style={{ color: C.green }}>die reibungslos laufen.</span>
          </h1>
          <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 36px' }}>
            Das Projekt-Tool für professionelle Zendesk Suite und Microsoft Power Automate Rollouts —
            mit Phasen, Checklisten und Kundenportal.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{ background: C.green, color: '#fff', padding: '13px 28px', borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: 'none', letterSpacing: -0.2 }}
            >
              Jetzt kostenlos starten
            </Link>
            <Link
              to="/rechner"
              style={{ background: C.surface, color: C.text, padding: '13px 28px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: `1px solid ${C.border}` }}
            >
              Lizenzrechner →
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {STATS.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: '28px 24px', textAlign: 'center',
                  borderRight: i < STATS.length - 1 ? `1px solid ${C.border}` : 'none',
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 800, color: C.green, letterSpacing: -1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <Section>
        <SectionHead
          title="Zwei Dienste. Ein Tool."
          sub="Speziell entwickelt für Zendesk Suite und Microsoft Power Automate Implementierungen."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {SERVICES.map(svc => (
            <div key={svc.name} style={{ background: C.surface, border: `1px solid ${svc.bd}`, borderRadius: 12, padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, background: svc.bg, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                  {svc.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>{svc.name}</div>
                  <div style={{ color: svc.accent, fontSize: 12, fontWeight: 600, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.4 }}>{svc.sub}</div>
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {svc.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: C.sub }}>
                    <span style={{ color: svc.accent, fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '64px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHead
            title="In 3 Schritten zum laufenden Projekt"
            sub="Vom ersten Kundengespräch bis zum Go-Live — alles an einem Ort."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {STEPS.map((s, i) => (
              <div
                key={i}
                style={{ padding: '28px 28px 26px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.page, position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ fontSize: 52, fontWeight: 900, color: C.green, opacity: 0.10, position: 'absolute', top: 8, right: 16, lineHeight: 1, fontFamily: 'monospace', userSelect: 'none' }}>
                  {s.n}
                </div>
                <div style={{ width: 28, height: 28, background: C.greenBg, border: `1px solid ${C.greenBd}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: C.green, marginBottom: 14 }}>
                  {s.n}
                </div>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>{s.title}</div>
                <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <Section>
        <SectionHead
          title="Alles dabei. Nichts vergessen."
          sub="Alle Werkzeuge für eine erfolgreiche Implementierung — in einem Tool."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {APP_FEATURES.map(f => (
            <div
              key={f.label}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px 22px', display: 'flex', gap: 16, alignItems: 'flex-start' }}
            >
              <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5 }}>{f.label}</div>
                <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── RECHNER TEASER ── */}
      <section style={{ background: `linear-gradient(135deg, ${C.greenBg}, ${C.blueBg})`, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🧮</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, marginBottom: 12 }}>
            Welcher Plan passt zu Ihnen?
          </h2>
          <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
            Mit unserem interaktiven Bedarfsrechner finden Sie den optimalen Zendesk- oder
            Power Automate-Plan — basierend auf Agentenzahl, Ticket-Volumen und Anforderungen.
          </p>
          <Link
            to="/rechner"
            style={{ background: C.green, color: '#fff', padding: '13px 32px', borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}
          >
            Zum Bedarfsrechner →
          </Link>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '72px 24px', textAlign: 'center', background: C.surface }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, marginBottom: 14 }}>
            Bereit loszulegen?
          </h2>
          <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            Erstellen Sie Ihren kostenlosen Account und starten Sie Ihr erstes
            Projekt in wenigen Minuten.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{ background: C.green, color: '#fff', padding: '13px 28px', borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}
            >
              Account erstellen
            </Link>
            <Link
              to="/login"
              style={{ background: 'transparent', color: C.text, padding: '13px 28px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: `1px solid ${C.border}` }}
            >
              Bereits registriert? Anmelden
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '20px 24px', background: C.page }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 800, color: C.green, fontSize: 14 }}>ProjektTool</span>
          <span style={{ color: C.muted, fontSize: 12 }}>© 2025 Dadakaev Labs · Zendesk & Power Automate Implementierungen</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/rechner" style={{ color: C.muted, fontSize: 13, textDecoration: 'none' }}>Rechner</Link>
            <Link to="/login"   style={{ color: C.muted, fontSize: 13, textDecoration: 'none' }}>Login</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
