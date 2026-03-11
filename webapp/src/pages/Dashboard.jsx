import { PHASES, KPIS, CUSTOMER, GOLIVELISTE } from '../data/hfkData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useLanguage } from '../context/LanguageContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ProgressRing from '../components/shared/ProgressRing'
import { Link } from 'react-router-dom'

const phaseColors = { green: 'var(--green)', blue: 'var(--blue)', amber: 'var(--amber)', purple: 'var(--purple)' }

export default function Dashboard() {
  const { t } = useLanguage()
  const [checked] = useLocalStorage('hfk-tasks', {})
  const [glChecked] = useLocalStorage('hfk-golive', {})
  const [angebotData] = useLocalStorage('hfk-angebot', null)

  const phaseProgress = PHASES.map((p) => {
    const done = p.tasks.filter((task) => checked[task.id]).length
    const total = p.tasks.length
    return { ...p, done, total, pct: Math.round((done / total) * 100) }
  })

  // Dynamic honorar from Angebot-Tool
  const angebotTotal = angebotData
    ? Object.values(angebotData.phases || {}).reduce((a, v) => a + (Number(v) || 0), 0) +
      (angebotData.extras || []).reduce((a, e) => a + (Number(e.price) || 0), 0)
    : null

  const dynamicKpis = KPIS.map((k) => {
    if (k.label === 'Honorar Techniker' && angebotTotal !== null) {
      return { ...k, value: `€${angebotTotal.toLocaleString('de')}`, sub: 'Angebot' }
    }
    return k
  })

  const totalDone = phaseProgress.reduce((a, p) => a + p.done, 0)
  const totalTasks = phaseProgress.reduce((a, p) => a + p.total, 0)
  const overallPct = Math.round((totalDone / totalTasks) * 100)
  const glDone = GOLIVELISTE.filter((g) => glChecked[g.id]).length
  const pending = GOLIVELISTE.filter((g) => g.pending && !glChecked[g.id])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Hero KPI Strip */}
      <div style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 8, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ProgressRing pct={overallPct} size={68} stroke={5} />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>
              {t('dashboard.overall')}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{totalDone} / {totalTasks} {t('dashboard.tasks')}</div>
            <div style={{ fontSize: 12, color: 'var(--muted-l)', marginTop: 2 }}>{t('dashboard.golive')}: {glDone} / {GOLIVELISTE.length} {t('dashboard.checks')}</div>
          </div>
        </div>
        <div className="kpi-divider" style={{ width: 1, height: 44, background: 'var(--border)', flexShrink: 0 }} />
        {dynamicKpis.map((k) => (
          <div key={k.label}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--green)' }}>{k.value}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginTop: 1 }}>{k.label}</div>
            <div style={{ fontSize: 10, color: k.sub === 'Angebot' ? 'var(--green)' : 'var(--muted-l)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Pending alerts */}
      {pending.length > 0 && (
        <div style={{ padding: '12px 16px', background: 'var(--amber-d)', border: '1px solid rgba(245,158,11,.25)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--amber)', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', flexShrink: 0 }}>⚠</span>
          <span style={{ flex: 1 }}>
            <strong>{t('dashboard.pending')}:</strong>{' '}
            {pending.map((p) => p.title).join(' · ')}
          </span>
          <Link to="/checkliste" style={{ color: 'var(--amber)', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
            {t('dashboard.toChecklist')}
          </Link>
        </div>
      )}

      {/* Phase Progress Cards */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>
          {t('dashboard.phases')}
        </div>
        <div className="grid-auto-fill" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 10 }}>
          {phaseProgress.map((p) => (
            <Link key={p.id} to="/phasen" style={{ textDecoration: 'none' }}>
              <Card style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <Badge color={p.color === 'green' ? 'green' : p.color === 'blue' ? 'blue' : p.color === 'amber' ? 'amber' : 'purple'}>{p.number}</Badge>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8, lineHeight: 1.35 }}>{p.title}</div>
                  </div>
                  <ProgressRing pct={p.pct} size={44} stroke={4} color={phaseColors[p.color] || 'var(--green)'} />
                </div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.pct}%`, background: phaseColors[p.color] || 'var(--green)', borderRadius: 2, transition: 'width .5s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--muted-l)' }}>
                  <span>{p.done}/{p.total} {t('dashboard.tasks')}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>~{p.hours}h</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Customer + Quick Links */}
      <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
            {t('dashboard.customer')}
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
              <span style={{ color: 'var(--muted-l)', minWidth: 80, flexShrink: 0 }}>{k}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)', wordBreak: 'break-all' }}>{v}</span>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
            {t('dashboard.quicklinks')}
          </div>
          {[
            { to: '/phasen', labelKey: 'dashboard.link.phases', icon: '◈' },
            { to: '/checkliste', labelKey: 'dashboard.link.checklist', icon: '✓' },
            { to: '/makros', labelKey: 'dashboard.link.macros', icon: '⚡' },
            { to: '/dns', labelKey: 'dashboard.link.dns', icon: '◎' },
            { to: '/faq', labelKey: 'dashboard.link.faq', icon: '?' },
            { to: '/intern', labelKey: 'dashboard.link.intern', icon: '⊙' },
          ].map(({ to, labelKey, icon }) => (
            <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--muted-l)', textDecoration: 'none', minHeight: 40 }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)', width: 16, textAlign: 'center' }}>{icon}</span>
              {t(labelKey)}
            </Link>
          ))}
        </Card>
      </div>
    </div>
  )
}
