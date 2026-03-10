import { CUSTOMER, GRUPPEN, LIZENZEN, COPILOT_SETTINGS } from '../data/hfkData'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

function Row({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13, alignItems: 'flex-start' }}>
      <span style={{ color: 'var(--muted-l)', minWidth: 160, flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: mono ? 'var(--font-mono)' : undefined, fontSize: mono ? 12 : 13, color: mono ? 'var(--green)' : 'var(--white-d)', wordBreak: 'break-all' }}>
        {value}
      </span>
    </div>
  )
}

export default function CustomerPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Bestätigte Kundendaten */}
      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          Bestätigte Kundendaten
        </div>
        <Row label="Kundenname" value={CUSTOMER.name} />
        <Row label="Kürzel" value={CUSTOMER.short} mono />
        <Row label="Shop-URL" value={CUSTOMER.url} mono />
        <Row label="Support-E-Mail" value={CUSTOMER.email} mono />
        <Row label="Hoster / DNS" value={CUSTOMER.hoster} />
        <Row label="Zendesk Subdomain" value={CUSTOMER.zendeskSubdomain} mono />
        <Row label="JTL Shop Version" value={CUSTOMER.jtlShop} mono />
        <Row label="JTL WAWI Version" value={CUSTOMER.jtlWawi} mono />
        <Row label="Support-Agenten" value="6 Agenten (4 Full + 2 Light)" />
        <Row label="Tägliches Volumen" value={CUSTOMER.volumen} />
        <Row label="Markt" value={CUSTOMER.markt} />
        <Row label="Zeitzone" value={CUSTOMER.timezone} mono />
        <Row label="Sortiment" value={CUSTOMER.sortiment} />
        <Row label="Aktuelle Kanäle" value={CUSTOMER.aktuelleKanäle} />
      </Card>

      {/* HFK Branding */}
      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          HFK Branding Farben
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {Object.entries(CUSTOMER.branding).map(([name, hex]) => (
            <div
              key={name}
              onClick={() => navigator.clipboard.writeText(hex)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                padding: 10,
                borderRadius: 8,
                border: '1px solid var(--border)',
              }}
              title={`Klicken zum Kopieren: ${hex}`}
            >
              <div style={{ width: 48, height: 48, borderRadius: 6, background: hex, border: '1px solid rgba(255,255,255,.1)' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted-l)' }}>{hex}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>{name}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Gruppen */}
      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          4 Routing-Gruppen
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {GRUPPEN.map((g) => (
            <div
              key={g.name}
              style={{
                padding: '14px 16px',
                background: 'var(--ink)',
                border: `1px solid ${g.inactive ? 'rgba(245,158,11,.2)' : 'var(--border)'}`,
                borderRadius: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{g.name}</span>
                {g.inactive && <Badge color="amber">Inaktiv</Badge>}
              </div>
              {g.agents.length > 0 && (
                <div style={{ fontSize: 11, color: 'var(--muted-l)' }}>{g.agents.join(', ')}</div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Lizenzen */}
      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          Lizenz-Optimierung (€356/Mo. statt €534/Mo.)
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Rolle', 'Lizenztyp', 'Kosten/Mo.', 'Hinweis'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', background: 'var(--border)', color: 'var(--muted-l)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LIZENZEN.map((l, i) => (
                <tr key={l.rolle} style={{ background: i % 2 === 1 ? 'rgba(255,255,255,.02)' : 'transparent' }}>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>{l.rolle}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)' }}>{l.typ}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>{l.kosten}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted-l)' }}>{l.hinweis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 6, fontSize: 12, color: 'var(--green)' }}>
          Ersparnis: €178/Mo. = <strong>€2.136/Jahr</strong> — als Mehrwert kommunizieren!
        </div>
      </Card>

      {/* Copilot Settings */}
      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          AI Copilot Konfiguration
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {COPILOT_SETTINGS.map((s) => (
            <div key={s.feature} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <Badge color={s.active ? 'green' : 'red'}>{s.value}</Badge>
              <span style={{ fontWeight: 500, fontSize: 13, minWidth: 180 }}>{s.feature}</span>
              <span style={{ fontSize: 12, color: 'var(--muted-l)' }}>{s.reason}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
