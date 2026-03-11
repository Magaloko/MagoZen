import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

const PLANS = [
  {
    id: 'team',
    name: 'Suite Team',
    color: 'blue',
    features: ['Ticketing per E-Mail, Web, Social', 'Help Center (öffentlich)', 'Berichterstattung & Analysen', 'API-Zugriff', 'Bis zu 50 AI-Antworten/Mo.'],
  },
  {
    id: 'growth',
    name: 'Suite Growth',
    color: 'purple',
    features: ['Alles aus Team', 'Mehrsprachiger Help Center', 'Self-Service Portal', 'SLA-Verwaltung', 'Benutzerdefinierte Geschäftszeiten', 'CSAT-Umfragen'],
  },
  {
    id: 'professional',
    name: 'Suite Professional',
    color: 'green',
    highlight: true,
    features: ['Alles aus Growth', 'Skills-basiertes Routing', 'Gesprächsweiterleitung', 'Sandbox-Umgebung', 'Erweiterte AI-Automatisierung', 'Light Agents (kostenlos)'],
  },
  {
    id: 'enterprise',
    name: 'Suite Enterprise',
    color: 'amber',
    features: ['Alles aus Professional', 'Benutzerdefinierte Rollen & Berechtigungen', 'Mehrere Sandboxes', 'Erweiterte Compliance', 'Enterprise-Support'],
  },
]

const ADDONS = [
  { icon: '🤖', name: 'AI Copilot', desc: 'Automatische Ticket-Zusammenfassungen, Antwortvorschläge, nächste Schritte. Spart ~35% Bearbeitungszeit.' },
  { icon: '🛒', name: 'JTL Integration', desc: 'Direkte Verbindung zu JTL Shop & WAWI. Bestellstatus, Kundendaten und Tracking direkt im Ticket sichtbar.' },
  { icon: '💬', name: 'WhatsApp Business', desc: 'WhatsApp-Nachrichten als Zendesk-Tickets. Kunden erreichen Support über bevorzugten Kanal.' },
  { icon: '🎨', name: 'Branding & Setup', desc: 'Vollständiges Onboarding: Branding, Gruppen, Makros, SLA-Policies, Triggers, Help Center Aufbau.' },
  { icon: '📚', name: 'Help Center', desc: 'Professionelles Wissenszentrum mit Artikeln, Kategorien und KI-gestützter Suche. Reduziert Ticket-Volumen.' },
  { icon: '📊', name: 'Analytics & Reporting', desc: 'Benutzerdefinierte Dashboards, Ticket-Trends, Agenten-Performance, SLA-Compliance-Reports.' },
]

