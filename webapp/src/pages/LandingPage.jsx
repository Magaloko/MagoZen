import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  page:    '#F5F7FA',
  surface: '#FFFFFF',
  border:  '#E2E8F0',
  text:    '#1C2536',
  sub:     '#374151',
  muted:   '#64748B',
  green:   '#5C7A6A',
  greenBg: 'rgba(92,122,106,0.07)',
  greenBd: 'rgba(92,122,106,0.20)',
  blue:    '#0078D4',
  blueBg:  'rgba(0,120,212,0.07)',
  blueBd:  'rgba(0,120,212,0.20)',
}

// ── Injected CSS ──────────────────────────────────────────────────────────────
const CSS = `
  @keyframes lp-pulse      { 0%,100%{opacity:1;transform:scale(1)}  50%{opacity:.2;transform:scale(.6)} }
  @keyframes lp-pulse-ring { 0%{transform:scale(.85);opacity:.65} 100%{transform:scale(2.4);opacity:0} }
  @media (max-width:700px) {
    .lp-steps-grid  { grid-template-columns:1fr !important; }
    .lp-step-arrow  { display:none !important; }
    .lp-kconf-grid  { grid-template-columns:1fr !important; }
    .lp-zd-plans    { grid-template-columns:1fr 1fr !important; }
  }
`

// ── Konfigurator data ─────────────────────────────────────────────────────────
const KZD_PLANS = [
  { id: 'team',         name: 'Team',         sub: 'Einstieg'         },
  { id: 'growth',       name: 'Growth',       sub: 'Wachstum'         },
  { id: 'professional', name: 'Professional', sub: 'Empfohlen', popular: true },
  { id: 'enterprise',   name: 'Enterprise',   sub: 'Großbetrieb'      },
]

const KZD_ADDONS = [
  { id: 'jtl',      label: 'JTL Integration',  pricePer: 'agent', price: 15, desc: 'Shop & WAWI' },
  { id: 'copilot',  label: 'AI Copilot',        pricePer: 'agent', price: 50, desc: 'KI-Antwortvorschläge' },
  { id: 'whatsapp', label: 'WhatsApp Business', pricePer: 'flat',  price: 10, desc: 'Meta-Kanal' },
  { id: 'livechat', label: 'Live Chat Widget',  pricePer: 'free',  price: 0,  desc: 'inklusive' },
]

const KPA_ADDONS = [
  { id: 'jtl',       label: 'JTL Connector',  pricePer: 'custom', price: 0,  desc: 'Custom-Entwicklung' },
  { id: 'aiBuilder', label: 'AI Builder',      pricePer: 'user',   price: 10, desc: 'OCR, Klassifizierung' },
  { id: 'rpa',       label: 'RPA Attended',    pricePer: 'user',   price: 15, desc: 'Legacy-Systeme' },
]

// ── Animation hooks ───────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function useCounter(target, active, duration = 1400) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf, start
    const tick = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])
  return val
}

// ── Shared UI atoms ───────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView(0.1)
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  )
}

function StatItem({ value, label, border }) {
  const [ref, inView] = useInView()
  const isPercent = value.endsWith('%')
  const num = parseInt(value, 10)
  const counted = useCounter(num, inView)
  return (
    <div ref={ref} style={{ padding: '26px 20px', textAlign: 'center', borderRight: border ? `1px solid ${C.border}` : 'none' }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: C.green, letterSpacing: -0.8 }}>
        {isPercent ? `${counted}%` : String(counted)}
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{label}</div>
    </div>
  )
}

function FlowArrow({ inView, delay = 0 }) {
  return (
    <div className="lp-step-arrow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
      <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
        <path d="M2 12 H38" stroke={C.greenBd} strokeWidth="2" strokeLinecap="round"
          strokeDasharray="36" strokeDashoffset={inView ? 0 : 36}
          style={{ transition: `stroke-dashoffset 0.65s ease ${delay}ms` }}/>
        <path d="M31 6 L39 12 L31 18" stroke={C.greenBd} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="18" strokeDashoffset={inView ? 0 : 18}
          style={{ transition: `stroke-dashoffset 0.4s ease ${delay + 450}ms` }}/>
      </svg>
    </div>
  )
}

