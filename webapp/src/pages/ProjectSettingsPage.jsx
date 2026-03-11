import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useProject } from '../context/ProjectContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { ZENDESK_PLANS, ADDON_PRICES, calcCost } from '../utils/planUtils'
import { PA_PLANS, PA_ADDON_PRICES, calcCostPA } from '../utils/paUtils'

const PA_BLUE = '#0078D4'
const PA_BLUE_BG = 'rgba(0,120,212,0.1)'
const PA_BLUE_BORDER = 'rgba(0,120,212,0.35)'

const TOGGLEABLE_PAGES = [
  { seg: 'phasen',    label: 'Phasen',         icon: '◈' },
  { seg: 'checkliste',label: 'Go-Live Checkliste', icon: '✓' },
  { seg: 'makros',    label: 'Makros',          icon: '⚡' },
  { seg: 'dns',       label: 'DNS & E-Mail',    icon: '◎' },
  { seg: 'risiken',   label: 'Risiken',         icon: '△' },
  { seg: 'kunde',     label: 'Kundendaten',     icon: '◇' },
  { seg: 'fragen',    label: 'Fragenkatalog',   icon: '≡' },
  { seg: 'faq',       label: 'FAQ',             icon: '?' },
  { seg: 'demo',      label: 'Demo & Schulung', icon: '▷' },
]

// ─── Paket-Konfiguration ─────────────────────────────────────────────────────

function SpinnerInput({ value, onChange, min = 0, max = 20, disabled }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        style={{
          width: 28, height: 28, borderRadius: 4, border: '1px solid var(--border)',
          background: 'var(--ink-m)', color: 'var(--white-d)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          opacity: (disabled || value <= min) ? 0.4 : 1,
        }}
      >−</button>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--white)', minWidth: 28, textAlign: 'center' }}>
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        style={{
          width: 28, height: 28, borderRadius: 4, border: '1px solid var(--border)',
          background: 'var(--ink-m)', color: 'var(--white-d)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          opacity: (disabled || value >= max) ? 0.4 : 1,
        }}
      >+</button>
    </div>
  )
}

