import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UPSELLS, PHASES } from '../data/hfkData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useLanguage } from '../context/LanguageContext'
import Card from '../components/ui/Card'

const PHASES_DEFAULT = Object.fromEntries(PHASES.map((p) => [p.id, p.honorar]))

const PLANS = [
  { id: 'team', label: 'Suite Team', price: 55 },
  { id: 'growth', label: 'Suite Growth', price: 89 },
  { id: 'professional', label: 'Suite Professional', price: 115 },
  { id: 'enterprise', label: 'Suite Enterprise', price: 169 },
]

const HONORAR_ROWS_DEF = [
  { label: 'Phase 1–2: Setup + DNS', sub: '~8h: Zendesk Account, Branding, Gruppen, Agenten, E-Mail, DNS All-inkl', phases: ['phase1', 'phase2'] },
  { label: 'Phase 3: JTL Integration', sub: '~10h: API-User, REST API, Marketplace App, Datenmapping, Webhook, Tests', phases: ['phase3'] },
  { label: 'Phase 4: Automationen + Makros', sub: '~8h: Trigger, SLA-Policies, 6 Makros, Routing, CSAT, Views', phases: ['phase4'] },
  { label: 'Phase 5: Copilot + Help Center', sub: '~6h: Copilot Aktivierung, 10 Artikel schreiben, 6 Kategorien, Testen', phases: ['phase5'] },
  { label: 'Schulung + Doku + 30 Tage', sub: '~4h: Remote-Schulung 90 Min., Kurzanleitung PDF, Nachbetreuung', phases: ['phase6'] },
]

const laufendRows = [
  { label: 'Zendesk Suite Professional — 6 Lizenzen', sub: '6 × €115 · Vollzugriff für alle Agenten · Jahresabrechnung ~20% günstiger', val: '€690/Mo.' },
  { label: 'Zendesk Suite Professional — 4 Full + 2 Light', sub: '4 × €115 · Light Agents für GF/Lager kostenlos · Spart €230/Mo.', val: '€460/Mo.' },
  { label: 'AI Copilot Add-on (optional, später)', sub: '~€50/Agent/Mo. · Erst nach Help Center Aufbau sinnvoll', val: '~€200–300/Mo.' },
  { label: 'WhatsApp Business (wenn aktiviert)', sub: 'Meta-Gebühren · Gesprächsbasiert · Gering bei normalem Volumen', val: 'variabel' },
]