// ── Hero animated automation flow ────────────────────────────────────────────
function HeroFlow() {
  const FLOW_STEPS = [
    { label: 'E-Mail',     sub: 'Ticket eingeht',      Icon: IcoMsg,     color: C.green  },
    { label: 'Zendesk',   sub: 'Erfasst & geroutet',  Icon: IcoHeadset, color: C.green  },
    { label: 'JTL',       sub: 'Bestelldaten sync',   Icon: IcoServer,  color: C.green  },
    { label: 'AI Copilot',sub: 'Antwort vorschlagen', Icon: IcoChart,   color: '#7C3AED' },
    { label: 'Gelöst',    sub: 'Ticket geschlossen',  Icon: IcoCheckSq, color: C.green  },
  ]
  const [active, setActive] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % FLOW_STEPS.length), 1600)
    return () => clearInterval(t)
  }, [])

  const items = []
  FLOW_STEPS.forEach((step, i) => {
    const isActive = i === active
    const isDone   = i < active
    items.push(
      <div key={step.label} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        padding: '8px 10px', borderRadius: 10,
        border: `1.5px solid ${isActive ? step.color : 'transparent'}`,
        background: isActive ? 'rgba(92,122,106,0.07)' : 'transparent',
        transform: isActive ? 'translateY(-3px)' : 'none',
        transition: 'all 0.35s ease',
        minWidth: 68,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isActive ? step.color : isDone ? C.greenBg : 'transparent',
          border: `1.5px solid ${isActive ? 'transparent' : isDone ? C.greenBd : C.border}`,
          transition: 'all 0.35s ease',
          boxShadow: isActive ? `0 4px 14px ${step.color}44` : 'none',
        }}>
          <step.Icon size={14} color={isActive ? '#fff' : isDone ? C.green : C.muted} sw={1.8}/>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: isActive ? step.color : isDone ? C.sub : C.muted, whiteSpace: 'nowrap', transition: 'color 0.35s' }}>{step.label}</div>
        <div style={{ fontSize: 9, color: isActive ? step.color : C.muted, opacity: isActive ? 0.8 : 0.5, whiteSpace: 'nowrap', transition: 'all 0.35s' }}>{step.sub}</div>
      </div>
    )
    if (i < FLOW_STEPS.length - 1) {
      items.push(
        <svg key={`a${i}`} width="18" height="12" viewBox="0 0 18 12" fill="none" style={{ flexShrink: 0, marginTop: -12 }}>
          <path d="M1 6 H14 M10 2 L15 6 L10 10"
            stroke={i < active ? C.green : C.border}
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'stroke 0.35s ease' }}/>
        </svg>
      )
    }
  })

  return (
    <div style={{ marginTop: 44, display: 'flex', justifyContent: 'center' }}>
      <div style={{
        background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(10px)',
        border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 18px',
        display: 'inline-flex', alignItems: 'center', gap: 2,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 10, flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'block', animation: 'lp-pulse 2s ease-in-out infinite' }}/>
          <span style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Live</span>
        </div>
        {items}
      </div>
    </div>
  )
}