function PaketKonfig({ project, onSave }) {
  const sp = project?.service_package || {}

  const initPlanId = () => {
    const name = sp.plan || ''
    const lower = name.toLowerCase()
    if (lower.includes('enterprise'))   return 'enterprise'
    if (lower.includes('professional')) return 'professional'
    if (lower.includes('growth'))       return 'growth'
    return 'team'
  }

  const [planId, setPlanId]           = useState(initPlanId)
  const [agentsFull, setAgentsFull]   = useState(sp.agents_full  ?? 4)
  const [agentsLight, setAgentsLight] = useState(sp.agents_light ?? 2)
  const [addons, setAddons]           = useState(sp.addons || {})
  const [saving, setSaving]           = useState(false)
  const [saved, setSaved]             = useState(false)

  const plan      = ZENDESK_PLANS.find((p) => p.id === planId)
  const tier      = plan?.tier || 1
  const cost      = calcCost(planId, agentsFull, agentsLight, addons)

  const toggleAddon = (key) => setAddons((prev) => ({ ...prev, [key]: !prev[key] }))

  const handleSave = async () => {
    setSaving(true)
    await onSave({
      plan:                  plan.name,
      plan_id:               planId,
      plan_price_per_agent:  plan.price,
      agents_full:           agentsFull,
      agents_light:          agentsLight,
      addons,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const fmt = (n) => `€${n.toLocaleString('de-AT', { minimumFractionDigits: 0 })}`

  return (
    <Card>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 20 }}>
        Paket-Konfiguration
      </div>

      {/* Plan selector */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>Zendesk Plan</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {ZENDESK_PLANS.map((p) => {
            const active = p.id === planId
            return (
              <div
                key={p.id}
                onClick={() => setPlanId(p.id)}
                style={{
                  padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
                  border: active ? '2px solid var(--green)' : '1px solid var(--border)',
                  background: active ? 'rgba(63,207,142,.06)' : 'transparent',
                  transition: 'all .15s', position: 'relative',
                }}
              >
                {p.highlight && (
                  <div style={{ position: 'absolute', top: -8, right: 8, background: 'var(--green)', color: 'var(--ink)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, letterSpacing: '.05em' }}>
                    EMPFOHLEN
                  </div>
                )}
                <div style={{ fontWeight: 700, fontSize: 13, color: active ? 'var(--green)' : 'var(--white-d)', marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: active ? 'var(--green)' : 'var(--muted)', marginBottom: 8 }}>
                  {fmt(p.price)}/Agent/Mo.
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ fontSize: 11, color: 'var(--muted-l)', marginBottom: 2, display: 'flex', alignItems: 'baseline', gap: 5 }}>
                      <span style={{ color: active ? 'var(--green)' : 'var(--border-l)', flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      {/* Agent spinners */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>Agenten</div>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted-l)', marginBottom: 6 }}>Full Agents</div>
            <SpinnerInput value={agentsFull} onChange={setAgentsFull} min={1} max={50} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted-l)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              Light Agents
              {tier < 3 && (
                <span style={{ fontSize: 10, color: 'var(--amber)', fontFamily: 'var(--font-mono)', background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 4, padding: '1px 6px' }}>
                  Nur ab Professional
                </span>
              )}
              {tier >= 3 && (
                <span style={{ fontSize: 10, color: 'var(--green)', fontFamily: 'var(--font-mono)', background: 'rgba(63,207,142,.08)', border: '1px solid var(--green-b)', borderRadius: 4, padding: '1px 6px' }}>
                  Kostenlos inklusive
                </span>
              )}
            </div>
            <SpinnerInput value={agentsLight} onChange={setAgentsLight} min={0} max={50} disabled={tier < 3} />
          </div>
        </div>
      </div>

      {/* Addons */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>Add-ons</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {Object.entries(ADDON_PRICES).map(([key, info]) => {
            const active    = !!addons[key]
            const locked    = info.requiresTier > tier
            return (
              <label
                key={key}
                onClick={() => !locked && toggleAddon(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 6, cursor: locked ? 'not-allowed' : 'pointer',
                  border: active ? '1px solid var(--green-b)' : '1px solid var(--border)',
                  background: active ? 'rgba(63,207,142,.04)' : locked ? 'rgba(0,0,0,.04)' : 'transparent',
                  opacity: locked ? 0.6 : 1, transition: 'all .15s', userSelect: 'none',
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: 3, flexShrink: 0,
                  border: active ? '2px solid var(--green)' : '2px solid var(--border-l)',
                  background: active ? 'var(--green)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {active && <span style={{ color: 'var(--ink)', fontSize: 10, fontWeight: 700 }}>✓</span>}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: active ? 'var(--white-d)' : 'var(--muted-l)', fontWeight: 600 }}>{info.label}</div>
                  {info.pricePerAgent > 0 && (
                    <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                      +{fmt(info.pricePerAgent)}/Agent/Mo.
                    </div>
                  )}
                  {locked && (
                    <div style={{ fontSize: 10, color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
                      Erfordert Professional+
                    </div>
                  )}
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* Live cost calculation */}
      <div style={{ padding: '16px 18px', background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
          Live-Kalkulation
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Lizenzen/Mo.</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--white)' }}>{fmt(cost.licenseMonthly)}</div>
          </div>
          {cost.copilotMonthly > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>+ Copilot/Mo.</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--blue)' }}>{fmt(cost.copilotMonthly)}</div>
            </div>
          )}
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Gesamt/Mo.</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--green)' }}>{fmt(cost.totalMonthly)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Jährlich (–20%)</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--white-d)' }}>{fmt(cost.totalYearly)}</div>
          </div>
        </div>

        {/* Light agent savings tip */}
        {tier >= 3 && agentsLight > 0 && (
          <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(63,207,142,.06)', border: '1px solid var(--green-b)', borderRadius: 6, fontSize: 12, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
            💡 Mit {agentsLight} Light Agent{agentsLight > 1 ? 's' : ''} sparen Sie {fmt(agentsLight * plan.price)}/Mo. gegenüber rein Full-Agent Konfiguration
          </div>
        )}
        {tier < 3 && agentsLight > 0 && cost.lightSavings > 0 && (
          <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 6, fontSize: 12, color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
            💡 Upgrade auf Professional → Light Agents kostenlos, Ersparnis {fmt(agentsLight * plan.price)}/Mo.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" onClick={handleSave} loading={saving}>
          {saved ? '✓ Gespeichert' : 'Paket speichern'}
        </Button>
      </div>
    </Card>
  )
}

// ─── PA Paket-Konfiguration ───────────────────────────────────────────────────

function PAPaketKonfig({ project, onSave }) {
  const sp = project?.service_package || {}

  const initPAPlanId = () => {
    const id = sp.plan_id
    if (id && PA_PLANS.find((p) => p.id === id)) return id
    const name = (sp.plan || '').toLowerCase()
    if (name.includes('process')) return 'process'
    if (name.includes('rpa'))     return 'premiumRpa'
    if (name.includes('premium')) return 'premium'
    return 'premium'
  }

  const [planId, setPlanId]         = useState(initPAPlanId)
  const [paUsers, setPaUsers]       = useState(sp.pa_users   ?? 3)
  const [paProcesses, setPaProcesses] = useState(sp.pa_processes ?? 1)
  const [addons, setAddons]         = useState(sp.addons_pa || {})
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)

  const plan = PA_PLANS.find((p) => p.id === planId) || PA_PLANS[1]
  const isProcessPlan = plan.priceModel === 'process'
  const cost = calcCostPA(planId, paUsers, paProcesses, addons)

  const toggleAddon = (key) => setAddons((prev) => ({ ...prev, [key]: !prev[key] }))

  const handleSave = async () => {
    setSaving(true)
    await onSave({
      plan:                    plan.name,
      plan_id:                 planId,
      plan_price_per_user:     plan.priceModel === 'user' ? plan.price : 0,
      plan_price_per_process:  plan.priceModel === 'process' ? plan.price : 0,
      pa_users:                paUsers,
      pa_processes:            paProcesses,
      addons_pa:               addons,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const fmt = (n) => `€${n.toLocaleString('de-AT', { minimumFractionDigits: 0 })}`

  return (
    <Card>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: PA_BLUE, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 20 }}>
        Power Automate Paket-Konfiguration
      </div>

      {/* Plan selector */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>PA-Lizenzplan</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
          {PA_PLANS.map((p) => {
            const active = p.id === planId
            return (
              <div
                key={p.id}
                onClick={() => setPlanId(p.id)}
                style={{
                  padding: '12px 14px', borderRadius: 8, cursor: 'pointer', position: 'relative',
                  border: active ? `2px solid ${PA_BLUE}` : '1px solid var(--border)',
                  background: active ? PA_BLUE_BG : 'transparent',
                  transition: 'all .15s',
                }}
              >
                {p.highlight && (
                  <div style={{ position: 'absolute', top: -8, right: 8, background: PA_BLUE, color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, letterSpacing: '.05em', whiteSpace: 'nowrap' }}>
                    EMPFOHLEN
                  </div>
                )}
                <div style={{ fontWeight: 700, fontSize: 13, color: active ? PA_BLUE : 'var(--white-d)', marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: active ? PA_BLUE : 'var(--muted)', marginBottom: 8 }}>
                  {p.price === 0 ? 'Kostenlos' : `${fmt(p.price)}/${p.priceModel === 'process' ? 'Prozess' : 'User'}/Mo.`}
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f} style={{ fontSize: 10, color: 'var(--muted-l)', marginBottom: 2, display: 'flex', alignItems: 'baseline', gap: 5 }}>
                      <span style={{ color: active ? PA_BLUE : 'var(--border-l)', flexShrink: 0 }}>·</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      {/* User / Process spinner */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
          {isProcessPlan ? 'Anzahl Prozesse / Bots' : 'Anzahl lizenzierter User'}
        </div>
        <SpinnerInput
          value={isProcessPlan ? paProcesses : paUsers}
          onChange={isProcessPlan ? setPaProcesses : setPaUsers}
          min={1}
          max={isProcessPlan ? 20 : 50}
        />
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
          {isProcessPlan
            ? 'Process-Plan: Jeder Bot / Prozess wird separat lizenziert'
            : 'Per-User: Jeder Mitarbeiter der PA-Flows nutzt oder ausführt braucht eine Lizenz'}
        </div>
      </div>

      {/* Add-ons */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>Add-ons</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {Object.entries(PA_ADDON_PRICES).map(([key, info]) => {
            const active = !!addons[key]
            const locked = info.requiresTier > (plan.tier || 1)
            return (
              <label
                key={key}
                onClick={() => !locked && toggleAddon(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 6, cursor: locked ? 'not-allowed' : 'pointer',
                  border: active ? `1px solid ${PA_BLUE_BORDER}` : '1px solid var(--border)',
                  background: active ? PA_BLUE_BG : locked ? 'rgba(0,0,0,.04)' : 'transparent',
                  opacity: locked ? 0.6 : 1, transition: 'all .15s', userSelect: 'none',
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: 3, flexShrink: 0,
                  border: active ? `2px solid ${PA_BLUE}` : '2px solid var(--border-l)',
                  background: active ? PA_BLUE : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {active && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>✓</span>}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: active ? 'var(--white-d)' : 'var(--muted-l)', fontWeight: 600 }}>{info.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                    {info.pricePerUser ? `+${fmt(info.pricePerUser)}/User/Mo.` : info.priceFlat ? `+${fmt(info.priceFlat)}/Mo.` : ''}
                  </div>
                  {locked && (
                    <div style={{ fontSize: 10, color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
                      Erfordert {PA_PLANS.find(p => p.tier === info.requiresTier)?.name || 'höheren Plan'}
                    </div>
                  )}
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* Live cost calculation */}
      <div style={{ padding: '16px 18px', background: 'var(--ink)', border: `1px solid ${PA_BLUE_BORDER}`, borderRadius: 8, marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: PA_BLUE, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
          Live-Kalkulation
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Lizenzen/Mo.</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--white)' }}>
              {cost.licenseMonthly === 0 ? 'Kostenlos' : fmt(cost.licenseMonthly)}
            </div>
          </div>
          {cost.aiBuilderMonthly > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>AI Builder/Mo.</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: PA_BLUE }}>{fmt(cost.aiBuilderMonthly)}</div>
            </div>
          )}
          {cost.rpaMonthly > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>RPA Attended/Mo.</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: PA_BLUE }}>{fmt(cost.rpaMonthly)}</div>
            </div>
          )}
          {cost.hostedRpaMonthly > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Hosted RPA/Mo.</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: PA_BLUE }}>{fmt(cost.hostedRpaMonthly)}</div>
            </div>
          )}
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Gesamt/Mo.</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: PA_BLUE }}>
              {cost.totalMonthly === 0 ? 'Kostenlos' : fmt(cost.totalMonthly)}
            </div>
          </div>
          {cost.totalMonthly > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Jährlich (–20%)</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--white-d)' }}>{fmt(Math.round(cost.totalYearly))}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" onClick={handleSave} loading={saving} style={{ background: PA_BLUE, borderColor: PA_BLUE }}>
          {saved ? '✓ Gespeichert' : 'Paket speichern'}
        </Button>
      </div>
    </Card>
  )
}

// ─── Member Card ──────────────────────────────────────────────────────────────

function MemberCard({ member, onTogglePage, onToggleAll, onRevoke, onCopied, copied, saving }) {
  const inviteUrl = member.invite_token
    ? `${window.location.origin}/register?token=${member.invite_token}`
    : ''

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 12,
    }}>
      {/* Member header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{
          padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
          background: member.accepted_at ? 'var(--green-d)' : 'rgba(245,158,11,.1)',
          border: member.accepted_at ? '1px solid var(--green-b)' : '1px solid rgba(245,158,11,.2)',
          color: member.accepted_at ? 'var(--green)' : 'var(--amber)',
        }}>
          {member.accepted_at ? 'Angenommen' : 'Ausstehend'}
        </div>
        {member.profiles?.display_name && (
          <span style={{ fontSize: 13, color: 'var(--white-d)', fontWeight: 600 }}>
            {member.profiles.display_name}
          </span>
        )}
        {(member.invite_email || member.profiles?.email) && (
          <span style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)' }}>
            {member.profiles?.email || member.invite_email}
          </span>
        )}
      </div>

      {/* Invite link (only if not yet accepted) */}
      {!member.accepted_at && inviteUrl && (
        <div style={{ padding: '0 16px 12px' }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--muted-l)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
            Einladungslink
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={inviteUrl}
              readOnly
              style={{
                flex: 1, padding: '8px 10px', fontSize: 11,
                background: 'var(--ink)', border: '1px solid var(--border)',
                borderRadius: 6, color: 'var(--green)', outline: 'none',
                fontFamily: 'var(--font-mono)', boxSizing: 'border-box',
              }}
            />
            <Button size="sm" variant="secondary" onClick={() => onCopied(inviteUrl)}>
              {copied === inviteUrl ? 'Kopiert!' : 'Kopieren'}
            </Button>
          </div>
        </div>
      )}

      {/* Visible pages */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--ink)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)' }}>
            Sichtbare Seiten ({(member.visible_pages || []).length}/{TOGGLEABLE_PAGES.length})
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" variant="ghost" onClick={() => onToggleAll(member.id, true)}>Alle aktivieren</Button>
            <Button size="sm" variant="ghost" onClick={() => onToggleAll(member.id, false)}>Alle deaktivieren</Button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 8 }}>
          {TOGGLEABLE_PAGES.map(({ seg, label, icon }) => {
            const active = (member.visible_pages || []).includes(seg)
            return (
              <label
                key={seg}
                onClick={() => onTogglePage(member.id, seg)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 6, cursor: 'pointer',
                  border: active ? '1px solid var(--green-b)' : '1px solid var(--border)',
                  background: active ? 'rgba(63,207,142,.04)' : 'transparent',
                  transition: 'all .15s', userSelect: 'none',
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                  border: active ? '2px solid var(--green)' : '2px solid var(--border-l)',
                  background: active ? 'var(--green)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .15s',
                }}>
                  {active && <span style={{ color: 'var(--ink)', fontSize: 11, fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, width: 16, textAlign: 'center', color: active ? 'var(--green)' : 'var(--muted)' }}>
                  {icon}
                </span>
                <span style={{ fontSize: 13, color: active ? 'var(--white-d)' : 'var(--muted-l)' }}>
                  {label}
                </span>
              </label>
            )
          })}
        </div>

        <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--ink-m)', borderRadius: 6, fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          Immer gesperrt: Angebot (€) · Intern (⊙)
        </div>
      </div>

      {/* Revoke */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="sm" variant="danger" onClick={() => onRevoke(member.id)} loading={saving}>
          Zugang entziehen
        </Button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProjectSettingsPage() {
  const { projectId } = useParams()
  const { project, update } = useProject(projectId)
  const svcType = project?.service_package?.service_type ?? 'zendesk'
  const isPA = svcType === 'power-automate'
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [copied, setCopied]   = useState('')
  const [inviteEmail, setInviteEmail] = useState('')

  const loadMembers = useCallback(async () => {
    const { data } = await supabase
      .from('project_members')
      .select('*, profiles(email, display_name)')
      .eq('project_id', projectId)
      .order('invited_at', { ascending: false })
    setMembers(data || [])
    setLoading(false)
  }, [projectId])

  useEffect(() => { loadMembers() }, [loadMembers])

  const generateInvite = async () => {
    setSaving(true)
    const { data, error } = await supabase
      .from('project_members')
      .insert([{ project_id: projectId, invite_email: inviteEmail || null, visible_pages: [] }])
      .select('*, profiles(email, display_name)')
      .single()
    if (!error && data) {
      setMembers((prev) => [data, ...prev])
      setInviteEmail('')
    }
    setSaving(false)
  }

  const togglePage = async (memberId, seg) => {
    const member = members.find((m) => m.id === memberId)
    if (!member) return
    const current = member.visible_pages || []
    const updated = current.includes(seg) ? current.filter((s) => s !== seg) : [...current, seg]
    setSaving(true)
    const { data } = await supabase.from('project_members').update({ visible_pages: updated }).eq('id', memberId).select('*, profiles(email, display_name)').single()
    if (data) setMembers((prev) => prev.map((m) => (m.id === memberId ? data : m)))
    setSaving(false)
  }

  const toggleAll = async (memberId, enable) => {
    const updated = enable ? TOGGLEABLE_PAGES.map((p) => p.seg) : []
    setSaving(true)
    const { data } = await supabase.from('project_members').update({ visible_pages: updated }).eq('id', memberId).select('*, profiles(email, display_name)').single()
    if (data) setMembers((prev) => prev.map((m) => (m.id === memberId ? data : m)))
    setSaving(false)
  }

  const revokeAccess = async (memberId) => {
    if (!window.confirm('Zugang wirklich entziehen? Der Kunde verliert sofort den Zugriff.')) return
    await supabase.from('project_members').delete().eq('id', memberId)
    setMembers((prev) => prev.filter((m) => m.id !== memberId))
  }

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(''), 2000)
  }

  if (loading) {
    return <div style={{ padding: 40, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Laden...</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
        Projekt-Einstellungen: {project?.short_name || project?.name}
      </div>

      {/* Paket-Konfiguration */}
      {project && (
        isPA ? (
          <PAPaketKonfig
            project={project}
            onSave={(pkg) => update({ service_package: { ...(project.service_package || {}), ...pkg } })}
          />
        ) : (
          <PaketKonfig
            project={project}
            onSave={(pkg) => update({ service_package: { ...(project.service_package || {}), ...pkg } })}
          />
        )
      )}

      {/* Invite new member */}
      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          Neuen Kunden einladen
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted-l)', marginBottom: 16, lineHeight: 1.5 }}>
          Generiere einen Einladungslink. Der Kunde registriert sich damit und erhält sofort Zugang.
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--muted-l)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
              Kunden-E-Mail (optional)
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="kunde@firma.de"
              style={{
                width: '100%', padding: '8px 10px', fontSize: 13,
                background: 'var(--ink)', border: '1px solid var(--border)',
                borderRadius: 6, color: 'var(--white-d)', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <Button variant="primary" onClick={generateInvite} loading={saving}>
            Einladung generieren
          </Button>
        </div>
      </Card>

      {/* Member list */}
      {members.length > 0 && (
        <Card>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
            Kunden-Zugänge ({members.length})
          </div>
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onTogglePage={togglePage}
              onToggleAll={toggleAll}
              onRevoke={revokeAccess}
              onCopied={handleCopy}
              copied={copied}
              saving={saving}
            />
          ))}
        </Card>
      )}

      {members.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 13, color: 'var(--muted-l)' }}>Noch keine Kunden für dieses Projekt eingeladen.</div>
        </Card>
      )}
    </div>
  )
}
