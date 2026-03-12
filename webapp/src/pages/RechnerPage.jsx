import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

// ── Design Tokens ─────────────────────────────────────────────────────────────
const ZD = {
  accent:  '#5C7A6A',
  bg:      'rgba(92,122,106,0.07)',
  border:  'rgba(92,122,106,0.22)',
  pill:    'rgba(92,122,106,0.12)',
}
const PA = {
  accent:  '#0078D4',
  bg:      'rgba(0,120,212,0.07)',
  border:  'rgba(0,120,212,0.22)',
  pill:    'rgba(0,120,212,0.1)',
}
const SURFACE = '#FFFFFF'
const PAGE_BG  = '#F5F7FA'
const TEXT      = '#1C2536'
const MUTED     = '#64748B'
const BORDER    = '#E2E8F0'

// ── Zendesk Plans & Logic ──────────────────────────────────────────────────────
const ZD_PLANS = [
  { id: 'team',         name: 'Suite Team',          price: 19,  tag: 'Einsteiger' },
  { id: 'growth',       name: 'Suite Growth',         price: 55,  tag: 'Wachstum'   },
  { id: 'professional', name: 'Suite Professional',   price: 115, tag: 'Empfohlen', best: true },
  { id: 'enterprise',   name: 'Suite Enterprise',     price: 169, tag: 'Enterprise' },
]

// min: 0=Team, 1=Growth, 2=Professional, 3=Enterprise
const ZD_FEATURES = [
  { id: 'sla',        label: 'SLA-Management',      desc: 'Reaktionszeiten & Prioritäten tracken',          icon: '⏱', min: 1 },
  { id: 'omni',       label: 'Omnichannel',          desc: 'Chat, Social Media, Telefon zusätzlich zu E-Mail', icon: '📱', min: 1 },
  { id: 'ai',         label: 'KI Copilot',           desc: 'Automatische Antwortvorschläge & Routing',        icon: '🤖', min: 2 },
  { id: 'api',        label: 'Shop-Integration',     desc: 'JTL, Shopware, Shopify via API',                  icon: '🔗', min: 2 },
  { id: 'analytics',  label: 'Erweiterte Analytics', desc: 'Anpassbare Dashboards & CSAT-Umfragen',            icon: '📊', min: 2 },
  { id: 'multibrand', label: 'Multi-Brand',          desc: 'Mehrere Shops oder Marken in einem System',       icon: '🏷', min: 3 },
]

const ZD_TICKET_MARKS = [10, 30, 60, 100, 200, 500]

function zdRecommend({ agents, tickets, features }) {
  let minIdx = 0
  features.forEach((fid) => {
    const f = ZD_FEATURES.find((x) => x.id === fid)
    if (f && f.min > minIdx) minIdx = f.min
  })
  if      (agents >= 20 || tickets >= 200) minIdx = Math.max(minIdx, 3)
  else if (agents >=  8 || tickets >= 100) minIdx = Math.max(minIdx, 2)
  else if (agents >=  3 || tickets >=  30) minIdx = Math.max(minIdx, 1)
  return ZD_PLANS[Math.min(minIdx, 3)]
}

// ── Power Automate Plans & Logic ───────────────────────────────────────────────
const PA_PLANS = [
  { id: 'free',       name: 'M365 Inklusive',   price: 0,   unit: 'user',    tag: 'Kostenlos' },
  { id: 'premium',    name: 'Premium',           price: 15,  unit: 'user',    tag: 'Standard',  best: true },
  { id: 'premiumRpa', name: 'Premium + RPA',     price: 40,  unit: 'user',    tag: 'Desktop'   },
  { id: 'process',    name: 'Process',           price: 150, unit: 'process', tag: 'Unattended' },
]

// min: 0=Free, 1=Premium, 2=PremiumRPA, 3=Process
const PA_USECASES = [
  { id: 'cloud',    label: 'Standard Cloud-Flows',    desc: 'E-Mail, Teams, SharePoint Automatisierung',      icon: '☁️', min: 0 },
  { id: 'premium',  label: 'Premium-Konnektoren',     desc: 'JTL, SAP, Salesforce, Dynamics 365',             icon: '🔌', min: 1 },
  { id: 'ai',       label: 'AI Builder / OCR',        desc: 'Rechnungen & Belege automatisch auslesen',       icon: '🧠', min: 1 },
  { id: 'desktop',  label: 'Desktop-Automatisierung', desc: 'Legacy-Software & SAP GUI (attended, mit Login)', icon: '🖥', min: 2 },
  { id: 'rpa',      label: 'Unattended RPA',          desc: '24/7 Bots ohne Nutzeranmeldung (z. B. nachts)',  icon: '🤖', min: 3 },
]

