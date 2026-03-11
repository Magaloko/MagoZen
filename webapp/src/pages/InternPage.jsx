import { UPSELLS } from '../data/hfkData'
import { useLanguage } from '../context/LanguageContext'
import Card from '../components/ui/Card'

const honorarRows = [
  { label: 'Phase 1–2: Setup + DNS', sub: '~8h: Zendesk Account, Branding, Gruppen, Agenten, E-Mail, DNS All-inkl', val: '€640' },
  { label: 'Phase 3: JTL Integration', sub: '~10h: API-User, REST API, Marketplace App, Datenmapping, Webhook, Tests', val: '€800' },
  { label: 'Phase 4: Automationen + Makros', sub: '~8h: Trigger, SLA-Policies, 6 Makros, Routing, CSAT, Views', val: '€640' },
  { label: 'Phase 5: Copilot + Help Center', sub: '~6h: Copilot Aktivierung, 10 Artikel schreiben, 6 Kategorien, Testen', val: '€480' },
  { label: 'Schulung + Doku + 30 Tage', sub: '~4h: Remote-Schulung 90 Min., Kurzanleitung PDF, Nachbetreuung', val: '€320' },
]

const laufendRows = [
  { label: 'Zendesk Suite Team — 4 Lizenzen (optimiert)', sub: '4 × €55 · Light Agents für GF/Lager kostenlos · Jahresabrechnung ~20% günstiger', val: '€220/Mo.' },
  { label: 'Zendesk Suite Team — 6 Lizenzen (falls gewünscht)', sub: '6 × €55 · Nicht empfohlen wenn Light Agents möglich', val: '€330/Mo.' },
  { label: 'AI Copilot Add-on (optional, später)', sub: '~€50/Agent/Mo. · Erst nach Help Center Aufbau sinnvoll', val: '~€200–300/Mo.' },
  { label: 'WhatsApp Business (wenn aktiviert)', sub: 'Meta-Gebühren · Gesprächsbasiert · Gering bei normalem Volumen', val: 'variabel' },
]

export default function InternPage() {
  const { t } = useLanguage()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 6, fontSize: 12, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>
        {t('intern.confidential')}
      </div>

      {/* Fee */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: 14 }}>{t('intern.fee.title')}</span>
          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{t('intern.fee.note')}</span>
        </div>
        {honorarRows.map((r) => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 20px', borderBottom: '1px solid var(--border)', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: 'var(--white-d)' }}>{r.label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted-l)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{r.sub}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--green)', fontWeight: 500, flexShrink: 0 }}>{r.val}</div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: 'rgba(63,207,142,.06)', borderTop: '2px solid var(--green-b)', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{t('intern.fee.total')}</div>
            <div style={{ fontSize: 12, color: 'var(--muted-l)', marginTop: 2 }}>{t('intern.fee.sub')}</div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, color: 'var(--green)', fontWeight: 600 }}>€2.880</div>
        </div>
      </Card>

      {/* Revenue Model */}
      <Card style={{ background: 'var(--ink-m)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
          {t('intern.revenue.title')}
        </div>
        <div style={{ fontSize: 13, color: 'var(--white-d)', lineHeight: 1.7, marginBottom: 14, whiteSpace: 'pre-line' }}>
          {t('intern.revenue.text').split('\n').map((line, i) => (
            <span key={i}>{i === 0 ? <strong>{line}</strong> : line}{i === 0 ? <br /> : null}</span>
          ))}
        </div>
        {[
          [t('intern.revenue.col1'), t('intern.revenue.col2'), t('intern.revenue.col3')],
          ['€3.600', '€720', '20% Aufschlag'],
          ['€4.200', '€1.320', '~33% Aufschlag'],
          ['€4.800', '€1.920', '~40% Aufschlag'],
          ['€6.000', '€3.120', '~52% Aufschlag'],
        ].map(([a, b, c], i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '8px 10px', background: i === 0 ? 'var(--border)' : i % 2 === 1 ? 'rgba(255,255,255,.02)' : 'transparent', borderRadius: i === 0 ? '4px 4px 0 0' : 0, fontSize: i === 0 ? 11 : 13, color: i === 0 ? 'var(--muted-l)' : 'var(--white-d)', textTransform: i === 0 ? 'uppercase' : 'none', letterSpacing: i === 0 ? '.07em' : 0, borderBottom: i > 0 && i < 4 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontFamily: i > 0 ? 'var(--font-mono)' : undefined, color: i > 0 ? 'var(--white)' : undefined }}>{a}</span>
            <span style={{ fontFamily: i > 0 ? 'var(--font-mono)' : undefined, color: i > 0 ? 'var(--green)' : undefined }}>{b}</span>
            <span style={{ fontSize: i > 0 ? 12 : 11, color: 'var(--muted-l)' }}>{c}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--amber-d)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 6, fontSize: 12, color: 'var(--amber)' }}>
          {t('intern.revenue.note')}
        </div>
      </Card>

      {/* Ongoing Costs */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: 14 }}>{t('intern.costs.title')}</span>
          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{t('intern.costs.note')}</span>
        </div>
        {laufendRows.map((r) => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 20px', borderBottom: '1px solid var(--border)', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: 'var(--white-d)' }}>{r.label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted-l)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{r.sub}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--green)', fontWeight: 500, flexShrink: 0 }}>{r.val}</div>
          </div>
        ))}
      </Card>

      {/* Upselling */}
      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
          {t('intern.upsell.title')}
        </div>
        <div className="grid-auto-fill" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {UPSELLS.map((u) => (
            <div key={u.title} style={{ padding: 14, background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 6 }}>
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
