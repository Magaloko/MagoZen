import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

const PLANS = [
  {
    id: 'team',
    name: 'Suite Team',
    price: 55,
    color: 'blue',
    features: ['Ticketing per E-Mail, Web, Social', 'Help Center (öffentlich)', 'Berichterstattung & Analysen', 'API-Zugriff', 'Bis zu 50 AI-Antworten/Mo.'],
  },
  {
    id: 'growth',
    name: 'Suite Growth',
    price: 89,
    color: 'purple',
    features: ['Alles aus Team', 'Mehrsprachiger Help Center', 'Self-Service Portal', 'SLA-Verwaltung', 'Benutzerdefinierte Geschäftszeiten', 'CSAT-Umfragen'],
  },
  {
    id: 'professional',
    name: 'Suite Professional',
    price: 115,
    color: 'green',
    highlight: true,
    features: ['Alles aus Growth', 'Skills-basiertes Routing', 'Gesprächsweiterleitung', 'Sandbox-Umgebung', 'Erweiterte AI-Automatisierung', 'Light Agents (kostenlos)'],
  },
  {
    id: 'enterprise',
    name: 'Suite Enterprise',
    price: 169,
    color: 'amber',
    features: ['Alles aus Professional', 'Benutzerdefinierte Rollen & Berechtigungen', 'Mehrere Sandboxes', 'Erweiterte Compliance', 'Enterprise-Support'],
  },
]

const ADDONS = [
  { icon: '🤖', name: 'AI Copilot', desc: 'Automatische Ticket-Zusammenfassungen, Antwortvorschläge, nächste Schritte. Spart ~35% Bearbeitungszeit.', price: '~€50/Agent/Mo.' },
  { icon: '🛒', name: 'JTL Integration', desc: 'Direkte Verbindung zu JTL Shop & WAWI. Bestellstatus, Kundendaten und Tracking direkt im Ticket sichtbar.', price: '~€200 Einmalaufwand' },
  { icon: '💬', name: 'WhatsApp Business', desc: 'WhatsApp-Nachrichten als Zendesk-Tickets. Kunden erreichen Support über bevorzugten Kanal.', price: 'Meta-Gebühren variabel' },
  { icon: '🎨', name: 'Branding & Setup', desc: 'Vollständiges Onboarding: Branding, Gruppen, Makros, SLA-Policies, Triggers, Help Center Aufbau.', price: 'ab €2.880 netto' },
  { icon: '📚', name: 'Help Center', desc: 'Professionelles Wissenszentrum mit Artikeln, Kategorien und KI-gestützter Suche. Reduziert Ticket-Volumen.', price: 'Im Plan enthalten' },
  { icon: '📊', name: 'Analytics & Reporting', desc: 'Benutzerdefinierte Dashboards, Ticket-Trends, Agenten-Performance, SLA-Compliance-Reports.', price: 'Im Plan enthalten' },
]

const PROCESS = [
  { step: '01', title: 'Erstgespräch & Analyse', desc: 'Anforderungen aufnehmen, Paket zusammenstellen, Zeitplan definieren.' },
  { step: '02', title: 'Zendesk Setup', desc: 'Account erstellen, Branding, Gruppen, Agenten, E-Mail und DNS konfigurieren.' },
  { step: '03', title: 'Integrationen', desc: 'JTL, WhatsApp oder andere Systeme anbinden und testen.' },
  { step: '04', title: 'Automationen & Makros', desc: 'Trigger, SLA-Policies, Antwortvorlagen und Routing einrichten.' },
  { step: '05', title: 'Schulung & Go-Live', desc: 'Remote-Schulung für das Team, Dokumentation und 30 Tage Nachbetreuung.' },
]

export default function GeneralPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 980 }}>

      {/* Hero */}
      <div style={{ padding: '32px 0 16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 10 }}>
          DADAKAEV_LABS · Zendesk Partner
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--white)', margin: '0 0 12px', lineHeight: 1.25 }}>
          Professionelle Zendesk-Implementierung<br />
          <span style={{ color: 'var(--green)' }}>für E-Commerce & Handel</span>
        </h1>
        <p style={{ fontSize: 15, color: 'var(--muted-l)', lineHeight: 1.65, maxWidth: 640, margin: '0 0 24px' }}>
          Wir richten Zendesk komplett ein — von der Erstanalyse bis zum Go-Live.
          JTL-Integration, AI Copilot, Makros, SLA-Policies und Schulung inklusive.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link
            to="/projects/new"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', background: 'var(--green)', color: '#fff', borderRadius: 'var(--r)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
          >
            + Projekt anlegen
          </Link>
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted-l)', borderRadius: 'var(--r)', fontSize: 14, textDecoration: 'none' }}
          >
            Projekte ansehen
          </Link>
        </div>
      </div>

      {/* Plans */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          Zendesk Suite Pläne · pro Agent / Monat
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              style={{
                border: plan.highlight ? '1px solid var(--green-b)' : '1px solid var(--border)',
                background: plan.highlight ? 'rgba(63,207,142,.04)' : 'var(--ink-m)',
                position: 'relative',
              }}
            >
              {plan.highlight && (
                <div style={{ position: 'absolute', top: -1, right: 12, padding: '3px 10px', background: 'var(--green)', color: '#fff', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700, borderRadius: '0 0 4px 4px' }}>
                  EMPFOHLEN
                </div>
              )}
              <Badge color={plan.color} style={{ marginBottom: 12 }}>{plan.name}</Badge>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: plan.highlight ? 'var(--green)' : 'var(--white)', lineHeight: 1, marginBottom: 4 }}>
                €{plan.price}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 16 }}>pro Agent / Monat</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--muted-l)' }}>
                    <span style={{ color: plan.highlight ? 'var(--green)' : 'var(--muted)', flexShrink: 0 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          * Jahresabrechnung ca. 20% günstiger · Light Agents (nur Lesen + interne Notizen) kostenlos in Suite Professional+
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          Add-ons & Leistungen
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {ADDONS.map((addon) => (
            <div key={addon.name} style={{ padding: '16px', background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{addon.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--white)', marginBottom: 6 }}>{addon.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted-l)', lineHeight: 1.55, marginBottom: 10 }}>{addon.desc}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)' }}>{addon.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          Unser Prozess
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {PROCESS.map((step, i) => (
            <div key={step.step} style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: i < PROCESS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--green)', width: 44, flexShrink: 0, paddingTop: 2 }}>{step.step}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--white)', marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted-l)', lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card style={{ background: 'var(--green-d)', border: '1px solid var(--green-b)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--white)', marginBottom: 6 }}>
              Bereit für den nächsten Kunden?
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted-l)', lineHeight: 1.5 }}>
              Neues Projekt anlegen, Kundendaten einpflegen und direkt loslegen.
              Das System führt durch alle Schritte.
            </div>
          </div>
          <Link
            to="/projects/new"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', background: 'var(--green)', color: '#fff', borderRadius: 'var(--r)', fontSize: 14, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            + Projekt starten
          </Link>
        </div>
      </Card>

    </div>
  )
}