function paRecommend({ users, useCases, processes }) {
  let minIdx = 0
  useCases.forEach((uid) => {
    const uc = PA_USECASES.find((x) => x.id === uid)
    if (uc && uc.min > minIdx) minIdx = uc.min
  })
  if (useCases.includes('rpa') && processes >= 2) minIdx = Math.max(minIdx, 3)
  return PA_PLANS[Math.min(minIdx, 3)]
}

// ── Micro Components ───────────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <div style={{
      fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
      letterSpacing: '.12em', color: MUTED, marginBottom: 10,
    }}>
      {children}
    </div>
  )
}

function Stepper({ value, onChange, min = 1, max = 200, accent, presets }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          style={{
            width: 34, height: 34, borderRadius: 6, border: `1.5px solid ${BORDER}`,
            background: SURFACE, color: accent, fontSize: 20, lineHeight: 1,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 300, transition: 'border-color .15s',
          }}
        >−</button>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700,
          color: TEXT, minWidth: 56, textAlign: 'center', lineHeight: 1,
        }}>
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          style={{
            width: 34, height: 34, borderRadius: 6, border: `1.5px solid ${BORDER}`,
            background: SURFACE, color: accent, fontSize: 20, lineHeight: 1,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 300, transition: 'border-color .15s',
          }}
        >+</button>
      </div>
      {presets && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {presets.map((p) => {
            const active = value === p
            return (
              <button
                key={p}
                onClick={() => onChange(p)}
                style={{
                  padding: '3px 10px', borderRadius: 4,
                  border: `1.5px solid ${active ? accent : BORDER}`,
                  background: active ? `rgba(${accent === ZD.accent ? '92,122,106' : '0,120,212'},.1)` : 'transparent',
                  color: active ? accent : MUTED,
                  fontFamily: 'var(--font-mono)', fontSize: 12, cursor: 'pointer',
                  transition: 'all .12s',
                }}
              >
                {p}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SegmentedTickets({ value, onChange, accent }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {ZD_TICKET_MARKS.map((m) => {
        const active = value === m
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            style={{
              padding: '6px 14px', borderRadius: 6,
              border: `1.5px solid ${active ? accent : BORDER}`,
              background: active ? ZD.bg : SURFACE,
              color: active ? accent : MUTED,
              fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: active ? 700 : 400,
              cursor: 'pointer', transition: 'all .12s',
            }}
          >
            {m === 500 ? '500+' : `≤ ${m}`}
          </button>
        )
      })}
    </div>
  )
}

function FeatureGrid({ selected, onChange, options, token }) {
  const toggle = (id) => onChange(
    selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {options.map((opt) => {
        const on = selected.includes(opt.id)
        return (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 8,
              border: `1.5px solid ${on ? token.accent : BORDER}`,
              background: on ? token.bg : SURFACE,
              cursor: 'pointer', textAlign: 'left', transition: 'all .12s',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{opt.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: on ? 600 : 400, color: on ? TEXT : TEXT, lineHeight: 1.3 }}>
                {opt.label}
              </div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 2, lineHeight: 1.4 }}>{opt.desc}</div>
            </div>
            <div style={{
              width: 18, height: 18, borderRadius: 4, flexShrink: 0,
              border: `2px solid ${on ? token.accent : BORDER}`,
              background: on ? token.accent : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .12s',
            }}>
              {on && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, lineHeight: 1 }}>✓</span>}
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ── Result Card ────────────────────────────────────────────────────────────────
function ResultCard({ plan, plans, mainCount, subCount, isPA, token }) {
  const planIdx      = plans.findIndex((p) => p.id === plan.id)
  const isProcess    = isPA && plan.unit === 'process'
  const unitLabel    = isProcess ? 'Prozess' : isPA ? 'User' : 'Agent'
  const count        = isProcess ? subCount : mainCount
  const monthly      = plan.price * count
  const yearly       = Math.round(monthly * 12 * 0.8)
  // Zendesk only: lightAgents = subCount, show savings
  const lightAgents  = !isPA ? subCount : 0
  const savedMonthly = !isPA ? plan.price * lightAgents : 0

  return (
    <div style={{
      background: SURFACE, border: `1.5px solid ${token.border}`,
      borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      position: 'sticky', top: 24,
    }}>

      {/* Header */}
      <div style={{
        background: token.bg, borderBottom: `1px solid ${token.border}`,
        padding: '18px 22px',
      }}>
        <div style={{
          fontSize: 10, fontFamily: 'var(--font-mono)', color: token.accent,
          textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 6,
        }}>
          Empfehlung
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: TEXT, lineHeight: 1.2 }}>
            {plan.name}
          </div>
          {plan.best && (
            <div style={{
              padding: '2px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700,
              background: token.accent, color: '#fff',
              fontFamily: 'var(--font-mono)', letterSpacing: '.05em',
            }}>
              EMPFOHLEN
            </div>
          )}
        </div>
        <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
          Plan {planIdx + 1} von {plans.length}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: '18px 22px', borderBottom: `1px solid ${BORDER}` }}>
        {plan.price === 0 ? (
          <div>
            <div style={{
              fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-mono)',
              color: token.accent, lineHeight: 1,
            }}>
              Gratis
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>
              Im Microsoft 365 Abonnement bereits enthalten.
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 22, alignItems: 'flex-end' }}>
              <div>
                <div style={{
                  fontSize: 11, fontFamily: 'var(--font-mono)', color: MUTED,
                  textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4,
                }}>
                  Pro {unitLabel}/Mo.
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 700,
                  color: token.accent, lineHeight: 1,
                }}>
                  €{plan.price}
                </div>
              </div>
              <div style={{ width: 1, height: 40, background: BORDER }} />
              <div>
                <div style={{
                  fontSize: 11, fontFamily: 'var(--font-mono)', color: MUTED,
                  textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4,
                }}>
                  Gesamt / Mo. ({count} {unitLabel}{count !== 1 ? 'n' : ''})
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 700,
                  color: TEXT, lineHeight: 1,
                }}>
                  €{monthly.toLocaleString('de')}
                </div>
              </div>
            </div>
            <div style={{
              marginTop: 14, padding: '10px 14px',
              background: `rgba(${isPA ? '0,120,212' : '92,122,106'},.06)`,
              borderRadius: 8, fontSize: 12, color: MUTED,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>Jährlich mit 20% Rabatt</span>
              <strong style={{ color: token.accent, fontFamily: 'var(--font-mono)', fontSize: 14 }}>
                €{yearly.toLocaleString('de')} / Jahr
              </strong>
            </div>
            {savedMonthly > 0 && (
              <div style={{
                marginTop: 8, padding: '10px 14px',
                background: 'rgba(34,197,94,0.07)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 8, fontSize: 12, color: MUTED,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span>Ersparnis durch {lightAgents} Light Agent{lightAgents !== 1 ? 'en' : ''} (kostenlos)</span>
                <strong style={{ color: '#16A34A', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
                  −€{savedMonthly.toLocaleString('de')} / Mo.
                </strong>
              </div>
            )}
          </>
        )}
      </div>

      {/* Plan Ladder */}
      <div style={{ padding: '14px 22px' }}>
        <div style={{
          fontSize: 10, fontFamily: 'var(--font-mono)', color: MUTED,
          textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12,
        }}>
          Plan-Übersicht
        </div>
        {plans.map((p, i) => {
          const pIdx    = plans.findIndex((x) => x.id === p.id)
          const isSel   = p.id === plan.id
          const isAbove = pIdx > planIdx
          return (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0',
              borderBottom: i < plans.length - 1 ? `1px solid ${BORDER}` : 'none',
              opacity: isAbove ? 0.35 : 1,
              transition: 'opacity .2s',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: isSel ? token.accent : BORDER,
                transition: 'background .2s',
              }} />
              <div style={{
                flex: 1, fontSize: 13,
                fontWeight: isSel ? 600 : 400,
                color: isSel ? TEXT : MUTED,
              }}>
                {p.name}
                {isSel && (
                  <span style={{
                    marginLeft: 8, fontSize: 10, color: token.accent,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    ← aktuell
                  </span>
                )}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 12,
                color: isSel ? token.accent : MUTED,
                fontWeight: isSel ? 600 : 400,
              }}>
                {p.price === 0 ? 'Gratis' : p.unit === 'process' ? `€${p.price}/Proz.` : `€${p.price}/User`}
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div style={{ padding: '16px 22px', borderTop: `1px solid ${BORDER}` }}>
        <Link
          to={`/projects/new?type=${isPA ? 'power-automate' : 'zendesk'}`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px 0', background: token.accent, color: '#fff',
            borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none',
            transition: 'opacity .15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '.88'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          {isPA ? '⚡ PA-Projekt anlegen' : '🎯 Zendesk-Projekt anlegen'} →
        </Link>
        <div style={{ fontSize: 11, color: MUTED, textAlign: 'center', marginTop: 8 }}>
          Anmeldung erforderlich
        </div>
      </div>
    </div>
  )
}

// ── Zendesk Calculator ─────────────────────────────────────────────────────────
function ZendeskRechner() {
  const [agents,      setAgents]      = useState(6)
  const [fullAgents,  setFullAgentsRaw] = useState(4)
  const [tickets,     setTickets]     = useState(60)
  const [features,    setFeatures]    = useState([])

  // Full agents cannot exceed total agents
  const setFullAgents = (v) => setFullAgentsRaw(Math.min(v, agents))
  const lightAgents = Math.max(0, agents - fullAgents)

  const plan = useMemo(() => zdRecommend({ agents: fullAgents, tickets, features }), [fullAgents, tickets, features])

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 340px',
      gap: 28, alignItems: 'start',
    }}>
      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Agents split */}
        <div style={{
          background: SURFACE, border: `1px solid ${BORDER}`,
          borderRadius: 10, padding: '20px 22px',
        }}>
          <Label>Mitarbeiter mit Zugang zu Zendesk</Label>
          <Stepper
            value={agents}
            onChange={(v) => { setAgents(v); setFullAgentsRaw(f => Math.min(f, v)) }}
            min={1} max={100} accent={ZD.accent}
            presets={[1, 2, 3, 5, 6, 8, 12, 20]}
          />

          {/* Full vs Light split */}
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${BORDER}` }}>
            <Label>Davon antworten direkt an Kunden (Full Agent)</Label>
            <Stepper
              value={fullAgents} onChange={setFullAgents}
              min={1} max={agents} accent={ZD.accent}
              presets={[1, 2, 3, 4, 5, 6].filter(p => p <= agents)}
            />
            <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
              <div style={{
                flex: 1, padding: '10px 14px', borderRadius: 8,
                background: ZD.bg, border: `1px solid ${ZD.border}`,
              }}>
                <div style={{ fontSize: 11, color: ZD.accent, fontWeight: 700, marginBottom: 3 }}>
                  Full Agents · {fullAgents}
                </div>
                <div style={{ fontSize: 12, color: MUTED }}>
                  Antworten, Tickets lösen, alle Funktionen · lizenzpflichtig
                </div>
              </div>
              {lightAgents > 0 && (
                <div style={{
                  flex: 1, padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(34,197,94,0.06)', border: `1px solid rgba(34,197,94,0.2)`,
                }}>
                  <div style={{ fontSize: 11, color: '#16A34A', fontWeight: 700, marginBottom: 3 }}>
                    Light Agents · {lightAgents} · kostenlos
                  </div>
                  <div style={{ fontSize: 12, color: MUTED }}>
                    Mitlesen + interne Notizen — ideal für GF, Lager, Einkauf
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ticket Volume */}
        <div style={{
          background: SURFACE, border: `1px solid ${BORDER}`,
          borderRadius: 10, padding: '20px 22px',
        }}>
          <Label>Tickets pro Tag (Durchschnitt)</Label>
          <SegmentedTickets value={tickets} onChange={setTickets} accent={ZD.accent} />
          <div style={{ fontSize: 12, color: MUTED, marginTop: 10 }}>
            Ausgewählt: <span style={{ fontFamily: 'var(--font-mono)', color: ZD.accent }}>
              {tickets === 500 ? '500+ Tickets' : `bis ${tickets} Tickets`}
            </span> täglich
          </div>
        </div>

        {/* Features */}
        <div style={{
          background: SURFACE, border: `1px solid ${BORDER}`,
          borderRadius: 10, padding: '20px 22px',
        }}>
          <Label>Benötigte Funktionen (Mehrfachauswahl)</Label>
          <FeatureGrid
            selected={features} onChange={setFeatures}
            options={ZD_FEATURES} token={ZD}
          />
        </div>

        {/* Note */}
        <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, paddingBottom: 4 }}>
          * Preise pro Agent/Monat, netto zzgl. MwSt. Bei jährlicher Abrechnung 20% Rabatt.
          Implementierung durch <strong>Dadakaev Labs</strong> (€2.880 pauschal, 6 Wochen Go-Live).
        </div>
      </div>

      {/* Result */}
      <ResultCard
        plan={plan} plans={ZD_PLANS}
        mainCount={fullAgents} subCount={lightAgents}
        isPA={false} token={ZD}
      />
    </div>
  )
}

// ── Power Automate Calculator ──────────────────────────────────────────────────
function PARechner() {
  const [users,     setUsers]     = useState(5)
  const [useCases,  setUseCases]  = useState([])
  const [processes, setProcesses] = useState(2)

  const plan      = useMemo(() => paRecommend({ users, useCases, processes }), [users, useCases, processes])
  const isProcess = plan.unit === 'process'

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 340px',
      gap: 28, alignItems: 'start',
    }}>
      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Users */}
        <div style={{
          background: SURFACE, border: `1px solid ${BORDER}`,
          borderRadius: 10, padding: '20px 22px',
        }}>
          <Label>Anzahl Mitarbeiter, die automatisieren</Label>
          <Stepper
            value={users} onChange={setUsers}
            min={1} max={500} accent={PA.accent}
            presets={[1, 3, 5, 10, 25, 50]}
          />
          <div style={{ fontSize: 12, color: MUTED, marginTop: 12 }}>
            Bei kostenlosem Plan (M365 inklusive) entstehen <strong>keine zusätzlichen Lizenzkosten</strong> —
            solange keine Premium-Konnektoren benötigt werden.
          </div>
        </div>

        {/* Use Cases */}
        <div style={{
          background: SURFACE, border: `1px solid ${BORDER}`,
          borderRadius: 10, padding: '20px 22px',
        }}>
          <Label>Welche Automatisierungen werden benötigt?</Label>
          <FeatureGrid
            selected={useCases} onChange={setUseCases}
            options={PA_USECASES} token={PA}
          />
        </div>

        {/* Processes (only if unattended selected) */}
        {useCases.includes('rpa') && (
          <div style={{
            background: SURFACE, border: `1.5px solid ${PA.border}`,
            borderRadius: 10, padding: '20px 22px',
          }}>
            <Label>Anzahl Prozesse / Bots (Unattended)</Label>
            <Stepper
              value={processes} onChange={setProcesses}
              min={1} max={50} accent={PA.accent}
              presets={[1, 2, 3, 5, 10]}
            />
            <div style={{
              marginTop: 14, padding: '10px 14px',
              background: PA.bg, borderRadius: 8,
              fontSize: 12, color: MUTED, lineHeight: 1.55,
            }}>
              <strong style={{ color: PA.accent }}>Process Plan:</strong> Jeder Bot / Prozess wird separat
              lizenziert (€150/Mo.), läuft auf einer dedizierten Azure-VM (Hosted Machine) —
              kein physischer PC erforderlich.
            </div>
          </div>
        )}

        {/* Note */}
        <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, paddingBottom: 4 }}>
          * Preise pro User/Monat bzw. Prozess/Monat, netto zzgl. MwSt.
          Jährliche Abrechnung: 20% Rabatt. Implementierung durch <strong>Dadakaev Labs</strong>.
        </div>
      </div>

      {/* Result */}
      <ResultCard
        plan={plan} plans={PA_PLANS}
        mainCount={users} subCount={processes}
        isPA={true} token={PA}
      />
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function RechnerPage() {
  const [tab, setTab] = useState('zendesk')
  const isPA    = tab === 'pa'
  const token   = isPA ? PA : ZD
  const tabName = isPA ? 'Power Automate' : 'Zendesk'

  return (
    <div style={{
      minHeight: '100vh',
      background: PAGE_BG,
      fontFamily: 'var(--font-sans)',
      color: TEXT,
    }}>

      {/* Top Nav */}
      <div style={{
        background: SURFACE, borderBottom: `1px solid ${BORDER}`,
        padding: '0 32px',
      }}>
        <div style={{
          maxWidth: 1020, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 56,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
              color: TEXT, letterSpacing: '.08em',
            }}>
              DADAKAEV_LABS
            </span>
            <span style={{ color: BORDER, fontSize: 16 }}>|</span>
            <span style={{ fontSize: 13, color: MUTED }}>
              Lizenz- & Bedarfsrechner
            </span>
          </div>
          <Link
            to="/login"
            style={{
              fontSize: 13, color: token.accent, fontWeight: 600,
              textDecoration: 'none', fontFamily: 'var(--font-sans)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            Zum Dashboard →
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1020, margin: '0 auto', padding: '40px 32px 80px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            fontSize: 11, fontFamily: 'var(--font-mono)', color: token.accent,
            textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 8,
          }}>
            Bedarfsermittlung
          </div>
          <h1 style={{
            fontSize: 30, fontWeight: 700, color: TEXT,
            margin: 0, lineHeight: 1.25,
          }}>
            Welcher{' '}
            <span style={{
              color: token.accent,
              borderBottom: `2px solid ${token.accent}`,
              paddingBottom: 1,
              transition: 'color .2s, border-color .2s',
            }}>
              {tabName}-Plan
            </span>{' '}
            passt zu Ihrem Unternehmen?
          </h1>
          <p style={{ fontSize: 14, color: MUTED, margin: '10px 0 0', lineHeight: 1.65, maxWidth: 520 }}>
            Beantworten Sie 3 kurze Fragen — der Rechner ermittelt sofort den optimalen Plan
            und berechnet Ihre monatlichen Lizenzkosten.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'inline-flex', background: SURFACE,
          border: `1px solid ${BORDER}`, borderRadius: 10,
          padding: 4, marginBottom: 32, gap: 4,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          {[
            { id: 'zendesk', label: '🎯 Zendesk Suite',         accent: ZD.accent },
            { id: 'pa',      label: '⚡ Microsoft Power Automate', accent: PA.accent },
          ].map(({ id, label, accent }) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  padding: '9px 22px', borderRadius: 7, border: 'none',
                  background: active ? accent : 'transparent',
                  color: active ? '#fff' : MUTED,
                  fontSize: 13, fontWeight: active ? 600 : 400, cursor: 'pointer',
                  transition: 'all .15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Calculator Content */}
        <div
          key={tab}
          style={{ animation: 'fadeIn .18s ease' }}
        >
          {isPA ? <PARechner /> : <ZendeskRechner />}
        </div>

        {/* Bottom Comparison Strip */}
        <div style={{
          marginTop: 52, paddingTop: 28,
          borderTop: `1px solid ${BORDER}`,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}>
          {/* ZD summary */}
          <div style={{
            background: SURFACE, border: `1px solid ${BORDER}`,
            borderRadius: 10, padding: '18px 20px',
          }}>
            <div style={{
              fontSize: 11, fontFamily: 'var(--font-mono)', color: ZD.accent,
              textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 8,
            }}>
              Zendesk Suite — Überblick
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ZD_PLANS.map((p) => (
                <div key={p.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 13, color: TEXT,
                }}>
                  <span>{p.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: ZD.accent }}>
                    €{p.price}/Agent/Mo.
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PA summary */}
          <div style={{
            background: SURFACE, border: `1px solid ${BORDER}`,
            borderRadius: 10, padding: '18px 20px',
          }}>
            <div style={{
              fontSize: 11, fontFamily: 'var(--font-mono)', color: PA.accent,
              textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 8,
            }}>
              Power Automate — Überblick
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PA_PLANS.map((p) => (
                <div key={p.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 13, color: TEXT,
                }}>
                  <span>{p.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: PA.accent }}>
                    {p.price === 0 ? 'Gratis' : `€${p.price}/${p.unit === 'process' ? 'Proz.' : 'User'}/Mo.`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, fontSize: 12, color: MUTED, lineHeight: 1.6 }}>
          Alle Preise netto zzgl. MwSt. · Jährliche Abrechnung mit 20% Rabatt · Stand: 2025 ·
          Implementierung & Support durch{' '}
          <a href="https://dadakaev.de" style={{ color: token.accent }}>Dadakaev Labs</a>
        </div>
      </div>
    </div>
  )
}