function StepCard({ s }) {
  return (
    <div style={{ padding: '28px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.page, height: '100%', boxSizing: 'border-box' }}>
      <div style={{ width: 30, height: 30, background: C.greenBg, border: `1px solid ${C.greenBd}`, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: C.green, marginBottom: 16, fontFamily: "'IBM Plex Mono', monospace" }}>
        {s.n}
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{s.title}</div>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
    </div>
  )
}

// ── Konfigurator component ────────────────────────────────────────────────────
function Konfigurator() {
  const [svcZd, setSvcZd] = useState(true)
  const [svcPa, setSvcPa] = useState(false)

  const [zdPlan, setZdPlan] = useState('professional')
  const [zdAgents, setZdAgents] = useState(4)
  const [zdAddons, setZdAddons] = useState(new Set())

  const [paPlan, setPaPlan] = useState('peruser')
  const [paUsers, setPaUsers] = useState(4)
  const [paAddons, setPaAddons] = useState(new Set())

  const [reqName, setReqName]   = useState('')
  const [reqEmail, setReqEmail] = useState('')
  const [sent, setSent]         = useState(false)

  const toggleSet = (setFn, id) => setFn(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  // Build mailto body from config
  const buildMailto = () => {
    const lines = [`Anfrage von: ${reqName}`, `E-Mail: ${reqEmail}`, '', '--- Konfiguration ---']
    if (svcZd) {
      const plan = KZD_PLANS.find(p => p.id === zdPlan)
      lines.push(`Zendesk Suite – Plan: ${plan?.name}, Agenten: ${zdAgents}`)
      if (zdAddons.size) lines.push(`  Add-ons: ${[...zdAddons].map(id => KZD_ADDONS.find(x => x.id === id)?.label).join(', ')}`)
    }
    if (svcPa) {
      const plan = paPlan === 'peruser' ? 'Per User Premium' : 'Per Flow Process'
      lines.push(`Power Automate – Plan: ${plan}, ${paPlan === 'peruser' ? 'Nutzer' : 'Flows'}: ${paUsers}`)
      if (paAddons.size) lines.push(`  Add-ons: ${[...paAddons].map(id => KPA_ADDONS.find(x => x.id === id)?.label).join(', ')}`)
    }
    lines.push('', 'Bitte erstellen Sie mir ein individuelles Angebot.')
    const body = encodeURIComponent(lines.join('\n'))
    const subject = encodeURIComponent('Projektanfrage – Zendesk / Power Automate Setup')
    return `mailto:service@herrundfrauklein.zendesk.com?subject=${subject}&body=${body}`
  }

  const canSend = (svcZd || svcPa) && reqName.trim() && reqEmail.includes('@')

  // Shared checkbox row
  const AddonRow = ({ a, active, accent, accentBd, accentBg, onToggle }) => (
    <div onClick={onToggle} style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
      border: `1px solid ${active ? accentBd : C.border}`, borderRadius: 8, cursor: 'pointer',
      background: active ? accentBg : C.surface, transition: 'all 0.18s',
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
        border: `2px solid ${active ? accent : C.border}`,
        background: active ? accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.18s',
      }}>
        {active && <IcoCheck size={9} color="#fff" sw={3}/>}
      </div>
      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: 600, fontSize: 13 }}>{a.label}</span>
        <span style={{ color: C.muted, fontSize: 12, marginLeft: 8 }}>{a.desc}</span>
      </div>
      {a.pricePer === 'free' && (
        <div style={{ fontSize: 11, fontWeight: 700, color: C.green, whiteSpace: 'nowrap' }}>inklusive</div>
      )}
    </div>
  )

  // Stepper button
  const Stepper = ({ val, setVal }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button onClick={() => setVal(v => Math.max(1, v - 1))} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.border}`, background: C.surface, cursor: 'pointer', fontWeight: 700, fontSize: 16, color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
      <span style={{ width: 28, textAlign: 'center', fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", fontSize: 15 }}>{val}</span>
      <button onClick={() => setVal(v => v + 1)} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.border}`, background: C.surface, cursor: 'pointer', fontWeight: 700, fontSize: 16, color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
    </div>
  )

  // Section label
  const Label = ({ children }) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{children}</div>
  )

  return (
    <section style={{ background: C.page, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '64px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionHead
          title="Was brauchen Sie?"
          sub="Stellen Sie Ihre gewünschte Konfiguration zusammen — wir erstellen Ihnen ein individuelles Angebot."
        />

        <div className="lp-kconf-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, alignItems: 'start' }}>

          {/* LEFT: Configuration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Step 1: Service toggles */}
            <div>
              <Label>1 · Dienste wählen</Label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { key: 'zd', val: svcZd, set: setSvcZd, accent: C.green, accentBg: C.greenBg, accentBd: C.greenBd, title: 'Zendesk Suite', sub: 'Customer Support' },
                  { key: 'pa', val: svcPa, set: setSvcPa, accent: C.blue,  accentBg: C.blueBg,  accentBd: C.blueBd,  title: 'Power Automate', sub: 'Automatisierung' },
                ].map(s => (
                  <div key={s.key} onClick={() => s.set(!s.val)} style={{
                    border: `2px solid ${s.val ? s.accent : C.border}`, borderRadius: 10,
                    padding: '14px 16px', cursor: 'pointer',
                    background: s.val ? s.accentBg : C.surface,
                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                      border: `2px solid ${s.val ? s.accent : C.border}`,
                      background: s.val ? s.accent : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}>
                      {s.val && <IcoCheck size={11} color="#fff" sw={3}/>}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: s.val ? s.accent : C.text }}>{s.title}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Zendesk config */}
            {svcZd && (
              <div>
                <Label>2 · Zendesk Plan & Agenten</Label>
                <div className="lp-zd-plans" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
                  {KZD_PLANS.map(plan => (
                    <div key={plan.id} onClick={() => setZdPlan(plan.id)} style={{
                      border: `2px solid ${zdPlan === plan.id ? C.green : C.border}`,
                      borderRadius: 8, padding: '10px 8px', cursor: 'pointer',
                      background: zdPlan === plan.id ? C.greenBg : C.surface,
                      textAlign: 'center', position: 'relative', transition: 'all 0.2s',
                    }}>
                      {plan.popular && (
                        <div style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)', background: C.green, color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, whiteSpace: 'nowrap' }}>Beliebt</div>
                      )}
                      <div style={{ fontWeight: 700, fontSize: 12, color: zdPlan === plan.id ? C.green : C.text }}>{plan.name}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{plan.sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, color: C.sub, flex: 1 }}>Anzahl Agenten</span>
                  <Stepper val={zdAgents} setVal={setZdAgents}/>
                </div>

                <div style={{ marginTop: 20 }}>
                  <Label>Zendesk Add-ons</Label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {KZD_ADDONS.map(a => (
                      <AddonRow key={a.id} a={a} active={zdAddons.has(a.id)}
                        accent={C.green} accentBd={C.greenBd} accentBg={C.greenBg}
                        onToggle={() => toggleSet(setZdAddons, a.id)}/>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2b: Power Automate config */}
            {svcPa && (
              <div>
                <Label>{svcZd ? '3 · Power Automate Plan & Nutzer' : '2 · Power Automate Plan & Nutzer'}</Label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                  {[
                    { id: 'peruser', name: 'Per User Premium', sub: 'Nutzerbasiert' },
                    { id: 'process', name: 'Per Flow Process',  sub: 'Prozessbasiert' },
                  ].map(plan => (
                    <div key={plan.id} onClick={() => setPaPlan(plan.id)} style={{
                      border: `2px solid ${paPlan === plan.id ? C.blue : C.border}`,
                      borderRadius: 8, padding: '12px', cursor: 'pointer',
                      background: paPlan === plan.id ? C.blueBg : C.surface, transition: 'all 0.2s',
                    }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: paPlan === plan.id ? C.blue : C.text }}>{plan.name}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{plan.sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, color: C.sub, flex: 1 }}>{paPlan === 'peruser' ? 'Anzahl Nutzer' : 'Anzahl Flows'}</span>
                  <Stepper val={paUsers} setVal={setPaUsers}/>
                </div>

                <div style={{ marginTop: 20 }}>
                  <Label>Power Automate Add-ons</Label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {KPA_ADDONS.map(a => (
                      <AddonRow key={a.id} a={a} active={paAddons.has(a.id)}
                        accent={C.blue} accentBd={C.blueBd} accentBg={C.blueBg}
                        onToggle={() => toggleSet(setPaAddons, a.id)}/>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!svcZd && !svcPa && (
              <div style={{ padding: '24px', border: `1px dashed ${C.border}`, borderRadius: 10, textAlign: 'center', color: C.muted, fontSize: 14 }}>
                Bitte wählen Sie mindestens einen Dienst aus.
              </div>
            )}
          </div>

          {/* RIGHT: Inquiry panel */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>

              {/* Config summary */}
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>Ihre Auswahl</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {svcZd && (
                  <div style={{ background: C.greenBg, border: `1px solid ${C.greenBd}`, borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: C.green }}>Zendesk Suite</div>
                    <div style={{ fontSize: 12, color: C.sub, marginTop: 3 }}>
                      Plan: {KZD_PLANS.find(p => p.id === zdPlan)?.name} · {zdAgents} {zdAgents === 1 ? 'Agent' : 'Agenten'}
                    </div>
                    {zdAddons.size > 0 && (
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                        + {[...zdAddons].map(id => KZD_ADDONS.find(x => x.id === id)?.label).join(', ')}
                      </div>
                    )}
                  </div>
                )}
                {svcPa && (
                  <div style={{ background: C.blueBg, border: `1px solid ${C.blueBd}`, borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: C.blue }}>Power Automate</div>
                    <div style={{ fontSize: 12, color: C.sub, marginTop: 3 }}>
                      {paPlan === 'peruser' ? 'Per User Premium' : 'Per Flow Process'} · {paUsers} {paPlan === 'peruser' ? 'Nutzer' : 'Flows'}
                    </div>
                    {paAddons.size > 0 && (
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                        + {[...paAddons].map(id => KPA_ADDONS.find(x => x.id === id)?.label).join(', ')}
                      </div>
                    )}
                  </div>
                )}
                {!svcZd && !svcPa && (
                  <div style={{ color: C.muted, fontSize: 13, textAlign: 'center', padding: '12px 0', fontStyle: 'italic' }}>
                    Bitte wählen Sie links einen Dienst aus.
                  </div>
                )}
              </div>

              <div style={{ height: 1, background: C.border, marginBottom: 18 }}/>

              {/* Contact fields */}
              {!sent ? (
                <>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Kontakt für Rückmeldung</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                    <input
                      type="text" placeholder="Ihr Name"
                      value={reqName} onChange={e => setReqName(e.target.value)}
                      style={{ border: `1px solid ${C.border}`, borderRadius: 7, padding: '9px 12px', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box', color: C.text, background: C.surface }}
                    />
                    <input
                      type="email" placeholder="E-Mail-Adresse"
                      value={reqEmail} onChange={e => setReqEmail(e.target.value)}
                      style={{ border: `1px solid ${C.border}`, borderRadius: 7, padding: '9px 12px', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box', color: C.text, background: C.surface }}
                    />
                  </div>
                  <a
                    href={canSend ? buildMailto() : undefined}
                    onClick={canSend ? () => setSent(true) : undefined}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      background: canSend ? C.green : C.border,
                      color: '#fff', padding: '11px 16px', borderRadius: 7,
                      fontSize: 13, fontWeight: 700, textDecoration: 'none',
                      width: '100%', boxSizing: 'border-box',
                      cursor: canSend ? 'pointer' : 'not-allowed',
                      transition: 'background 0.2s',
                    }}
                  >
                    Anfrage senden <IcoArrow size={14} color="#fff" sw={2.2}/>
                  </a>
                  <div style={{ marginTop: 12, fontSize: 11, color: C.muted, textAlign: 'center', lineHeight: 1.6 }}>
                    Kein Pauschalpreis. Wir analysieren Ihre Anforderungen<br/>und erstellen ein individuelles Angebot.
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.greenBg, border: `1px solid ${C.greenBd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <IcoCheckSq size={20} color={C.green} sw={1.8}/>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 6 }}>Anfrage vorbereitet!</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                    Ihr E-Mail-Programm wurde geöffnet.<br/>Wir melden uns innerhalb von 24 Stunden.
                  </div>
                  <button onClick={() => setSent(false)} style={{ marginTop: 14, fontSize: 12, color: C.green, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    Neue Anfrage
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ── SVG icon helper ───────────────────────────────────────────────────────────
function Ico({ children, size = 18, color = 'currentColor', sw = 1.7, style = {} }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}>
      {children}
    </svg>
  )
}

// ── Icon definitions ──────────────────────────────────────────────────────────
const IcoLayers  = (p) => (<Ico {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></Ico>)
const IcoCheckSq = (p) => (<Ico {...p}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></Ico>)
const IcoShield  = (p) => (<Ico {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Ico>)
const IcoUser    = (p) => (<Ico {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Ico>)
const IcoMsg     = (p) => (<Ico {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Ico>)
const IcoChart   = (p) => (<Ico {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></Ico>)
const IcoServer  = (p) => (<Ico {...p}><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></Ico>)
const IcoFile    = (p) => (<Ico {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></Ico>)
const IcoHeadset = (p) => (<Ico {...p}><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></Ico>)
const IcoFlow    = (p) => (<Ico {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></Ico>)
const IcoSliders = (p) => (<Ico {...p}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></Ico>)
const IcoCheck   = (p) => (<Ico {...p}><polyline points="20 6 9 17 4 12"/></Ico>)
const IcoArrow   = (p) => (<Ico {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Ico>)

// ── Static page data ──────────────────────────────────────────────────────────
const SERVICES = [
  {
    Icon: IcoHeadset, name: 'Zendesk Suite', sub: 'Customer Support Platform',
    accent: C.green, bg: C.greenBg, bd: C.greenBd,
    features: ['Tickets, E-Mail, Chat & Voice', 'SLA-Management & Eskalationsregeln', 'Help Center & mehrsprachiger FAQ', 'JTL Shop- & WAWI-Integration', 'KI Copilot & erweiterte Analytics', 'Multi-Brand Support'],
  },
  {
    Icon: IcoFlow, name: 'Power Automate', sub: 'Microsoft Automation Platform',
    accent: C.blue, bg: C.blueBg, bd: C.blueBd,
    features: ['Cloud Flows (Automated & Scheduled)', 'JTL Custom Connector', 'Outlook, Teams & SharePoint', 'Fehlerbehandlung & Run-Monitoring', 'RPA & Desktop-Automatisierung', 'Schulung & Dokumentation'],
  },
]

const STEPS = [
  { n: '1', title: 'Projekt anlegen',           desc: 'Dienst-Typ wählen, Kundendaten eingeben, Plan konfigurieren. Wizard-geführt in unter fünf Minuten.' },
  { n: '2', title: 'Phasen & Aufgaben verwalten', desc: 'Vorgefertigte Projektphasen direkt einsatzbereit. Aufgaben abhaken, Stunden tracken, Fortschritt sehen.' },
  { n: '3', title: 'Kunden einbinden',           desc: 'Kunden erhalten einen eigenen Login und sehen Projektstand, FAQ und offene Fragen direkt im Tool.' },
]

const APP_FEATURES = [
  { Icon: IcoLayers,  label: 'Projektphasen',     desc: 'Phasen mit Aufgaben, Stunden-Tracking und Fortschrittsanzeige.' },
  { Icon: IcoCheckSq, label: 'Go-Live Checkliste', desc: 'Alle Punkte strukturiert vor dem Launch abhaken.' },
  { Icon: IcoShield,  label: 'Risikomanagement',   desc: 'Risiken erfassen, bewerten und mit Maßnahmen hinterlegen.' },
  { Icon: IcoUser,    label: 'Kundenportal',        desc: 'Kunden sehen ihren Projektstand mit eigenem Zugang.' },
  { Icon: IcoMsg,     label: 'Fragen & FAQ',        desc: 'Offene Kundenfragen sammeln und strukturiert beantworten.' },
  { Icon: IcoChart,   label: 'Dashboard',           desc: 'Überblick über Phasen, Checkliste und nächste Schritte.' },
  { Icon: IcoServer,  label: 'DNS / Umgebungen',    desc: 'DNS-Einträge oder Power Platform Umgebungen dokumentieren.' },
  { Icon: IcoFile,    label: 'Angebot & Intern',    desc: 'Angebotsdetails, Upsells und internes Briefing für Admins.' },
]

// ── Public FAQ data ───────────────────────────────────────────────────────────
const FAQ_PUBLIC = [
  {
    q: 'Für welche Unternehmen sind Ihre Dienstleistungen geeignet?',
    a: 'Unsere Implementierungsleistungen richten sich an mittelständische Unternehmen im E-Commerce-Bereich, die ihren Kundenservice professionalisieren und Betriebsabläufe automatisieren möchten. Wir beraten Sie in einem kostenlosen Erstgespräch, ob und welches Setup zu Ihrer Situation passt.',
  },
  {
    q: 'Wie lange dauert eine typische Implementierung?',
    a: 'Der zeitliche Rahmen wird nach einer detaillierten Anforderungsanalyse gemeinsam festgelegt. Wir arbeiten phasenbasiert — von der initialen Konfiguration bis zum Go-Live — mit klaren Meilensteinen und einem dedizierten Ansprechpartner für Ihr Team.',
  },
  {
    q: 'Werden bestehende Systeme wie JTL integriert?',
    a: 'Ja. Die Integration bestehender Systeme — darunter JTL Shopsystem und JTL WAWI — ist zentraler Bestandteil unserer Zendesk-Implementierungen. Bestelldaten, Lieferstatus und Kundendaten werden direkt im Ticket verfügbar, ohne manuelle Nachschlageaufgaben.',
  },
  {
    q: 'Was ist im Projektpreis enthalten?',
    a: 'Im Projektpreis sind Konfiguration, Integration, Schulung aller Beteiligten und eine Nachbetreuungsphase enthalten. Plattformlizenzkosten (Zendesk, Microsoft) werden separat und direkt mit dem jeweiligen Anbieter abgerechnet. Nach einer kostenlosen Erstanalyse erhalten Sie ein transparentes, individuelles Angebot.',
  },
  {
    q: 'Muss unser Team technisch versiert sein?',
    a: 'Nein. Unser Ziel ist es, dass Ihr Team nach der Implementierung vollständig selbstständig arbeiten kann. Wir schulen alle Beteiligten und stellen kompakte Dokumentation bereit. Die Systeme werden so konfiguriert, dass der laufende Betrieb ohne IT-Kenntnisse möglich ist.',
  },
  {
    q: 'Wie werden unsere Kundendaten geschützt?',
    a: 'Alle eingesetzten Plattformen erfüllen die Anforderungen der DSGVO. Zendesk betreibt Rechenzentren innerhalb der EU und bietet Auftragsverarbeitungsverträge gemäß Art. 28 DSGVO. Wir unterstützen Sie bei der datenschutzkonformen Konfiguration aller relevanten Einstellungen.',
  },
  {
    q: 'Was passiert nach dem Go-Live?',
    a: 'Nach dem Go-Live steht Ihnen eine Nachbetreuungsphase zur Verfügung. Für eine langfristige Begleitung bieten wir optional Betreuungsverträge an, die Systemwartung, Anpassungen an sich ändernde Anforderungen und priorisierten Support umfassen.',
  },
  {
    q: 'Wann ist Power Automate sinnvoll?',
    a: 'Power Automate eignet sich für Unternehmen, die repetitive Abläufe systemübergreifend automatisieren möchten. Im E-Commerce ermöglicht es unter anderem automatisierte Auftragsverarbeitung, Benachrichtigungen, Datenabgleiche zwischen Systemen sowie Dokumentenverarbeitung — ohne Programmieraufwand.',
  },
]

// ── FAQ accordion item ────────────────────────────────────────────────────────
function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false)
  return (
    <FadeIn delay={index * 40}>
      <div style={{
        border: `1px solid ${open ? C.greenBd : C.border}`, borderRadius: 10,
        overflow: 'hidden', background: C.surface, transition: 'border-color 0.2s',
      }}>
        <button onClick={() => setOpen(!open)} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}>
          <span style={{ width: 24, height: 24, borderRadius: 6, background: open ? C.greenBg : C.page, border: `1px solid ${open ? C.greenBd : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
            <span style={{ fontSize: 14, color: open ? C.green : C.muted, lineHeight: 1, fontWeight: 700 }}>{open ? '−' : '+'}</span>
          </span>
          <span style={{ fontWeight: 600, fontSize: 15, color: open ? C.text : C.sub, flex: 1 }}>{item.q}</span>
        </button>
        {open && (
          <div style={{ padding: '0 20px 18px 58px', borderTop: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, margin: '14px 0 0' }}>{item.a}</p>
          </div>
        )}
      </div>
    </FadeIn>
  )
}

// ── Layout helpers ────────────────────────────────────────────────────────────
function Section({ children, style = {}, id }) {
  return (
    <section id={id} style={{ padding: '64px 24px', ...style }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>{children}</div>
    </section>
  )
}

function SectionHead({ title, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 44 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.7, color: C.text, marginBottom: 10 }}>{title}</h2>
      {sub && <p style={{ color: C.muted, fontSize: 15 }}>{sub}</p>}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [hoveredSvc, setHoveredSvc] = useState(null)
  const [stepsRef, stepsInView] = useInView(0.2)

  return (
    <div style={{ background: C.page, minHeight: '100vh', fontFamily: "'IBM Plex Sans', system-ui, sans-serif", color: C.text, fontSize: 15, lineHeight: 1.6 }}>
      <style>{CSS}</style>

      {/* NAV */}
      <header style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 58, display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: C.green, letterSpacing: -0.3, userSelect: 'none' }}>
            Projekt<span style={{ color: C.text, fontWeight: 600 }}>Tool</span>
          </span>
          <div style={{ flex: 1 }} />
          <Link to="/rechner" style={{ fontSize: 13, color: C.muted, textDecoration: 'none' }}>Rechner</Link>
          <a href="#faq"      style={{ fontSize: 13, color: C.muted, textDecoration: 'none', fontWeight: 500 }}>FAQ</a>
          <Link to="/login"   style={{ fontSize: 13, color: C.text, padding: '7px 14px', border: `1px solid ${C.border}`, borderRadius: 6, textDecoration: 'none', fontWeight: 500 }}>Anmelden</Link>
          <Link to="/register" style={{ fontSize: 13, color: '#fff', background: C.green, padding: '7px 16px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>Account anlegen</Link>
        </div>
      </header>

      {/* HERO — dot grid + pulse badge */}
      <section style={{ position: 'relative', background: 'linear-gradient(160deg, #EFF6F3 0%, #FFFFFF 65%)', padding: '80px 24px 72px', textAlign: 'center', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(92,122,106,0.13) 1px, transparent 1px)', backgroundSize: '28px 28px' }}/>
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.greenBg, border: `1px solid ${C.greenBd}`, borderRadius: 20, padding: '5px 14px', fontSize: 12, color: C.green, fontWeight: 600, letterSpacing: 0.4, marginBottom: 28 }}>
            <span style={{ position: 'relative', width: 8, height: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: C.green, opacity: 0.5, animation: 'lp-pulse-ring 2s ease-out infinite' }}/>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.green, display: 'block', animation: 'lp-pulse 2s ease-in-out infinite' }}/>
            </span>
            Zendesk · Power Automate · JTL
          </div>
          <h1 style={{ fontSize: 'clamp(30px, 5.5vw, 52px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -1.6, marginBottom: 20, color: C.text }}>
            Implementierungs-Projekte,<br/>
            <span style={{ color: C.green }}>die reibungslos laufen.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.75, maxWidth: 500, margin: '0 auto 36px' }}>
            Das Projekt-Tool für Zendesk Suite und Microsoft Power Automate Rollouts —
            mit Phasen, Checklisten und Kundenportal.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ background: C.green, color: '#fff', padding: '12px 26px', borderRadius: 7, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              Kostenlos starten <IcoArrow size={15} color="#fff" sw={2.2}/>
            </Link>
            <Link to="/rechner" style={{ background: C.surface, color: C.text, padding: '12px 26px', borderRadius: 7, fontSize: 14, fontWeight: 600, textDecoration: 'none', border: `1px solid ${C.border}` }}>
              Lizenzrechner
            </Link>
          </div>
          <HeroFlow />
        </div>
      </section>

      {/* STATS — animated counters */}
      <section style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { value: '2',    label: 'Service-Typen' },
              { value: '5',    label: 'Projektphasen' },
              { value: '12',   label: 'Go-Live Punkte' },
              { value: '100%', label: 'Kundenportal inklusive' },
            ].map((s, i, arr) => (
              <StatItem key={i} value={s.value} label={s.label} border={i < arr.length - 1}/>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES — FadeIn + hover lift */}
      <Section>
        <SectionHead title="Zwei Dienste. Ein Tool." sub="Für Zendesk Suite und Microsoft Power Automate — beide vollständig unterstützt."/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {SERVICES.map((svc, i) => (
            <FadeIn key={svc.name} delay={i * 120} style={{ height: '100%' }}>
              <div
                onMouseEnter={() => setHoveredSvc(svc.name)}
                onMouseLeave={() => setHoveredSvc(null)}
                style={{
                  background: C.surface, borderRadius: 12, padding: 32, cursor: 'default',
                  height: '100%', boxSizing: 'border-box',
                  border: `1px solid ${hoveredSvc === svc.name ? svc.accent : svc.bd}`,
                  transform: hoveredSvc === svc.name ? 'translateY(-5px)' : 'translateY(0)',
                  boxShadow: hoveredSvc === svc.name ? '0 16px 40px rgba(0,0,0,0.08)' : 'none',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                  <div style={{ width: 46, height: 46, background: svc.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svc.Icon size={22} color={svc.accent} sw={1.6}/>
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>{svc.name}</div>
                    <div style={{ color: svc.accent, fontSize: 11, fontWeight: 600, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{svc.sub}</div>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {svc.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: C.sub }}>
                      <IcoCheck size={14} color={svc.accent} sw={2.4} style={{ marginTop: 3, flexShrink: 0 }}/>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* KONFIGURATOR */}
      <Konfigurator/>

      {/* HOW IT WORKS — animated flow arrows */}
      <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '64px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHead title="So funktioniert es" sub="Vom ersten Kundengespräch bis zum Go-Live — strukturiert und nachvollziehbar."/>
          <div ref={stepsRef} className="lp-steps-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '0 12px', alignItems: 'center' }}>
            <FadeIn delay={0}><StepCard s={STEPS[0]}/></FadeIn>
            <FlowArrow inView={stepsInView} delay={150}/>
            <FadeIn delay={150}><StepCard s={STEPS[1]}/></FadeIn>
            <FlowArrow inView={stepsInView} delay={450}/>
            <FadeIn delay={300}><StepCard s={STEPS[2]}/></FadeIn>
          </div>
        </div>
      </section>

      {/* FEATURES — staggered FadeIn */}
      <Section>
        <SectionHead title="Von der Anforderung bis zum Go-Live." sub="Alle Werkzeuge für eine saubere Implementierung — in einem Tool."/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
          {APP_FEATURES.map((f, i) => (
            <FadeIn key={f.label} delay={i * 55}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px 22px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, background: C.greenBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <f.Icon size={17} color={C.green} sw={1.6}/>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{f.label}</div>
                  <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* RECHNER CTA */}
      <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '60px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
            <div style={{ width: 52, height: 52, background: C.greenBg, border: `1px solid ${C.greenBd}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IcoSliders size={22} color={C.green} sw={1.6}/>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.4, marginBottom: 6 }}>Welcher Plan passt zu Ihnen?</div>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65, margin: 0, maxWidth: 480 }}>
                Mit unserem Bedarfsrechner finden Sie den passenden Zendesk- oder Power Automate-Plan —
                basierend auf Agentenzahl, Ticket-Volumen und konkreten Anforderungen.
              </p>
            </div>
          </div>
          <Link to="/rechner" style={{ background: C.green, color: '#fff', padding: '12px 26px', borderRadius: 7, fontSize: 14, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8 }}>
            Zum Rechner <IcoArrow size={15} color="#fff" sw={2.2}/>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <Section id="faq">
        <SectionHead
          title="Häufig gestellte Fragen"
          sub="Antworten auf die wichtigsten Fragen zu unseren Implementierungsleistungen."
        />
        <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQ_PUBLIC.map((item, i) => (
            <FaqItem key={i} item={item} index={i}/>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section style={{ padding: '72px 24px', textAlign: 'center', background: C.page }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.7, marginBottom: 12 }}>Erstes Projekt starten.</h2>
          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Account anlegen und direkt loslegen — kein Setup, keine Einrichtungsgebühr.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ background: C.green, color: '#fff', padding: '12px 26px', borderRadius: 7, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Account anlegen</Link>
            <Link to="/login"    style={{ background: C.surface, color: C.text, padding: '12px 26px', borderRadius: 7, fontSize: 14, fontWeight: 600, textDecoration: 'none', border: `1px solid ${C.border}` }}>Anmelden</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '20px 24px', background: C.surface }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 800, color: C.green, fontSize: 14 }}>ProjektTool</span>
          <span style={{ color: C.muted, fontSize: 12 }}>© 2025 Dadakaev Labs · Zendesk & Power Automate Implementierungen</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/rechner" style={{ color: C.muted, fontSize: 13, textDecoration: 'none' }}>Rechner</Link>
            <a href="#faq"      style={{ color: C.muted, fontSize: 13, textDecoration: 'none' }}>FAQ</a>
            <Link to="/login"   style={{ color: C.muted, fontSize: 13, textDecoration: 'none' }}>Login</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