function NumInput({ value, onChange, min = 0, max = 10 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
      <button onClick={() => onChange(Math.max(min, value - 1))} style={{ width: 32, height: 32, background: 'var(--ink-m)', border: 'none', fontSize: 16, color: 'var(--muted-l)', cursor: 'pointer' }}>−</button>
      <div style={{ width: 40, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--white)' }}>{value}</div>
      <button onClick={() => onChange(Math.min(max, value + 1))} style={{ width: 32, height: 32, background: 'var(--ink-m)', border: 'none', fontSize: 16, color: 'var(--muted-l)', cursor: 'pointer' }}>+</button>
    </div>
  )
}

function LizenzRechner() {
  const [planId, setPlanId] = useState('professional')
  const [fullAgents, setFullAgents] = useState(6)
  const [lightAgents, setLightAgents] = useState(0)
  const [showCompare, setShowCompare] = useState(false)

  const plan = PLANS.find((p) => p.id === planId)
  const monthly = fullAgents * plan.price
  const yearly = monthly * 12
  const yearlyDiscount = Math.round(yearly * 0.8)
  const totalAgents = fullAgents + lightAgents
  const allFullMonthly = totalAgents * plan.price
  const savings = allFullMonthly - monthly
  const savingsYear = savings * 12

  return (
    <Card>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
        Lizenz-Rechner
      </div>

      {/* Plan selection */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--muted-l)', marginBottom: 8, fontWeight: 600 }}>Zendesk Plan</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {PLANS.map((p) => (
            <button key={p.id} onClick={() => setPlanId(p.id)} style={{
              padding: '6px 14px', borderRadius: 20, border: '1px solid',
              fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600, cursor: 'pointer',
              background: planId === p.id ? 'var(--green)' : 'transparent',
              color: planId === p.id ? '#fff' : 'var(--muted-l)',
              borderColor: planId === p.id ? 'transparent' : 'var(--border)',
              minHeight: 34,
            }}>
              {p.label} · €{p.price}
            </button>
          ))}
        </div>
      </div>

      {/* Agent inputs */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--muted-l)', marginBottom: 6, fontWeight: 600 }}>Full Agents</div>
          <NumInput value={fullAgents} onChange={setFullAgents} min={1} max={20} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--muted-l)', marginBottom: 6, fontWeight: 600 }}>Light Agents</div>
          <NumInput value={lightAgents} onChange={setLightAgents} min={0} max={20} />
        </div>
      </div>

      {/* Results */}
      <div className="grid-auto-fill" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Monatlich', value: `€${monthly.toLocaleString('de-DE')}`, color: 'var(--green)' },
          { label: 'Jährlich', value: `€${yearly.toLocaleString('de-DE')}`, color: 'var(--white)' },
          { label: 'Jahresabo (~20%)', value: `€${yearlyDiscount.toLocaleString('de-DE')}`, color: 'var(--blue)' },
          ...(lightAgents > 0 ? [{ label: 'Ersparnis/Jahr', value: `€${savingsYear.toLocaleString('de-DE')}`, color: 'var(--amber)' }] : []),
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '12px 14px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {lightAgents > 0 && (
        <div style={{ padding: '10px 14px', background: 'var(--amber-d)', border: '1px solid rgba(217,119,6,.2)', borderRadius: 6, fontSize: 12, color: 'var(--amber)', marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
          {lightAgents} Light statt Full = −€{savings.toLocaleString('de-DE')}/Mo. (−€{savingsYear.toLocaleString('de-DE')}/Jahr)
        </div>
      )}

      {/* Light Agent comparison */}
      <button onClick={() => setShowCompare(!showCompare)} style={{
        background: 'transparent', border: '1px solid var(--border)', borderRadius: 6,
        padding: '8px 14px', fontSize: 12, color: 'var(--muted-l)', cursor: 'pointer',
        fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 10, transform: showCompare ? 'rotate(90deg)' : 'none', transition: 'transform .15s', display: 'inline-block' }}>▶</span>
        Full Agent vs. Light Agent — Vergleich
      </button>

      {showCompare && (
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ padding: 14, background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 6 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', fontWeight: 700, marginBottom: 8 }}>FULL AGENT</div>
            {['Tickets beantworten & bearbeiten', 'Als Bearbeiter zugewiesen werden', 'Ticket-Felder ändern', 'Berichte & Dashboards erstellen', 'Alle Kanäle verwalten', 'Makros & Automatisierungen nutzen'].map((t) => (
              <div key={t} style={{ fontSize: 12, color: 'var(--white-d)', padding: '3px 0', display: 'flex', gap: 6 }}>
                <span style={{ color: 'var(--green)' }}>✓</span> {t}
              </div>
            ))}
          </div>
          <div style={{ padding: 14, background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 6 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-l)', fontWeight: 700, marginBottom: 8 }}>LIGHT AGENT</div>
            {[
              { text: 'Tickets ansehen', ok: true },
              { text: 'Interne Notizen schreiben', ok: true },
              { text: 'Tickets eskalieren', ok: true },
              { text: 'Kunden direkt antworten', ok: false },
              { text: 'Als Bearbeiter zugewiesen werden', ok: false },
              { text: 'Ticket-Felder bearbeiten', ok: false },
            ].map(({ text, ok }) => (
              <div key={text} style={{ fontSize: 12, color: ok ? 'var(--white-d)' : 'var(--muted)', padding: '3px 0', display: 'flex', gap: 6 }}>
                <span style={{ color: ok ? 'var(--green)' : 'var(--red)' }}>{ok ? '✓' : '✗'}</span> {text}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export default function InternPage() {
  const { t } = useLanguage()
  const [angebotData] = useLocalStorage('hfk-angebot', null)

  const phasePrices = angebotData?.phases
    ? { ...PHASES_DEFAULT, ...angebotData.phases }
    : PHASES_DEFAULT

  const extraTotal = angebotData?.extras
    ? angebotData.extras.reduce((a, e) => a + (Number(e.price) || 0), 0)
    : 0

  const honorarRows = HONORAR_ROWS_DEF.map((row) => {
    const total = row.phases.reduce((a, id) => a + (Number(phasePrices[id]) || 0), 0)
    const defaultTotal = row.phases.reduce((a, id) => a + (PHASES_DEFAULT[id] || 0), 0)
    const isCustom = angebotData && total !== defaultTotal
    return { ...row, val: `€${total.toLocaleString('de')}`, isCustom }
  })

  const honorarTotal = honorarRows.reduce((a, r) => {
    return a + r.phases.reduce((s, id) => s + (Number(phasePrices[id]) || 0), 0)
  }, 0) + extraTotal

  const angebotAktiv = !!angebotData

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 6, fontSize: 12, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>
        {t('intern.confidential')}
      </div>

      {/* Fee */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: 14 }}>{t('intern.fee.title')}</span>
            {angebotAktiv && (
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'var(--green-d)', color: 'var(--green)', border: '1px solid var(--green-b)', borderRadius: 4, padding: '2px 8px', fontWeight: 700 }}>
                ✓ ANGEBOT AKTIV
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{t('intern.fee.note')}</span>
            <Link to="/angebot" style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--green)', textDecoration: 'none', border: '1px solid var(--green-b)', borderRadius: 4, padding: '3px 10px', background: 'var(--green-d)', whiteSpace: 'nowrap' }}>
              Angebot bearbeiten →
            </Link>
          </div>
        </div>
        {honorarRows.map((r) => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 20px', borderBottom: '1px solid var(--border)', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: 'var(--white-d)' }}>{r.label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted-l)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{r.sub}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              {r.isCustom && <span style={{ fontSize: 10, color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>✎</span>}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: r.isCustom ? 'var(--amber)' : 'var(--green)', fontWeight: 500 }}>{r.val}</div>
            </div>
          </div>
        ))}
        {angebotData?.extras?.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', borderBottom: '1px solid var(--border)', gap: 14 }}>
            <div style={{ fontSize: 13, color: 'var(--muted-l)', fontStyle: 'italic' }}>
              + {angebotData.extras.length} Zusatz-{angebotData.extras.length === 1 ? 'Position' : 'Positionen'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--amber)', fontWeight: 500 }}>€{extraTotal.toLocaleString('de')}</div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: 'rgba(63,207,142,.06)', borderTop: '2px solid var(--green-b)', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{t('intern.fee.total')}</div>
            <div style={{ fontSize: 12, color: 'var(--muted-l)', marginTop: 2 }}>{t('intern.fee.sub')}</div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, color: 'var(--green)', fontWeight: 600 }}>€{honorarTotal.toLocaleString('de')}</div>
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

      {/* Lizenz-Rechner */}
      <LizenzRechner />

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
