import { PHASES, KPIS, CUSTOMER, GOLIVELISTE } from '../data/hfkData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ProgressRing from '../components/shared/ProgressRing'
import { Link } from 'react-router-dom'

const phaseColors = { green: 'var(--green)', blue: 'var(--blue)', amber: 'var(--amber)', purple: 'var(--purple)' }

export default function Dashboard() {
  const [checked] = useLocalStorage('hfk-tasks', {})
  const [glChecked] = useLocalStorage('hfk-golive', {})

  // Progress per phase
  const phaseProgress = PHASES.map((p) => {
    const done = p.tasks.filter((t) => checked[t.id]).length
    const total = p.tasks.length
    return { ...p, done, total, pct: Math.round((done / total) * 100) }
  })

  const totalDone = phaseProgress.reduce((a, p) => a + p.done, 0)
  const totalTasks = phaseProgress.reduce((a, p) => a + p.total, 0)
  const overallPct = Math.round((totalDone / totalTasks) * 100)

  const glDone = GOLIVELISTE.filter((g) => glChecked[g.id]).length
  const pending = GOLIVELISTE.filter((g) => g.pending && !glChecked[g.id])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Hero KPI Strip */}
      <div
        style={{
          background: 'var(--ink-m)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '22px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <ProgressRing pct={overallPct} size={72} stroke={5} />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>
              Gesamt-Fortschritt
            </div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{totalDone} / {totalTasks} Aufgaben</div>
            <div style={{ fontSize: 12, color: 'var(--muted-l)', marginTop: 2 }}>Go-Live: {glDone} / {GOLIVELISTE.length} Checks</div>
          </div>
        </div>
        <div style={{ width: 1, height: 48, background: 'var(--border)', flexShrink: 0 }} />
        {KPIS.map((k) => (
          <div key={k.label}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>{k.value}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginTop: 1 }}>{k.label}</div>
            <div style={{ fontSize: 10, color: 'var(--muted-l)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Pending alerts */}
      {pending.length > 0 && (
        <div
          style={{
            padding: '12px 18px',
            background: 'var(--amber-d)',
            border: '1px solid rgba(245,158,11,.25)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 13,
            color: 'var(--amber)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', flexShrink: 0 }}>⚠</span>
          <span>
            <strong>Ausstehend von HFK:</strong>{' '}
            {pending.map((p) => p.title).join(' · ')}
          </span>
          <Link to="/checkliste" style={{ marginLeft: 'auto', color: 'var(--amber)', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
            Zur Checkliste →
          </Link>
        </div>
      )}

      {/* Phase Progress Cards */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
          Phasen-Übersicht
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {phaseProgress.map((p) => (
            <Link key={p.id} to="/phasen" style={{ textDecoration: 'none' }}>
              <Card style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <Badge color={p.color === 'green' ? 'green' : p.color === 'blue' ? 'blue' : p.color === 'amber' ? 'amber' : 'purple'}>
                      {p.number}
                    </Badge>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8, lineHeight: 1.35 }}>{p.title}</div>
                  </div>
                  <ProgressRing pct={p.pct} size={48} stroke={4} color={phaseColors[p.color] || 'var(--green)'} />
                </div>
                {/* Progress bar */}
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${p.pct}%`,
                      background: phaseColors[p.color] || 'var(--green)',
                      borderRadius: 2,
                      transition: 'width .5s ease',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--muted-l)' }}>
                  <span>{p.done}/{p.total} Aufgaben</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>~{p.hours}h</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Customer Info + Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
            Kunde
          </div>
          {[
            ['Name', CUSTOMER.name],
            ['URL', CUSTOMER.url],
            ['E-Mail', CUSTOMER.email],
            ['Zendesk', CUSTOMER.zendeskSubdomain],
            ['JTL Shop', CUSTOMER.jtlShop],
            ['JTL WAWI', CUSTOMER.jtlWawi],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <span style={{ color: 'var(--muted-l)', minWidth: 90, flexShrink: 0 }}>{k}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)' }}>{v}</span>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
            Schnellzugriff
          </div>
          {[
            { to: '/phasen', label: 'Phasen & Tasks bearbeiten', icon: '◈' },
            { to: '/checkliste', label: 'Go-Live Checkliste öffnen', icon: '✓' },
            { to: '/makros', label: 'Makro-Vorlagen ansehen', icon: '⚡' },
            { to: '/dns', label: 'DNS-Records nachschlagen', icon: '◎' },
            { to: '/faq', label: 'Q&A für HFK-Gespräch', icon: '?' },
            { to: '/intern', label: 'Interne Kalkulation', icon: '⊙' },
          ].map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '7px 0',
                borderBottom: '1px solid var(--border)',
                fontSize: 13,
                color: 'var(--muted-l)',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)', width: 16, textAlign: 'center' }}>{icon}</span>
              {label}
            </Link>
          ))}
        </Card>
      </div>
    </div>
  )
}
