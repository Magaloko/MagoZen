import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useProjects } from '../context/ProjectContext'
import { useLanguage } from '../context/LanguageContext'
import { PHASES, RISKS, DNS_RECORDS, MACROS, GOLIVELISTE, FRAGENKATALOG, DEMO_CHECKLIST, DEMO_MILESTONES, FAQ_HFK, UPSELLS, LIZENZEN } from '../data/hfkData'
import {
  PA_PHASES, PA_FLOWS, PA_RISKS, PA_GOLIVELISTE, PA_ENVIRONMENTS,
  PA_CONNECTIONS, PA_FRAGENKATALOG, PA_FAQ, PA_UPSELLS, PA_KPIS,
  PA_DEMO_CHECKLIST, PA_DEMO_MILESTONES,
} from '../data/paData'
import { PA_PLANS, calcCostPA } from '../utils/paUtils'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

// ── Colors ────────────────────────────────────────────────────────────────
const PA_BLUE   = '#0078D4'
const PA_BG     = 'rgba(0,120,212,0.1)'
const PA_BORDER = 'rgba(0,120,212,0.35)'
const AI_COLOR  = '#7C3AED'
const AI_BG     = 'rgba(124,58,237,0.1)'
const AI_BORDER = 'rgba(124,58,237,0.3)'
const JTL_COLOR  = '#B8893A'
const JTL_BG     = 'rgba(184,137,58,0.1)'
const JTL_BORDER = 'rgba(184,137,58,0.3)'

// ── Constants ─────────────────────────────────────────────────────────────
const ZENDESK_PLANS = [
  { id: 'team',         name: 'Suite Team',         price: 55 },
  { id: 'growth',       name: 'Suite Growth',        price: 89 },
  { id: 'professional', name: 'Suite Professional',  price: 115 },
  { id: 'enterprise',   name: 'Suite Enterprise',    price: 169 },
]

const ADDON_OPTIONS = [
  { id: 'copilot',  label: 'AI Copilot',         desc: '~€50/Agent/Mo. · Automatische Zusammenfassungen & Antwortvorschläge' },
  { id: 'jtl',      label: 'JTL Integration',     desc: 'JTL Shop & WAWI · Bestelldaten direkt im Ticket' },
  { id: 'whatsapp', label: 'WhatsApp Business',   desc: 'Meta-Gebühren · Kunden über WhatsApp erreichen' },
  { id: 'livechat', label: 'Live Chat',            desc: 'Echtzeit-Chat-Widget für die Website' },
  { id: 'shopify',  label: 'Shopify Integration', desc: 'Shopify-Bestelldaten im Ticket' },
]

const PA_ADDON_OPTIONS = [
  { id: 'aiBuilder',   label: 'AI Builder',   desc: 'Rechnungs-OCR, Dokumentenklassifizierung, Sentiment-Analyse · €10/User/Mo.' },
  { id: 'rpaAttended', label: 'RPA Attended', desc: 'Desktop-Flow-Ausführung mit Nutzer-Anmeldung · €15/User/Mo.' },
  { id: 'hostedRpa',   label: 'Hosted RPA',   desc: 'Azure-VM für unattended RPA · €100 flat/Mo.' },
]

const ZD_STEPS = ['wizard.step.customer', 'wizard.step.plan', 'wizard.step.addons', 'wizard.step.phases', 'wizard.step.summary']

const SERVICE_OPTIONS = [
  { id: 'zendesk',      label: 'Zendesk Suite',     desc: 'Customer Support & Ticketing Platform',  color: 'var(--green)', colorD: 'var(--green-d)', colorB: 'var(--green-b)', icon: '🎯' },
  { id: 'powerAutomate',label: 'Power Automate',     desc: 'Microsoft Automatisierungsplattform',    color: PA_BLUE,         colorD: PA_BG,            colorB: PA_BORDER,        icon: '⚡' },
  { id: 'aiAgent',      label: 'AI Agent / Copilot', desc: 'KI-gestützter Kundenservice & Analyse',  color: AI_COLOR,        colorD: AI_BG,            colorB: AI_BORDER,        icon: '🤖' },
  { id: 'jtl',          label: 'JTL Integration',    desc: 'Shop & WAWI Anbindung (Shop 5 / WAWI 2)',color: JTL_COLOR,       colorD: JTL_BG,           colorB: JTL_BORDER,       icon: '📦' },
]

const SERVICE_TAGS = {
  zendesk:      { label: 'Zendesk',  color: 'var(--green)', colorD: 'var(--green-d)', colorB: 'var(--green-b)' },
  powerAutomate:{ label: 'PA',       color: PA_BLUE,         colorD: PA_BG,            colorB: PA_BORDER        },
  aiAgent:      { label: 'AI Agent', color: AI_COLOR,        colorD: AI_BG,            colorB: AI_BORDER        },
  jtl:          { label: 'JTL',      color: JTL_COLOR,       colorD: JTL_BG,           colorB: JTL_BORDER       },
}

const DEFAULT_MULTI_STAGES = [
  {
    id: 1, name: 'Zendesk Light Einführung',
    desc: 'Grundkonfiguration ohne JTL-API. Ticketsystem einrichten, E-Mail-Adressen integrieren, erste Workflows und Makros anlegen.',
    duration_weeks: 4, services: ['zendesk'],
  },
  {
    id: 2, name: 'Setup, Schulung & Go-Live',
    desc: 'Team-Schulung für alle Agenten. Integration der E-Mail-Adressen, Start des laufenden Betriebs. Feedback-Runde und erste Optimierungen.',
    duration_weeks: 3, services: ['zendesk'],
  },
  {
    id: 3, name: 'AI Agent Aufbau',
    desc: 'Unternehmens-Agent trainieren: Firmenwissen, Ordnerstruktur, Sortiment. Automatische E-Mail-Antworten, Lieferanten/Mitbewerber-Crawling, Reportings automatisieren.',
    duration_weeks: 5, services: ['zendesk', 'aiAgent'],
  },
  {
    id: 4, name: 'JTL Integration & Vollbetrieb',
    desc: 'JTL Shop & WAWI API-Anbindung. Bestelldaten direkt im Zendesk-Ticket. Agent kennt Bestellstatus, Lieferstatus und Retouren. Vollintegration AI Agent + Zendesk + JTL.',
    duration_weeks: 4, services: ['zendesk', 'aiAgent', 'jtl'],
  },
]