const FAQ_GENERAL = [
  {
    category: 'Onboarding & Vorbereitung',
    items: [
      {
        q: 'Was brauchen wir vom Kunden, um zu starten?',
        a: 'Folgende Informationen werden benötigt: Firmenname und URL, E-Mail-Adresse für den Support (z.B. service@firma.de), Zugangsdaten zum Hoster (für DNS/MX-Einrichtung), Logo und Branding-Farben, Anzahl der Mitarbeiter im Support, aktuelle Supportkanäle (E-Mail, Telefon, Chat, Social Media), Shopsystem-Zugangsdaten (z.B. JTL, Shopify) falls Integration gewünscht.',
      },
      {
        q: 'Wie läuft das Erstgespräch ab?',
        a: 'Im Erstgespräch klären wir: aktuelle Support-Situation und Pain Points, gewünschte Kanäle und Integrationen, Teamgröße und Rollenverteilung, Budget und Zeitrahmen. Daraus erstellen wir ein maßgeschneidertes Angebot mit Phasenplan.',
      },
      {
        q: 'Welche Zugangsdaten werden benötigt?',
        a: 'Wir benötigen: Hoster-Zugang (z.B. All-inkl, IONOS) für DNS-Einrichtung, E-Mail-Server-Daten (SMTP/IMAP oder Weiterleitung), Shopsystem-Admin-Zugang (JTL, Shopify etc.), ggf. Social-Media-Accounts (Facebook, Instagram) für Kanalanbindung.',
      },
      {
        q: 'Wie lange dauert die gesamte Einrichtung?',
        a: 'Eine typische Zendesk-Implementierung dauert 3-5 Wochen — abhängig von Komplexität und Integrationen. Einfache Setups (nur E-Mail) sind in 1-2 Wochen möglich. Komplexe Projekte mit JTL, WhatsApp und mehreren Gruppen benötigen 4-6 Wochen.',
      },
    ],
  },
  {
    category: 'Team & Struktur',
    items: [
      {
        q: 'Wie viele Mitarbeiter/Agenten brauchen wir?',
        a: 'Das hängt vom Ticket-Volumen ab. Als Faustregel: Ein Full-Agent kann ca. 40-60 Tickets pro Tag bearbeiten. Bei 200 Tickets/Tag braucht man ca. 4-5 Agenten. Teamleiter und Admins kommen als Light Agents dazu (kostenlos ab Suite Professional).',
      },
      {
        q: 'Was sind Full Agents vs. Light Agents?',
        a: 'Full Agents haben vollen Zugriff: Tickets bearbeiten, zuweisen, Makros nutzen, Reports einsehen. Light Agents können nur interne Notizen schreiben und Tickets lesen — ideal für Teamleiter, Lager oder Buchhaltung. Light Agents sind ab Suite Professional kostenlos.',
      },
      {
        q: 'Welche Abteilungen/Gruppen sollten angelegt werden?',
        a: 'Typische Gruppen im E-Commerce: Allgemein/First-Level, Retouren & Reklamationen, Versand & Logistik, Buchhaltung (intern). Je nach Sortiment auch produktspezifische Gruppen. Die Gruppen bestimmen das Ticket-Routing und die Zuweisungsregeln.',
      },
      {
        q: 'Wer bekommt welche Rolle (Admin, Agent, Light)?',
        a: 'Admin: Geschäftsführung oder IT-Leiter (Zugriff auf alle Einstellungen). Full Agent: Support-Mitarbeiter im täglichen Kundenkontakt. Light Agent: Teamleiter, Lager, Buchhaltung — wer nur lesen und intern kommentieren muss. Custom Roles ab Enterprise möglich.',
      },
      {
        q: 'Können Mitarbeiter mehreren Gruppen zugeordnet werden?',
        a: 'Ja. Ein Agent kann mehreren Gruppen angehören und erhält Tickets aus allen zugewiesenen Gruppen. Das ist sinnvoll für kleine Teams, wo Mitarbeiter mehrere Bereiche abdecken.',
      },
    ],
  },
  {
    category: 'Workflows & Konfiguration',
    items: [
      {
        q: 'Wie funktioniert das Ticket-Routing?',
        a: 'Tickets werden automatisch der richtigen Gruppe zugewiesen — basierend auf Absender, Betreff, Kanal oder Formularfeld. Skills-basiertes Routing (ab Professional) weist Tickets dem am besten geeigneten Agenten zu, basierend auf Sprache, Produktkenntnisse oder Verfügbarkeit.',
      },
      {
        q: 'Was sind Makros und wofür braucht man sie?',
        a: 'Makros sind vordefinierte Antwortvorlagen mit Platzhaltern (z.B. Kundenname, Bestellnummer). Sie standardisieren Antworten und sparen Zeit. Typische Makros: Bestellstatus-Auskunft, Retouren-Anleitung, Versandverzögerung, Zahlungseingang.',
      },
      {
        q: 'Wie werden SLA-Policies eingerichtet?',
        a: 'SLA-Policies definieren Antwort- und Lösungszeiten pro Priorität. Beispiel: Dringend = erste Antwort in 1h, Lösung in 4h. Normal = erste Antwort in 8h, Lösung in 24h. Zendesk überwacht automatisch und eskaliert bei Verletzung.',
      },
      {
        q: 'Wie funktioniert die E-Mail-Integration?',
        a: 'Die bestehende Support-E-Mail (z.B. service@firma.de) wird per DNS-Weiterleitung oder direkte Anbindung mit Zendesk verbunden. Alle eingehenden E-Mails werden automatisch zu Tickets. Antworten aus Zendesk kommen von der gewohnten E-Mail-Adresse.',
      },
      {
        q: 'Was sind Trigger und Automatisierungen?',
        a: 'Trigger reagieren sofort auf Ticket-Ereignisse (z.B. "Neues Ticket → Bestätigungs-Mail senden"). Automatisierungen laufen zeitbasiert (z.B. "Ticket seit 48h ohne Antwort → Eskalation"). Beide zusammen ermöglichen vollautomatische Workflows.',
      },
    ],
  },
  {
    category: 'Integrationen',
    items: [
      {
        q: 'Welche Shopsysteme werden unterstützt?',
        a: 'Zendesk lässt sich mit allen gängigen Shopsystemen verbinden: JTL Shop & WAWI, Shopify, WooCommerce, Magento, Shopware. Die Integration zeigt Bestelldaten, Kundenverlauf und Tracking direkt im Ticket an.',
      },
      {
        q: 'Wie funktioniert die JTL-Integration?',
        a: 'Über eine App oder API werden JTL Shop und WAWI mit Zendesk verbunden. Agenten sehen im Ticket: Bestellhistorie, Auftragsstatus, Lieferstatus, Kundendaten und Rechnungen — ohne zwischen Systemen wechseln zu müssen.',
      },
      {
        q: 'Kann WhatsApp angebunden werden?',
        a: 'Ja. Über die Zendesk WhatsApp-Integration (Meta Business API) werden WhatsApp-Nachrichten direkt als Tickets behandelt. Agenten antworten aus Zendesk heraus, der Kunde erhält die Antwort auf WhatsApp.',
      },
      {
        q: 'Welche weiteren Kanäle sind möglich?',
        a: 'Neben E-Mail und WhatsApp: Live-Chat (Web Widget), Facebook Messenger, Instagram DM, Twitter/X, Telefonie (Talk), SMS. Alle Kanäle laufen in einer einheitlichen Oberfläche zusammen.',
      },
    ],
  },
  {
    category: 'Schulung & Go-Live',
    items: [
      {
        q: 'Wie lange dauert die Einarbeitung der Mitarbeiter?',
        a: 'Die Grundschulung dauert ca. 2-3 Stunden (Remote). Danach können Agenten sofort arbeiten. Für Admins gibt es eine zusätzliche Schulung (1-2h) zu Einstellungen, Reports und Benutzerverwaltung. Erfahrungsgemäß sind Teams nach 1 Woche produktiv.',
      },
      {
        q: 'Wie läuft die Schulung ab?',
        a: 'Die Schulung erfolgt remote per Videocall: Einführung in die Oberfläche, Ticket-Bearbeitung, Makros nutzen, Ansichten und Filter, interne Zusammenarbeit. Jeder Teilnehmer bekommt Zugang zur Dokumentation und ein Handbuch mit Screenshots.',
      },
      {
        q: 'Gibt es Nachbetreuung nach Go-Live?',
        a: 'Ja, standardmäßig 30 Tage Nachbetreuung inklusive: Support bei Fragen, Feinabstimmung von Triggers und Makros, Performance-Review nach 2 Wochen, Anpassungen an Workflows basierend auf realen Daten.',
      },
      {
        q: 'Was passiert am Go-Live-Tag?',
        a: 'Am Go-Live wird die E-Mail-Weiterleitung aktiviert, sodass alle eingehenden Anfragen in Zendesk landen. Wir begleiten den ersten Tag aktiv, überwachen die Zustellung und helfen bei spontanen Fragen. Ein Rollback-Plan steht immer bereit.',
      },
      {
        q: 'Können wir Zendesk vorher testen?',
        a: 'Ja. Zendesk bietet eine 14-tägige kostenlose Testphase. Außerdem gibt es ab Suite Professional eine Sandbox-Umgebung zum gefahrlosen Testen von Änderungen, bevor sie live gehen.',
      },
    ],
  },
]

