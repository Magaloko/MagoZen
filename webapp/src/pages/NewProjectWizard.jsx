import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects } from '../context/ProjectContext'
import { useLanguage } from '../context/LanguageContext'
import { PHASES, RISKS, DNS_RECORDS, MACROS, GOLIVELISTE, FRAGENKATALOG, DEMO_CHECKLIST, DEMO_MILESTONES, FAQ_HFK, UPSELLS, LIZENZEN } from '../data/hfkData'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

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

const STEPS = ['wizard.step.customer', 'wizard.step.plan', 'wizard.step.addons', 'wizard.step.phases', 'wizard.step.summary']

const defaultPhases = PHASES.map((p) => ({ ...p }))

function StepIndicator({ current }) {
  const { t } = useLanguage()
  return (
    <div style={{ display: 'flex', gap: 0, marginBottom: 28, overflowX: 'auto' }}>
      {STEPS.map((stepKey, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0, flex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginBottom: 6,
                background: done ? 'var(--green)' : active ? 'var(--green-d)' : 'var(--border)',
                border: active ? '2px solid var(--green)' : '2px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 700,
                color: done ? '#fff' : active ? 'var(--green)' : 'var(--muted)',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 10, color: active ? 'var(--green)' : 'var(--muted)', textAlign: 'center', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>
                {t(stepKey)}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ height: 2, flex: 1, background: done ? 'var(--green)' : 'var(--border)', marginBottom: 22, minWidth: 8 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Step 1: Customer Data ──────────────────────────────────────────────────
function StepCustomer({ data, onChange }) {
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
        {field('name', 'Firmenname', 'z.B. Herr & Frau Klein GmbH', true)}
        {field('short', 'Kürzel', 'z.B. HFK', false)}
      </div>
      {field('url', 'Shop-URL', 'z.B. herrundfrauklein.com', false)}
      {field('email', 'Support-E-Mail', 'z.B. service@firma.de', false)}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {field('hoster', 'Hoster / DNS', 'z.B. All-inkl, Strato', false)}
        {field('zendeskSubdomain', 'Zendesk Subdomain', 'z.B. firma.zendesk.com', false)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {field('jtlShop', 'JTL Shop Version', 'z.B. 5.4.2', false)}
        {field('jtlWawi', 'JTL WAWI Version', 'z.B. 1.9.4', false)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 5 }}>Markt</label>
          <select
            value={data.markt || 'DE'}
            onChange={(e) => onChange({ ...data, markt: e.target.value })}
            style={{ width: '100%', background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 5, padding: '8px 10px', fontSize: 13, color: 'var(--white)', outline: 'none' }}
          >
            <option value="DE">Deutschland</option>
            <option value="AT">Österreich</option>
            <option value="CH">Schweiz</option>
            <option value="DE/AT/CH">DE/AT/CH</option>
          </select>
        </div>
        {field('volumen', 'Tägliches Volumen', 'z.B. 40–60 Tickets/Tag', false)}
      </div>
      {field('sortiment', 'Sortiment', 'z.B. Mode, Möbel, Spielzeug', false)}
    </div>
  )
}

// ── Step 2: Zendesk Plan ───────────────────────────────────────────────────
function StepPlan({ data, onChange }) {
  const selectedPlan = ZENDESK_PLANS.find((p) => p.id === data.planId) || ZENDESK_PLANS[2]
  const monthly = (data.agentsFull || 0) * selectedPlan.price
  const savings = (data.agentsLight || 0) * selectedPlan.price

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>Plan auswählen</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
          {ZENDESK_PLANS.map((plan) => {
            const active = data.planId === plan.id
            return (
              <div
                key={plan.id}
                onClick={() => onChange({ ...data, planId: plan.id })}
                style={{
                  padding: '14px', borderRadius: 'var(--r)', cursor: 'pointer',
                  border: active ? '1px solid var(--green-b)' : '1px solid var(--border)',
                  background: active ? 'var(--green-d)' : 'var(--ink-m)',
                  transition: 'all .15s',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: active ? 'var(--green)' : 'var(--white)', marginBottom: 4 }}>€{plan.price}</div>
                <div style={{ fontSize: 12, color: active ? 'var(--green)' : 'var(--muted-l)', fontWeight: 600 }}>{plan.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>pro Agent / Mo.</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { key: 'agentsFull', label: 'Full Agents', min: 1 },
          { key: 'agentsLight', label: 'Light Agents (kostenlos)', min: 0 },
        ].map(({ key, label, min }) => (
          <div key={key}>
            <label style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 8 }}>{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', width: 'fit-content' }}>
              <button onClick={() => onChange({ ...data, [key]: Math.max(min, (data[key] || 0) - 1) })} style={{ width: 36, height: 36, background: 'var(--ink-m)', border: 'none', fontSize: 18, color: 'var(--muted-l)', cursor: 'pointer' }}>−</button>
              <div style={{ width: 44, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--white)' }}>{data[key] || 0}</div>
              <button onClick={() => onChange({ ...data, [key]: Math.min(20, (data[key] || 0) + 1) })} style={{ width: 36, height: 36, background: 'var(--ink-m)', border: 'none', fontSize: 18, color: 'var(--muted-l)', cursor: 'pointer' }}>+</button>
            </div>
          </div>
        ))}
      </div>

      {monthly > 0 && (
        <div style={{ padding: '14px 16px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 'var(--r)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>€{monthly.toLocaleString('de')}/Mo.</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{data.agentsFull || 0} Full Agents × €{selectedPlan.price}</div>
          </div>
          {savings > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--amber)' }}>−€{savings.toLocaleString('de')}/Mo. gespart</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{data.agentsLight} Light Agents (keine Lizenzkosten)</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Step 3: Add-ons ────────────────────────────────────────────────────────
function StepAddons({ data, onChange }) {
  const toggle = (id) => {
    const current = data.addons || []
    const next = current.includes(id) ? current.filter((a) => a !== id) : [...current, id]
    onChange({ ...data, addons: next })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {ADDON_OPTIONS.map((addon) => {
        const active = (data.addons || []).includes(addon.id)
        return (
          <div
            key={addon.id}
            onClick={() => toggle(addon.id)}
            style={{
              padding: '14px 16px', borderRadius: 'var(--r)', cursor: 'pointer',
              border: active ? '1px solid var(--green-b)' : '1px solid var(--border)',
              background: active ? 'var(--green-d)' : 'var(--ink-m)',
              display: 'flex', alignItems: 'center', gap: 14, transition: 'all .15s',
            }}
          >
            <div style={{ width: 20, height: 20, borderRadius: 4, border: active ? '2px solid var(--green)' : '2px solid var(--border-l)', background: active ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}>
              {active && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: active ? 'var(--green)' : 'var(--white)', marginBottom: 3 }}>{addon.label}</div>
              <div style={{ fontSize: 12, color: 'var(--muted-l)' }}>{addon.desc}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Step 4: Phases ─────────────────────────────────────────────────────────
function StepPhases({ data, onChange }) {
  const phases = data.phases || defaultPhases
  const totalH = phases.reduce((a, p) => a + (Number(p.hours) || 0), 0)
  const totalEuro = phases.reduce((a, p) => a + (Number(p.honorar) || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>
        Standard-Template wird verwendet. Honorar und Stunden können angepasst werden.
      </div>
      {phases.map((phase, i) => (
        <div key={phase.id} style={{ padding: '12px 14px', background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)' }}>{phase.title}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{phase.number}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <input
              type="number" min="1" max="80"
              value={phase.hours}
              onChange={(e) => {
                const updated = [...phases]
                updated[i] = { ...phase, hours: Number(e.target.value) || 0 }
                onChange({ ...data, phases: updated })
              }}
              style={{ width: 64, background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 5, padding: '5px 8px', fontSize: 12, color: 'var(--muted-l)', textAlign: 'right', outline: 'none', fontFamily: 'var(--font-mono)' }}
            />
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>h</span>
            <span style={{ fontSize: 13, color: 'var(--muted-l)' }}>€</span>
            <input
              type="number" min="0" step="10"
              value={phase.honorar}
              onChange={(e) => {
                const updated = [...phases]
                updated[i] = { ...phase, honorar: Number(e.target.value) || 0 }
                onChange({ ...data, phases: updated })
              }}
              style={{ width: 84, background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 5, padding: '5px 8px', fontSize: 13, color: 'var(--green)', textAlign: 'right', outline: 'none', fontFamily: 'var(--font-mono)', fontWeight: 600 }}
            />
          </div>
        </div>
      ))}
      <div style={{ padding: '10px 14px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 'var(--r)', display: 'flex', justifyContent: 'space-between', fontSize: 13, flexWrap: 'wrap', gap: 8 }}>
        <span style={{ color: 'var(--muted-l)', fontFamily: 'var(--font-mono)' }}>Gesamt: {totalH}h</span>
        <span style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>€{totalEuro.toLocaleString('de')} netto</span>
      </div>
    </div>
  )
}

// ── Step 5: Summary ────────────────────────────────────────────────────────
function StepSummary({ customer, plan, addons }) {
  const planInfo = ZENDESK_PLANS.find((p) => p.id === plan.planId)
  const selectedAddons = ADDON_OPTIONS.filter((a) => (addons.addons || []).includes(a.id))
  const monthly = (plan.agentsFull || 0) * (planInfo?.price || 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[
        {
          title: 'Kunde',
          items: [
            ['Name', customer.name || '—'],
            ['URL', customer.url || '—'],
            ['E-Mail', customer.email || '—'],
            ['Markt', customer.markt || '—'],
          ],
        },
        {
          title: 'Zendesk Plan',
          items: [
            ['Plan', planInfo?.name || '—'],
            ['Full Agents', plan.agentsFull || 0],
            ['Light Agents', plan.agentsLight || 0],
            ['Kosten/Mo.', monthly > 0 ? `€${monthly.toLocaleString('de')}` : '—'],
          ],
        },
      ].map(({ title, items }) => (
        <Card key={title} style={{ padding: '14px 16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>{title}</div>
          {items.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <span style={{ color: 'var(--muted-l)', minWidth: 120, flexShrink: 0 }}>{k}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)' }}>{String(v)}</span>
            </div>
          ))}
        </Card>
      ))}

      {selectedAddons.length > 0 && (
        <Card style={{ padding: '14px 16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>Add-ons</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {selectedAddons.map((a) => <Badge key={a.id} color="green">{a.label}</Badge>)}
          </div>
        </Card>
      )}
    </div>
  )
}

// ── Main Wizard ─────────────────────────────────────────────────────────────
export default function NewProjectWizard() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { createProject } = useProjects()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [customer, setCustomer] = useState({ name: '', short: '', url: '', email: '', hoster: '', zendeskSubdomain: '', jtlShop: '', jtlWawi: '', markt: 'DE', volumen: '', sortiment: '' })
  const [plan, setPlan] = useState({ planId: 'professional', agentsFull: 4, agentsLight: 2 })
  const [addons, setAddons] = useState({ addons: [] })
  const [phases, setPhases] = useState({ phases: defaultPhases })

  const canNext = step === 0 ? !!customer.name.trim() : true

  const handleCreate = async () => {
    setSaving(true)
    setError(null)
    try {
      const planInfo = ZENDESK_PLANS.find((p) => p.id === plan.planId)
      const projectData = {
        name: customer.name.trim(),
        short_name: customer.short.trim() || customer.name.slice(0, 3).toUpperCase(),
        status: 'planning',
        customer_data: {
          ...customer,
          branding: {},
        },
        service_package: {
          plan: planInfo?.name || 'Suite Professional',
          plan_price_per_agent: planInfo?.price || 115,
          agents_full: plan.agentsFull || 0,
          agents_light: plan.agentsLight || 0,
          addons: addons.addons || [],
          phases: phases.phases || defaultPhases,
          risks: RISKS,
          dns_records: DNS_RECORDS,
          macros: MACROS,
          goliveliste: GOLIVELISTE,
          fragenkatalog: FRAGENKATALOG,
          demo_checklist: DEMO_CHECKLIST,
          demo_milestones: DEMO_MILESTONES,
          faq: FAQ_HFK,
          upsells: UPSELLS,
          lizenzen: LIZENZEN,
        },
        settings: {
          timezone: 'Wien UTC+1/+2',
          language: 'de',
          notes: '',
        },
      }
      const newProject = await createProject(projectData)
      navigate(`/projects/${newProject.id}`)
    } catch (err) {
      setError(err?.message || 'Fehler beim Erstellen des Projekts')
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>
          {t('title.newProject')}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--white)', margin: 0 }}>
          {t(STEPS[step])}
        </h1>
      </div>

      <StepIndicator current={step} />

      <Card style={{ marginBottom: 20 }}>
        {step === 0 && <StepCustomer data={customer} onChange={setCustomer} />}
        {step === 1 && <StepPlan data={plan} onChange={setPlan} />}
        {step === 2 && <StepAddons data={addons} onChange={setAddons} />}
        {step === 3 && <StepPhases data={phases} onChange={setPhases} />}
        {step === 4 && <StepSummary customer={customer} plan={plan} addons={addons} />}
      </Card>

      {error && (
        <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 6, color: 'var(--red)', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <Button
          variant="ghost"
          onClick={() => step > 0 ? setStep(step - 1) : navigate('/')}
        >
          {t('wizard.back')}
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canNext}>
            {t('wizard.next')}
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={saving || !customer.name.trim()}>
            {saving ? t('wizard.creating') : t('wizard.create')}
          </Button>
        )}
      </div>
    </div>
  )
}