const defaultPhases   = PHASES.map((p) => ({ ...p }))
const defaultPAPhases = PA_PHASES.map((p) => ({ ...p }))

// ── Helpers ───────────────────────────────────────────────────────────────
function totalWeeks(stages) { return stages.reduce((s, st) => s + (st.duration_weeks || 0), 0) }

// ── Type Selector (entry screen) ──────────────────────────────────────────
function TypeSelector({ onSelect }) {
  const PROJECT_TYPES = [
    {
      id: 'zendesk', icon: '🎯', name: 'Zendesk Suite',
      desc: 'Einzelnes Customer-Support-Projekt mit Zendesk-Plänen, Add-ons und Standard-Phasen.',
      color: 'var(--green)', colorD: 'var(--green-d)', colorB: 'var(--green-b)',
    },
    {
      id: 'power-automate', icon: '⚡', name: 'Power Automate',
      desc: 'Microsoft-Automatisierungsprojekt mit Cloud-Flows, Konnektoren und Umgebungsplanung.',
      color: PA_BLUE, colorD: PA_BG, colorB: PA_BORDER,
    },
    {
      id: 'multi', icon: '◈', name: 'Multi-Service Projekt',
      desc: 'Kombiniertes Projekt mit mehreren Diensten — Zendesk, Power Automate, AI Agent, JTL — plus individuellem Stufenplan über 3–4 Monate.',
      color: AI_COLOR, colorD: AI_BG, colorB: AI_BORDER, badge: 'Empfohlen',
    },
  ]
  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>
          NEUES PROJEKT ANLEGEN
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--white)', margin: '0 0 8px' }}>
          Projekttyp wählen
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted-l)', margin: 0 }}>
          Welche Art von Projekt möchten Sie einrichten?
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PROJECT_TYPES.map((t) => (
          <div
            key={t.id}
            onClick={() => onSelect(t.id)}
            style={{
              padding: '20px 24px', borderRadius: 10, cursor: 'pointer',
              border: `1px solid ${t.colorB}`, background: t.colorD,
              display: 'flex', alignItems: 'flex-start', gap: 18, transition: 'all .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 4px 20px ${t.colorB}` }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
          >
            <span style={{ fontSize: 28, flexShrink: 0, lineHeight: 1, marginTop: 2 }}>{t.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: t.color }}>{t.name}</span>
                {t.badge && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: t.color, color: '#fff', fontFamily: 'var(--font-mono)' }}>{t.badge}</span>
                )}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted-l)', lineHeight: 1.5 }}>{t.desc}</div>
            </div>
            <span style={{ fontSize: 18, color: t.color, flexShrink: 0, marginTop: 4 }}>→</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Step Indicator ────────────────────────────────────────────────────────
function StepIndicator({ current, steps, color, colorD, colorB }) {
  return (
    <div style={{ display: 'flex', gap: 0, marginBottom: 28, overflowX: 'auto' }}>
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0, flex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginBottom: 6,
                background: done ? color : active ? colorD : 'var(--border)',
                border: active ? `2px solid ${color}` : '2px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 700,
                color: done ? '#fff' : active ? color : 'var(--muted)',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 10, color: active ? color : 'var(--muted)', textAlign: 'center', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                {label}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ height: 2, flex: 1, background: done ? color : 'var(--border)', marginBottom: 22, minWidth: 8 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Step: Customer Data ───────────────────────────────────────────────────
function StepCustomer({ data, onChange, serviceType }) {
  const field = (key, label, placeholder, required) => (
    <div key={key}>
      <label style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 5 }}>
        {label}{required && <span style={{ color: 'var(--red)' }}> *</span>}
      </label>
      <input
        value={data[key] || ''}
        onChange={(e) => onChange({ ...data, [key]: e.target.value })}
        placeholder={placeholder}
        style={{ width: '100%', background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 5, padding: '8px 10px', fontSize: 13, color: 'var(--white)', outline: 'none', boxSizing: 'border-box' }}
      />
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {field('name', 'Firmenname', 'z.B. Muster GmbH', true)}
        {field('short', 'Kürzel', 'z.B. MST', false)}
      </div>
      {field('url', 'Website / Shop-URL', 'z.B. muster-gmbh.de', false)}
      {field('email', 'Support-E-Mail', 'z.B. service@firma.de', false)}
      {serviceType === 'power-automate' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {field('m365Tenant', 'M365 Tenant-URL', 'z.B. firma.onmicrosoft.com', false)}
            {field('m365Plan', 'M365 Lizenzplan', 'z.B. Microsoft 365 Business Standard', false)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 5 }}>Power Platform Region</label>
              <select value={data.powerPlatformRegion || 'Europe'} onChange={(e) => onChange({ ...data, powerPlatformRegion: e.target.value })}
                style={{ width: '100%', background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 5, padding: '8px 10px', fontSize: 13, color: 'var(--white)', outline: 'none' }}>
                <option value="Europe">Europe (EU)</option>
                <option value="Germany">Germany (DE)</option>
                <option value="UnitedStates">United States (US)</option>
              </select>
            </div>
            {field('hoster', 'Hoster / DNS', 'z.B. All-inkl, Strato', false)}
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {field('hoster', 'Hoster / DNS', 'z.B. All-inkl, Strato', false)}
            {field('zendeskSubdomain', 'Zendesk Subdomain', 'z.B. firma.zendesk.com', false)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {field('jtlShop', 'JTL Shop Version', 'z.B. 5.4.2', false)}
            {field('jtlWawi', 'JTL WAWI Version', 'z.B. 1.9.4', false)}
          </div>
        </>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 5 }}>Markt</label>
          <select value={data.markt || 'DE'} onChange={(e) => onChange({ ...data, markt: e.target.value })}
            style={{ width: '100%', background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 5, padding: '8px 10px', fontSize: 13, color: 'var(--white)', outline: 'none' }}>
            <option value="DE">Deutschland</option>
            <option value="AT">Österreich</option>
            <option value="CH">Schweiz</option>
            <option value="DE/AT/CH">DE/AT/CH</option>
          </select>
        </div>
        {field('volumen', serviceType === 'power-automate' ? 'Anzahl Automatisierungen' : 'Tägliches Volumen',
          serviceType === 'power-automate' ? 'z.B. 10–20 Flows geplant' : 'z.B. 40–60 Tickets/Tag', false)}
      </div>
      {serviceType !== 'power-automate' && field('sortiment', 'Sortiment', 'z.B. Mode, Möbel, Spielzeug', false)}
    </div>
  )
}