const PROCESS = [
  { step: '01', title: 'Erstgespräch & Analyse', desc: 'Anforderungen aufnehmen, Paket zusammenstellen, Zeitplan definieren.' },
  { step: '02', title: 'Zendesk Setup', desc: 'Account erstellen, Branding, Gruppen, Agenten, E-Mail und DNS konfigurieren.' },
  { step: '03', title: 'Integrationen', desc: 'JTL, WhatsApp oder andere Systeme anbinden und testen.' },
  { step: '04', title: 'Automationen & Makros', desc: 'Trigger, SLA-Policies, Antwortvorlagen und Routing einrichten.' },
  { step: '05', title: 'Schulung & Go-Live', desc: 'Remote-Schulung für das Team, Dokumentation und 30 Tage Nachbetreuung.' },
]

function FaqSection() {
  const [open, setOpen] = useState({})
  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
        Häufige Fragen (FAQ)
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {FAQ_GENERAL.map((cat) => (
          <Card key={cat.category} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--green)', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em' }}>
              {cat.category}
            </div>
            {cat.items.map((item, i) => {
              const key = `${cat.category}-${i}`
              const isOpen = !!open[key]
              return (
                <div key={key} style={{ borderBottom: i < cat.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div
                    onClick={() => toggle(key)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 18px', cursor: 'pointer', transition: 'background .15s', background: isOpen ? 'rgba(63,207,142,.03)' : 'transparent' }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500, color: isOpen ? 'var(--white)' : 'var(--white-d)' }}>{item.q}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', flexShrink: 0, transition: 'transform .2s', transform: isOpen ? 'rotate(45deg)' : 'none' }}>+</span>
                  </div>
                  {isOpen && (
                    <div style={{ padding: '0 18px 14px', fontSize: 13, color: 'var(--muted-l)', lineHeight: 1.65 }}>
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </Card>
        ))}
      </div>
    </div>
  )
}

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
          Zendesk Suite Pläne
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
              <div style={{ fontSize: 12, color: 'var(--muted-l)', lineHeight: 1.55 }}>{addon.desc}</div>
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

      {/* FAQ */}
      <FaqSection />

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
