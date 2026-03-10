import { PHASES, UPSELLS } from '../data/hfkData'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

const honorarRows = [
  { label: 'Phase 1–2: Setup + DNS', sub: '~8h: Zendesk Account, Branding, Gruppen, Agenten, E-Mail, DNS All-inkl', val: '€640' },
  { label: 'Phase 3: JTL Integration', sub: '~10h: API-User, REST API, Marketplace App, Datenmapping, Webhook, Tests', val: '€800' },
  { label: 'Phase 4: Automationen + Makros', sub: '~8h: Trigger, SLA-Policies, 6 Makros, Routing, CSAT, Views', val: '€640' },
  { label: 'Phase 5: Copilot + Help Center', sub: '~6h: Copilot Aktivierung, 10 Artikel schreiben, 6 Kategorien, Testen', val: '€480' },
  { label: 'Schulung + Doku + 30 Tage', sub: '~4h: Remote-Schulung 90 Min., Kurzanleitung PDF, Nachbetreuung', val: '€320' },
]

const laufendRows = [
  { label: 'Zendesk Suite Growth — 4 Lizenzen (optimiert)', sub: '4 × €89 · Light Agents für GF/Lager kostenlos · Jahresabrechnung ~20% günstiger', val: '€356/Mo.' },
  { label: 'Zendesk Suite Growth — 6 Lizenzen (falls gewünscht)', sub: '6 × €89 · Nicht empfohlen wenn Light Agents möglich', val: '€534/Mo.' },
  { label: 'AI Copilot Add-on (optional, später)', sub: '~€50/Agent/Mo. · Erst nach Help Center Aufbau sinnvoll', val: '~€200–300/Mo.' },
  { label: 'WhatsApp Business (wenn aktiviert)', sub: 'Meta-Gebühren · Gesprächsbasiert · Gering bei normalem Volumen', val: 'variabel' },
]

export default function InternPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ padding: '10px 16px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 6, fontSize: 12, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>
        INTERN · VERTRAULICH — Diese Kalkulation ist nur für Dadakaev Labs und Adnan. Nicht an HFK weitergeben.
      </div>

      {/* Mein Honorar */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: 14 }}>Mein Honorar — Einmalig</span>
          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Adnan sieht das. HFK nicht.</span>
        </div>
        {honorarRows.map((r) => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 22px', borderBottom: '1px solid var(--border)', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, color: 'var(--white-d)' }}>{r.label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted-l)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{r.sub}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--green)', fontWeight: 500, flexShrink: 0 }}>{r.val}</div>
          </div>
        ))}
        {/* Total */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 22px',
            background: 'rgba(63,207,142,.06)',
            borderTop: '2px solid var(--green-b)',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>GESAMT MEIN HONORAR</div>
            <div style={{ fontSize: 12, color: 'var(--muted-l)', marginTop: 2 }}>~36h × €80/h netto · 50% Anzahlung vor Start</div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, color: 'var(--green)', fontWeight: 600 }}>€2.880</div>
        </div>
      </Card>

      {/* Revenue Model */}
      <Card style={{ background: 'var(--ink-m)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          Revenue-Modell (Adnan's Provision)
        </div>
        <div style={{ fontSize: 13, color: 'var(--white-d)', lineHeight: 1.7, marginBottom: 14 }}>
          <strong>Ich brauche immer: €2.880 netto.</strong><br />
          Alles was Adnan HFK mehr berechnet, gehört Adnan.
        </div>
        {[
          ['HFK Rechnung', 'Adnans Anteil', 'Notiz'],
          ['€3.600', '€720', '20% Aufschlag'],
          ['€4.200', '€1.320', '~33% Aufschlag'],
          ['€4.800', '€1.920', '~40% Aufschlag'],
          ['€6.000', '€3.120', '~52% Aufschlag'],
        ].map(([a, b, c], i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              padding: '8px 12px',
              background: i === 0 ? 'var(--border)' : i % 2 === 1 ? 'rgba(255,255,255,.02)' : 'transparent',
              borderRadius: i === 0 ? '4px 4px 0 0' : 0,
              fontSize: i === 0 ? 11 : 13,
              color: i === 0 ? 'var(--muted-l)' : 'var(--white-d)',
              textTransform: i === 0 ? 'uppercase' : 'none',
              letterSpacing: i === 0 ? '.07em' : 0,
              borderBottom: i > 0 && i < 4 ? '1px solid var(--border)' : 'none',
            }}
          >
            <span style={{ fontFamily: i > 0 ? 'var(--font-mono)' : undefined, color: i > 0 ? 'var(--white)' : undefined }}>{a}</span>
            <span style={{ fontFamily: i > 0 ? 'var(--font-mono)' : undefined, color: i > 0 ? 'var(--green)' : undefined }}>{b}</span>
            <span style={{ fontSize: i > 0 ? 12 : 11, color: 'var(--muted-l)' }}>{c}</span>
          </div>
        ))}
        <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--amber-d)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 6, fontSize: 12, color: 'var(--amber)' }}>
          <strong>50% Anzahlung</strong> vor Projektstart · Rest nach Go-Live · Adnan koordiniert Zahlungsfluss mit HFK
        </div>
      </Card>

      {/* Laufende Kosten */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: 14 }}>Laufende Kosten für HFK (zahlen direkt)</span>
          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Unabhängig von unserem Honorar</span>
        </div>
        {laufendRows.map((r) => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 22px', borderBottom: '1px solid var(--border)', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, color: 'var(--white-d)' }}>{r.label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted-l)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{r.sub}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--green)', fontWeight: 500, flexShrink: 0 }}>{r.val}</div>
          </div>
        ))}
      </Card>

      {/* Upselling */}
      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          Upselling nach Go-Live (Adnan's Potenzial)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {UPSELLS.map((u) => (
            <div key={u.title} style={{ padding: '16px', background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 6 }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{u.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{u.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted-l)', lineHeight: 1.5, marginBottom: 8 }}>{u.description}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)' }}>{u.preis}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