// ── Step: Plan (ZD / PA) ──────────────────────────────────────────────────
function StepPlan({ data, onChange, serviceType }) {
  if (serviceType === 'power-automate') {
    const selectedPlan = PA_PLANS.find((p) => p.id === (data.paPlanId || 'premium')) || PA_PLANS[1]
    const isProcessPlan = selectedPlan.priceModel === 'process'
    const cost = calcCostPA(selectedPlan.id, data.paUsers || 1, data.paProcesses || 1, { aiBuilder: false, rpaAttended: false, hostedRpa: false })
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>Power Automate Plan</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {PA_PLANS.map((plan) => {
              const active = (data.paPlanId || 'premium') === plan.id
              return (
                <div key={plan.id} onClick={() => onChange({ ...data, paPlanId: plan.id })}
                  style={{ padding: '14px', borderRadius: 'var(--r)', cursor: 'pointer', border: active ? `1px solid ${PA_BORDER}` : '1px solid var(--border)', background: active ? PA_BG : 'var(--ink-m)', transition: 'all .15s', position: 'relative' }}>
                  {plan.highlight && <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', background: PA_BLUE, color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>EMPFOHLEN</div>}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: active ? PA_BLUE : 'var(--white)', marginBottom: 2 }}>{plan.price === 0 ? 'Gratis' : `€${plan.price}`}</div>
                  <div style={{ fontSize: 11, color: active ? PA_BLUE : 'var(--muted-l)', fontWeight: 600, marginBottom: 2 }}>{plan.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{plan.priceModel === 'process' ? 'pro Prozess / Mo.' : 'pro User / Mo.'}</div>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>{isProcessPlan ? 'Anzahl Prozesse / Bots' : 'Anzahl lizenzierter User'}</div>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', width: 'fit-content' }}>
            <button onClick={() => { const k = isProcessPlan ? 'paProcesses' : 'paUsers'; onChange({ ...data, [k]: Math.max(1, (data[k] || 1) - 1) }) }} style={{ width: 36, height: 36, background: 'var(--ink-m)', border: 'none', fontSize: 18, color: 'var(--muted-l)', cursor: 'pointer' }}>−</button>
            <div style={{ width: 52, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--white)' }}>{isProcessPlan ? (data.paProcesses || 1) : (data.paUsers || 1)}</div>
            <button onClick={() => { const k = isProcessPlan ? 'paProcesses' : 'paUsers'; onChange({ ...data, [k]: Math.min(50, (data[k] || 1) + 1) }) }} style={{ width: 36, height: 36, background: 'var(--ink-m)', border: 'none', fontSize: 18, color: 'var(--muted-l)', cursor: 'pointer' }}>+</button>
          </div>
        </div>
        {cost.totalMonthly >= 0 && (
          <div style={{ padding: '14px 16px', background: PA_BG, border: `1px solid ${PA_BORDER}`, borderRadius: 'var(--r)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: PA_BLUE }}>{cost.totalMonthly === 0 ? 'Kostenlos' : `€${cost.totalMonthly.toLocaleString('de')}/Mo.`}</div>
          </div>
        )}
      </div>
    )
  }
  const selectedPlan = ZENDESK_PLANS.find((p) => p.id === data.planId) || ZENDESK_PLANS[2]
  const monthly = (data.agentsFull || 0) * selectedPlan.price
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>Plan auswählen</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {ZENDESK_PLANS.map((plan) => {
            const active = data.planId === plan.id
            return (
              <div key={plan.id} onClick={() => onChange({ ...data, planId: plan.id })}
                style={{ padding: '14px', borderRadius: 'var(--r)', cursor: 'pointer', border: active ? '1px solid var(--green-b)' : '1px solid var(--border)', background: active ? 'var(--green-d)' : 'var(--ink-m)', transition: 'all .15s' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: active ? 'var(--green)' : 'var(--white)', marginBottom: 4 }}>€{plan.price}</div>
                <div style={{ fontSize: 12, color: active ? 'var(--green)' : 'var(--muted-l)', fontWeight: 600 }}>{plan.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>pro Agent / Mo.</div>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[{ key: 'agentsFull', label: 'Full Agents', min: 1 }, { key: 'agentsLight', label: 'Light Agents (kostenlos)', min: 0 }].map(({ key, label, min }) => (
          <div key={key}>
            <label style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 8 }}>{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', width: 'fit-content' }}>
              <button onClick={() => onChange({ ...data, [key]: Math.max(min, (data[key] || 0) - 1) })} style={{ width: 36, height: 36, background: 'var(--ink-m)', border: 'none', fontSize: 18, color: 'var(--muted-l)', cursor: 'pointer' }}>−</button>
              <div style={{ width: 44, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--white)' }}>{data[key] || 0}</div>
              <button onClick={() => onChange({ ...data, [key]: Math.min(20, (data[key] || 0) + 1) })} style={{ width: 36, height: 36, background: 'var(--ink-m)', border: 'none', fontSize: 18, color: 'var(--muted-l)', cursor: 'pointer' }}>+</button>
            </div>
          </div>
        ))}
      </div>
      {monthly > 0 && (
        <div style={{ padding: '14px 16px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 'var(--r)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>€{monthly.toLocaleString('de')}/Mo.</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{data.agentsFull || 0} Full Agents × €{selectedPlan.price}</div>
        </div>
      )}
    </div>
  )
}

// ── Step: Add-ons (ZD / PA) ───────────────────────────────────────────────
function StepAddons({ data, onChange, serviceType }) {
  const options = serviceType === 'power-automate' ? PA_ADDON_OPTIONS : ADDON_OPTIONS
  const isPA = serviceType === 'power-automate'
  const active = (id) => isPA ? !!(data.paAddons || {})[id] : (data.addons || []).includes(id)
  const toggle = (id) => {
    if (isPA) { onChange({ ...data, paAddons: { ...(data.paAddons || {}), [id]: !((data.paAddons || {})[id]) } }) }
    else { const cur = data.addons || []; onChange({ ...data, addons: cur.includes(id) ? cur.filter(a => a !== id) : [...cur, id] }) }
  }
  const col = isPA ? PA_BLUE : 'var(--green)'
  const colD = isPA ? PA_BG : 'var(--green-d)'
  const colB = isPA ? PA_BORDER : 'var(--green-b)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map((addon) => {
        const on = active(addon.id)
        return (
          <div key={addon.id} onClick={() => toggle(addon.id)}
            style={{ padding: '14px 16px', borderRadius: 'var(--r)', cursor: 'pointer', border: on ? `1px solid ${colB}` : '1px solid var(--border)', background: on ? colD : 'var(--ink-m)', display: 'flex', alignItems: 'center', gap: 14, transition: 'all .15s' }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, border: on ? `2px solid ${col}` : '2px solid var(--border-l)', background: on ? col : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}>
              {on && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: on ? col : 'var(--white)', marginBottom: 3 }}>{addon.label}</div>
              <div style={{ fontSize: 12, color: 'var(--muted-l)' }}>{addon.desc}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Step: Phases (ZD / PA) ────────────────────────────────────────────────
function StepPhases({ data, onChange, serviceType }) {
  const phases = data.phases || (serviceType === 'power-automate' ? defaultPAPhases : defaultPhases)
  const totalH = phases.reduce((a, p) => a + (Number(p.hours) || 0), 0)
  const totalEuro = phases.reduce((a, p) => a + (Number(p.honorar) || 0), 0)
  const col = serviceType === 'power-automate' ? PA_BLUE : 'var(--green)'
  const colD = serviceType === 'power-automate' ? PA_BG : 'var(--green-d)'
  const colB = serviceType === 'power-automate' ? PA_BORDER : 'var(--green-b)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Standard-Template. Honorar und Stunden können angepasst werden.</div>
      {phases.map((phase, i) => (
        <div key={phase.id} style={{ padding: '12px 14px', background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)' }}>{phase.title}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{phase.number}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <input type="number" min="1" max="80" value={phase.hours}
              onChange={(e) => { const u = [...phases]; u[i] = { ...phase, hours: Number(e.target.value) || 0 }; onChange({ ...data, phases: u }) }}
              style={{ width: 64, background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 5, padding: '5px 8px', fontSize: 12, color: 'var(--muted-l)', textAlign: 'right', outline: 'none', fontFamily: 'var(--font-mono)' }} />
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>h</span>
            <span style={{ fontSize: 13, color: 'var(--muted-l)' }}>€</span>
            <input type="number" min="0" step="10" value={phase.honorar}
              onChange={(e) => { const u = [...phases]; u[i] = { ...phase, honorar: Number(e.target.value) || 0 }; onChange({ ...data, phases: u }) }}
              style={{ width: 84, background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 5, padding: '5px 8px', fontSize: 13, color: col, textAlign: 'right', outline: 'none', fontFamily: 'var(--font-mono)', fontWeight: 600 }} />
          </div>
        </div>
      ))}
      <div style={{ padding: '10px 14px', background: colD, border: `1px solid ${colB}`, borderRadius: 'var(--r)', display: 'flex', justifyContent: 'space-between', fontSize: 13, flexWrap: 'wrap', gap: 8 }}>
        <span style={{ color: 'var(--muted-l)', fontFamily: 'var(--font-mono)' }}>Gesamt: {totalH}h</span>
        <span style={{ color: col, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>€{totalEuro.toLocaleString('de')} netto</span>
      </div>
    </div>
  )
}

// ── Step: Summary (ZD / PA) ───────────────────────────────────────────────
function StepSummary({ customer, plan, addons, phases, serviceType }) {
  const isPA = serviceType === 'power-automate'
  const col = isPA ? PA_BLUE : 'var(--green)'
  const colD = isPA ? PA_BG : 'var(--green-d)'
  const colB = isPA ? PA_BORDER : 'var(--green-b)'

  const phasesArr = phases.phases || (isPA ? defaultPAPhases : defaultPhases)
  const totalH = phasesArr.reduce((a, p) => a + (Number(p.hours) || 0), 0)
  const totalEuro = phasesArr.reduce((a, p) => a + (Number(p.honorar) || 0), 0)

  let planRows, addonRows
  if (isPA) {
    const paPlan = PA_PLANS.find((p) => p.id === (plan.paPlanId || 'premium'))
    const paAddons = addons.paAddons || {}
    const cost = calcCostPA(paPlan?.id || 'premium', plan.paUsers || 1, plan.paProcesses || 1, paAddons)
    planRows = [['Plan', paPlan?.name || '—'], ['User/Prozesse', plan.paUsers || 1], ['Kosten/Mo.', cost.totalMonthly === 0 ? 'Kostenlos' : `€${cost.totalMonthly.toLocaleString('de')}`]]
    addonRows = PA_ADDON_OPTIONS.filter(a => paAddons[a.id]).map(a => a.label)
  } else {
    const planInfo = ZENDESK_PLANS.find((p) => p.id === plan.planId)
    const monthly = (plan.agentsFull || 0) * (planInfo?.price || 0)
    planRows = [['Plan', planInfo?.name || '—'], ['Full Agents', plan.agentsFull || 0], ['Light Agents', plan.agentsLight || 0], ['Kosten/Mo.', monthly > 0 ? `€${monthly.toLocaleString('de')}` : '—']]
    addonRows = ADDON_OPTIONS.filter(a => (addons.addons || []).includes(a.id)).map(a => a.label)
  }

  const summaryBlocks = [
    { title: 'Kunde', rows: [['Name', customer.name || '—'], ['URL', customer.url || '—'], ['E-Mail', customer.email || '—'], ['Markt', customer.markt || '—']] },
    { title: isPA ? 'Power Automate Plan' : 'Zendesk Plan', rows: planRows },
    { title: 'Implementierung', rows: [['Phasen', phasesArr.length], ['Stunden', `${totalH}h`], ['Honorar', `€${totalEuro.toLocaleString('de')} netto`]] },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {summaryBlocks.map(({ title, rows }) => (
        <Card key={title} style={{ padding: '14px 16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: col, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>{title}</div>
          {rows.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <span style={{ color: 'var(--muted-l)', minWidth: 130, flexShrink: 0 }}>{k}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: col }}>{String(v)}</span>
            </div>
          ))}
        </Card>
      ))}
      {addonRows.length > 0 && (
        <Card style={{ padding: '14px 16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: col, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>Add-ons</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{addonRows.map(l => <Badge key={l} color={isPA ? 'blue' : 'green'}>{l}</Badge>)}</div>
        </Card>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ── MULTI-SERVICE STEPS ──────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════

// ── Multi Step 2: Dienste & Konfiguration ─────────────────────────────────
function StepMultiServices({ selected, onSelected, zdConfig, onZdConfig, paConfig, onPaConfig }) {
  const toggleService = (id) => onSelected({ ...selected, [id]: !selected[id] })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 13, color: 'var(--muted-l)', marginBottom: 4 }}>
        Welche Dienste sind Teil dieses Projekts? Konfigurieren Sie jeden gewählten Dienst.
      </div>

      {/* Service toggles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
        {SERVICE_OPTIONS.map((svc) => {
          const on = !!selected[svc.id]
          return (
            <div key={svc.id} onClick={() => toggleService(svc.id)}
              style={{ padding: '14px 16px', borderRadius: 8, cursor: 'pointer', border: `1px solid ${on ? svc.colorB : 'var(--border)'}`, background: on ? svc.colorD : 'var(--ink-m)', display: 'flex', alignItems: 'center', gap: 12, transition: 'all .15s' }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, border: on ? `2px solid ${svc.color}` : '2px solid var(--border-l)', background: on ? svc.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {on && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: on ? svc.color : 'var(--white)' }}>{svc.icon} {svc.label}</div>
                <div style={{ fontSize: 11, color: 'var(--muted-l)', marginTop: 2 }}>{svc.desc}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Zendesk config */}
      {selected.zendesk && (
        <div style={{ padding: '16px 18px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 8 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Zendesk Konfiguration</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>Plan</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {ZENDESK_PLANS.map(p => (
                  <button key={p.id} onClick={() => onZdConfig({ ...zdConfig, planId: p.id })}
                    style={{ padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-mono)', border: zdConfig.planId === p.id ? '1px solid var(--green)' : '1px solid var(--border)', background: zdConfig.planId === p.id ? 'var(--green)' : 'var(--ink)', color: zdConfig.planId === p.id ? '#fff' : 'var(--muted-l)' }}>
                    {p.name} (€{p.price})
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[{ key: 'agentsFull', label: 'Full Agents', min: 1 }, { key: 'agentsLight', label: 'Light Agents', min: 0 }].map(({ key, label, min }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>{label}</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', width: 'fit-content' }}>
                    <button onClick={() => onZdConfig({ ...zdConfig, [key]: Math.max(min, (zdConfig[key] || 0) - 1) })} style={{ width: 32, height: 32, background: 'var(--ink-m)', border: 'none', fontSize: 16, color: 'var(--muted-l)', cursor: 'pointer' }}>−</button>
                    <div style={{ width: 40, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: 'var(--white)' }}>{zdConfig[key] || 0}</div>
                    <button onClick={() => onZdConfig({ ...zdConfig, [key]: Math.min(20, (zdConfig[key] || 0) + 1) })} style={{ width: 32, height: 32, background: 'var(--ink-m)', border: 'none', fontSize: 16, color: 'var(--muted-l)', cursor: 'pointer' }}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Power Automate config */}
      {selected.powerAutomate && (
        <div style={{ padding: '16px 18px', background: PA_BG, border: `1px solid ${PA_BORDER}`, borderRadius: 8 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: PA_BLUE, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Power Automate Konfiguration</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PA_PLANS.map(p => (
                <button key={p.id} onClick={() => onPaConfig({ ...paConfig, planId: p.id })}
                  style={{ padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-mono)', border: paConfig.planId === p.id ? `1px solid ${PA_BLUE}` : '1px solid var(--border)', background: paConfig.planId === p.id ? PA_BLUE : 'var(--ink)', color: paConfig.planId === p.id ? '#fff' : 'var(--muted-l)' }}>
                  {p.name} (€{p.price})
                </button>
              ))}
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>Lizenzierte User</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', width: 'fit-content' }}>
                <button onClick={() => onPaConfig({ ...paConfig, users: Math.max(1, (paConfig.users || 1) - 1) })} style={{ width: 32, height: 32, background: 'var(--ink-m)', border: 'none', fontSize: 16, color: 'var(--muted-l)', cursor: 'pointer' }}>−</button>
                <div style={{ width: 40, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: 'var(--white)' }}>{paConfig.users || 1}</div>
                <button onClick={() => onPaConfig({ ...paConfig, users: Math.min(50, (paConfig.users || 1) + 1) })} style={{ width: 32, height: 32, background: 'var(--ink-m)', border: 'none', fontSize: 16, color: 'var(--muted-l)', cursor: 'pointer' }}>+</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Agent info */}
      {selected.aiAgent && (
        <div style={{ padding: '14px 16px', background: AI_BG, border: `1px solid ${AI_BORDER}`, borderRadius: 8 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: AI_COLOR, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>AI Agent / Copilot</div>
          <div style={{ fontSize: 12, color: 'var(--muted-l)', lineHeight: 1.5 }}>
            Der AI Agent wird im Stufenplan konfiguriert. Er wird trainiert auf: Firmenwissen, Produktkatalog, E-Mail-Vorlagen, Lieferanten und Bestellprozesse.
          </div>
        </div>
      )}

      {/* JTL info */}
      {selected.jtl && (
        <div style={{ padding: '14px 16px', background: JTL_BG, border: `1px solid ${JTL_BORDER}`, borderRadius: 8 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: JTL_COLOR, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>JTL Integration</div>
          <div style={{ fontSize: 12, color: 'var(--muted-l)', lineHeight: 1.5 }}>
            JTL Shop & WAWI API-Anbindung. Bestelldaten, Lieferstatus und Retouren werden direkt im Ticket angezeigt und vom AI Agent verwendet.
          </div>
        </div>
      )}
    </div>
  )
}

// ── Multi Step 3: Stufenplan ──────────────────────────────────────────────
function StepStufenplan({ stages, onStages, selectedServices }) {
  const total = totalWeeks(stages)
  const months = (total / 4).toFixed(1).replace('.0', '')
  const activeTags = Object.keys(selectedServices).filter(k => selectedServices[k])

  const updateStage = (id, patch) => onStages(stages.map(s => s.id === id ? { ...s, ...patch } : s))
  const addStage = () => {
    const newId = Math.max(0, ...stages.map(s => s.id)) + 1
    onStages([...stages, { id: newId, name: `Stufe ${newId}`, desc: '', duration_weeks: 2, services: [] }])
  }
  const removeStage = (id) => { if (stages.length > 1) onStages(stages.filter(s => s.id !== id)) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: 13, color: 'var(--muted-l)' }}>
        Definieren Sie die Rollout-Stufen für dieses Projekt. Reihenfolge und Dauer können frei angepasst werden.
      </div>

      {/* Timeline visualization */}
      <div style={{ padding: '16px', background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Zeitplan</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--white-d)', fontWeight: 600 }}>
            {total} Wochen · ca. {months} Monate
          </span>
        </div>
        <div style={{ display: 'flex', gap: 2, height: 32, borderRadius: 6, overflow: 'hidden' }}>
          {stages.map((s, i) => {
            const pct = total > 0 ? (s.duration_weeks / total) * 100 : 100 / stages.length
            const hues = ['var(--green)', PA_BLUE, AI_COLOR, JTL_COLOR, '#E11D48', '#0891B2']
            const color = hues[i % hues.length]
            return (
              <div key={s.id} style={{ flex: pct, background: color, opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 24, position: 'relative', transition: 'flex .3s' }}
                title={`${s.name} · ${s.duration_weeks} Wochen`}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#fff', fontWeight: 700 }}>{i + 1}</span>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', marginTop: 8, gap: 12, flexWrap: 'wrap' }}>
          {stages.map((s, i) => {
            const hues = ['var(--green)', PA_BLUE, AI_COLOR, JTL_COLOR, '#E11D48', '#0891B2']
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted-l)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: hues[i % hues.length], flexShrink: 0 }} />
                <span>{s.name || `Stufe ${s.id}`} ({s.duration_weeks}W)</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stage cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {stages.map((s, i) => (
          <div key={s.id} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            {/* Stage header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--ink-m)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ink)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--muted-l)', flexShrink: 0 }}>
                {i + 1}
              </div>
              <input
                value={s.name}
                onChange={(e) => updateStage(s.id, { name: e.target.value })}
                placeholder="Name der Stufe"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontWeight: 600, color: 'var(--white)', padding: 0 }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)' }}>Wochen:</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 5, overflow: 'hidden' }}>
                  <button onClick={() => updateStage(s.id, { duration_weeks: Math.max(1, s.duration_weeks - 1) })} style={{ width: 26, height: 26, background: 'var(--ink)', border: 'none', fontSize: 14, color: 'var(--muted-l)', cursor: 'pointer' }}>−</button>
                  <span style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--white)' }}>{s.duration_weeks}</span>
                  <button onClick={() => updateStage(s.id, { duration_weeks: Math.min(24, s.duration_weeks + 1) })} style={{ width: 26, height: 26, background: 'var(--ink)', border: 'none', fontSize: 14, color: 'var(--muted-l)', cursor: 'pointer' }}>+</button>
                </div>
                {stages.length > 1 && (
                  <button onClick={() => removeStage(s.id)} style={{ width: 26, height: 26, background: 'transparent', border: '1px solid rgba(239,68,68,.2)', borderRadius: 5, color: 'rgba(239,68,68,.6)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                )}
              </div>
            </div>

            {/* Description */}
            <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
              <textarea
                value={s.desc}
                onChange={(e) => updateStage(s.id, { desc: e.target.value })}
                placeholder="Beschreibung: Was passiert in dieser Stufe?"
                rows={2}
                style={{ width: '100%', background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', fontSize: 12, color: 'var(--muted-l)', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5 }}
              />
            </div>

            {/* Service tags */}
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,.02)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Dienste:</span>
              {(activeTags.length > 0 ? activeTags : Object.keys(SERVICE_TAGS)).map(svcId => {
                const tag = SERVICE_TAGS[svcId]
                if (!tag) return null
                const active = (s.services || []).includes(svcId)
                return (
                  <button key={svcId} onClick={() => {
                    const cur = s.services || []
                    updateStage(s.id, { services: active ? cur.filter(x => x !== svcId) : [...cur, svcId] })
                  }}
                    style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, cursor: 'pointer', fontWeight: active ? 700 : 400, border: `1px solid ${active ? tag.colorB : 'var(--border)'}`, background: active ? tag.colorD : 'transparent', color: active ? tag.color : 'var(--muted)' }}>
                    {tag.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <button onClick={addStage} style={{ padding: '10px 16px', background: 'transparent', border: '1px dashed var(--border)', borderRadius: 8, color: 'var(--muted-l)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', transition: 'all .15s' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--green-b)'; e.currentTarget.style.color = 'var(--green)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted-l)' }}>
        + Stufe hinzufügen
      </button>
    </div>
  )
}

// ── Multi Step 4: Summary ─────────────────────────────────────────────────
function StepMultiSummary({ customer, selectedServices, zdConfig, paConfig, stages }) {
  const total = totalWeeks(stages)
  const months = (total / 4).toFixed(1).replace('.0', '')
  const activeServices = SERVICE_OPTIONS.filter(s => selectedServices[s.id])
  const zdPlan = ZENDESK_PLANS.find(p => p.id === zdConfig.planId) || ZENDESK_PLANS[2]
  const paPlan = PA_PLANS.find(p => p.id === paConfig.planId) || PA_PLANS[1]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Card style={{ padding: '14px 16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: AI_COLOR, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>Kunde</div>
        {[['Name', customer.name || '—'], ['URL', customer.url || '—'], ['E-Mail', customer.email || '—'], ['Markt', customer.markt || '—']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
            <span style={{ color: 'var(--muted-l)', minWidth: 130, flexShrink: 0 }}>{k}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: AI_COLOR }}>{v}</span>
          </div>
        ))}
      </Card>

      <Card style={{ padding: '14px 16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: AI_COLOR, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>Ausgewählte Dienste</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {activeServices.map(s => (
            <span key={s.id} style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.colorD, border: `1px solid ${s.colorB}`, color: s.color }}>{s.icon} {s.label}</span>
          ))}
        </div>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {selectedServices.zendesk && <div style={{ fontSize: 12, color: 'var(--muted-l)' }}>Zendesk: {zdPlan.name} · {zdConfig.agentsFull || 0} Full + {zdConfig.agentsLight || 0} Light Agents</div>}
          {selectedServices.powerAutomate && <div style={{ fontSize: 12, color: 'var(--muted-l)' }}>Power Automate: {paPlan.name} · {paConfig.users || 1} User</div>}
        </div>
      </Card>

      <Card style={{ padding: '14px 16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: AI_COLOR, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>
          Stufenplan — {total} Wochen / {months} Monate
        </div>
        {stages.map((s, i) => (
          <div key={s.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: AI_COLOR, flexShrink: 0, marginTop: 2 }}>Stufe {i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)' }}>{s.name}</div>
              {s.desc && <div style={{ fontSize: 11, color: 'var(--muted-l)', marginTop: 3, lineHeight: 1.4 }}>{s.desc}</div>}
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{s.duration_weeks} Wochen</span>
                {(s.services || []).map(svcId => {
                  const tag = SERVICE_TAGS[svcId]
                  return tag ? <span key={svcId} style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10, background: tag.colorD, border: `1px solid ${tag.colorB}`, color: tag.color, fontWeight: 600 }}>{tag.label}</span> : null
                })}
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ── MAIN WIZARD ───────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════
export default function NewProjectWizard() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { createProject } = useProjects()
  const [searchParams] = useSearchParams()

  const urlType = searchParams.get('type')
  const [wizardType, setWizardType] = useState(
    urlType === 'power-automate' ? 'power-automate' :
    urlType === 'multi'          ? 'multi'           :
    urlType === 'zendesk'        ? 'zendesk'         : null
  )
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // ── Shared state ──
  const [customer, setCustomer] = useState({
    name: '', short: '', url: '', email: '', hoster: '',
    zendeskSubdomain: '', jtlShop: '', jtlWawi: '', m365Tenant: '', m365Plan: 'Microsoft 365 Business Standard',
    powerPlatformRegion: 'Europe', markt: 'DE', volumen: '', sortiment: '',
  })

  // ── ZD / PA state ──
  const [plan, setPlan] = useState({ planId: 'professional', agentsFull: 4, agentsLight: 2, paPlanId: 'premium', paUsers: 3, paProcesses: 1 })
  const [addons, setAddons] = useState({ addons: [], paAddons: {} })
  const [phases, setPhases] = useState({ phases: null })

  // ── Multi state ──
  const [selectedServices, setSelectedServices] = useState({ zendesk: true, powerAutomate: false, aiAgent: false, jtl: false })
  const [zdConfig, setZdConfig] = useState({ planId: 'professional', agentsFull: 4, agentsLight: 2 })
  const [paConfig, setPaConfig] = useState({ planId: 'premium', users: 3 })
  const [stages, setStages] = useState(DEFAULT_MULTI_STAGES.map(s => ({ ...s })))

  // ── Step config per type ──
  const multiSteps = ['Kundendaten', 'Dienste', 'Stufenplan', 'Zusammenfassung']
  const zdSteps    = ZD_STEPS.map(k => t(k))
  const paSteps    = ZD_STEPS.map((k, i) => i === 1 ? 'PA Plan' : t(k))

  const steps      = wizardType === 'multi' ? multiSteps : wizardType === 'power-automate' ? paSteps : zdSteps
  const totalSteps = steps.length

  const colMap = { zendesk: 'var(--green)', 'power-automate': PA_BLUE, multi: AI_COLOR }
  const colDMap = { zendesk: 'var(--green-d)', 'power-automate': PA_BG, multi: AI_BG }
  const colBMap = { zendesk: 'var(--green-b)', 'power-automate': PA_BORDER, multi: AI_BORDER }
  const color  = colMap[wizardType] || AI_COLOR
  const colorD = colDMap[wizardType] || AI_BG
  const colorB = colBMap[wizardType] || AI_BORDER

  const bannerLabels = {
    zendesk:         { icon: '🎯', name: 'Zendesk Suite',          sub: 'Neues Support-Projekt' },
    'power-automate':{ icon: '⚡', name: 'Microsoft Power Automate', sub: 'Neues Automatisierungs-Projekt' },
    multi:           { icon: '◈', name: 'Multi-Service Projekt',   sub: 'Zendesk · PA · AI Agent · JTL' },
  }

  const canNext = step === 0 ? !!customer.name.trim() : true

  // ── Create project ──
  const handleCreate = async () => {
    setSaving(true); setError(null)
    try {
      let projectData

      if (wizardType === 'multi') {
        const zdPlan = ZENDESK_PLANS.find(p => p.id === zdConfig.planId) || ZENDESK_PLANS[2]
        const activeServices = Object.keys(selectedServices).filter(k => selectedServices[k])

        // Convert stages to phases format for compatibility with PhasesPage
        const phasesFromStages = stages.map((s, i) => ({
          id: `stage-${s.id}`,
          number: `Stufe ${String(i + 1).padStart(2, '0')}`,
          title: s.name,
          status: 'pending',
          hours: s.duration_weeks * 8,
          honorar: 0,
          tasks: [],
          description: s.desc,
          duration_weeks: s.duration_weeks,
          services: s.services,
        }))

        projectData = {
          name: customer.name.trim(),
          short_name: customer.short.trim() || customer.name.slice(0, 3).toUpperCase(),
          status: 'planning',
          customer_data: { ...customer, branding: {} },
          service_package: {
            service_type: 'multi',
            services: activeServices,
            stufenplan: stages,
            phases: phasesFromStages,
            // Zendesk config
            plan: selectedServices.zendesk ? zdPlan.name : undefined,
            plan_price_per_agent: selectedServices.zendesk ? zdPlan.price : undefined,
            agents_full: selectedServices.zendesk ? (zdConfig.agentsFull || 0) : 0,
            agents_light: selectedServices.zendesk ? (zdConfig.agentsLight || 0) : 0,
            // PA config
            pa_plan: selectedServices.powerAutomate ? paConfig.planId : undefined,
            pa_users: selectedServices.powerAutomate ? (paConfig.users || 1) : undefined,
            // Common
            risks: RISKS,
            macros: MACROS,
            goliveliste: GOLIVELISTE,
            fragenkatalog: FRAGENKATALOG,
            faq: FAQ_HFK,
            upsells: UPSELLS,
            lizenzen: LIZENZEN,
          },
          settings: { timezone: 'Wien UTC+1/+2', language: 'de', notes: '' },
        }
      } else if (wizardType === 'power-automate') {
        const paPlan = PA_PLANS.find((p) => p.id === (plan.paPlanId || 'premium'))
        const paAddons = addons.paAddons || {}
        projectData = {
          name: customer.name.trim(),
          short_name: customer.short.trim() || customer.name.slice(0, 3).toUpperCase(),
          status: 'planning',
          customer_data: { ...customer, branding: {} },
          service_package: {
            service_type: 'power-automate',
            plan: paPlan?.name || 'Premium (Per User)', plan_id: plan.paPlanId || 'premium',
            plan_price_per_user: paPlan?.priceModel === 'user' ? (paPlan?.price || 15) : 0,
            plan_price_per_process: paPlan?.priceModel === 'process' ? (paPlan?.price || 150) : 0,
            pa_users: plan.paUsers || 1, pa_processes: plan.paProcesses || 1, addons_pa: paAddons,
            phases: phases.phases || defaultPAPhases,
            risks: PA_RISKS, macros: PA_FLOWS, goliveliste: PA_GOLIVELISTE,
            fragenkatalog: PA_FRAGENKATALOG, faq: PA_FAQ, upsells: PA_UPSELLS,
            environments: PA_ENVIRONMENTS, connections: PA_CONNECTIONS, kpis: PA_KPIS,
            demo_checklist: PA_DEMO_CHECKLIST, demo_milestones: PA_DEMO_MILESTONES,
          },
          settings: { timezone: 'Wien UTC+1/+2', language: 'de', notes: '' },
        }
      } else {
        const planInfo = ZENDESK_PLANS.find((p) => p.id === plan.planId)
        projectData = {
          name: customer.name.trim(),
          short_name: customer.short.trim() || customer.name.slice(0, 3).toUpperCase(),
          status: 'planning',
          customer_data: { ...customer, branding: {} },
          service_package: {
            service_type: 'zendesk',
            plan: planInfo?.name || 'Suite Professional', plan_price_per_agent: planInfo?.price || 115,
            agents_full: plan.agentsFull || 0, agents_light: plan.agentsLight || 0,
            addons: addons.addons || [],
            phases: phases.phases || defaultPhases,
            risks: RISKS, dns_records: DNS_RECORDS, macros: MACROS, goliveliste: GOLIVELISTE,
            fragenkatalog: FRAGENKATALOG, demo_checklist: DEMO_CHECKLIST, demo_milestones: DEMO_MILESTONES,
            faq: FAQ_HFK, upsells: UPSELLS, lizenzen: LIZENZEN,
          },
          settings: { timezone: 'Wien UTC+1/+2', language: 'de', notes: '' },
        }
      }

      const newProject = await createProject(projectData)
      navigate(`/projects/${newProject.id}`)
    } catch (err) {
      setError(err?.message || 'Fehler beim Erstellen des Projekts')
      setSaving(false)
    }
  }

  // ── Type not selected yet → show type selector ──
  if (!wizardType) {
    return <TypeSelector onSelect={(type) => { setWizardType(type); setStep(0) }} />
  }

  const banner = bannerLabels[wizardType]

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>
          NEUES PROJEKT ANLEGEN
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--white)', margin: 0 }}>{steps[step]}</h1>
      </div>

      {/* Banner */}
      <div style={{ padding: '8px 14px', marginBottom: 20, borderRadius: 'var(--r)', background: colorD, border: `1px solid ${colorB}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18 }}>{banner.icon}</span>
        <div>
          <span style={{ fontWeight: 700, color, fontSize: 13 }}>{banner.name}</span>
          <span style={{ color: 'var(--muted-l)', fontSize: 12, marginLeft: 10 }}>{banner.sub}</span>
        </div>
        <button onClick={() => { setWizardType(null); setStep(0) }} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
          ← Typ ändern
        </button>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} steps={steps} color={color} colorD={colorD} colorB={colorB} />

      {/* Step content */}
      <Card style={{ marginBottom: 20 }}>
        {wizardType === 'multi' ? (
          <>
            {step === 0 && <StepCustomer data={customer} onChange={setCustomer} serviceType="zendesk" />}
            {step === 1 && <StepMultiServices selected={selectedServices} onSelected={setSelectedServices} zdConfig={zdConfig} onZdConfig={setZdConfig} paConfig={paConfig} onPaConfig={setPaConfig} />}
            {step === 2 && <StepStufenplan stages={stages} onStages={setStages} selectedServices={selectedServices} />}
            {step === 3 && <StepMultiSummary customer={customer} selectedServices={selectedServices} zdConfig={zdConfig} paConfig={paConfig} stages={stages} />}
          </>
        ) : (
          <>
            {step === 0 && <StepCustomer data={customer} onChange={setCustomer} serviceType={wizardType} />}
            {step === 1 && <StepPlan data={plan} onChange={setPlan} serviceType={wizardType} />}
            {step === 2 && <StepAddons data={addons} onChange={setAddons} serviceType={wizardType} />}
            {step === 3 && <StepPhases data={phases} onChange={setPhases} serviceType={wizardType} />}
            {step === 4 && <StepSummary customer={customer} plan={plan} addons={addons} phases={phases} serviceType={wizardType} />}
          </>
        )}
      </Card>

      {error && (
        <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 6, color: 'var(--red)', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <Button variant="ghost" onClick={() => step > 0 ? setStep(step - 1) : navigate('/home')}>
          ← {t('wizard.back')}
        </Button>
        {step < totalSteps - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canNext} style={{ background: color, color: '#fff' }}>
            {t('wizard.next')} →
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={saving || !customer.name.trim()} style={{ background: color, color: '#fff' }}>
            {saving ? t('wizard.creating') : t('wizard.create')}
          </Button>
        )}
      </div>
    </div>
  )
}
