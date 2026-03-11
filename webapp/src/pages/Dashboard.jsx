import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'
import { useProjectState } from '../hooks/useProjectState'
import { useLanguage } from '../context/LanguageContext'
import { PHASES, KPIS, CUSTOMER, GOLIVELISTE } from '../data/hfkData'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ProgressRing from '../components/shared/ProgressRing'

const phaseColors = { green: 'var(--green)', blue: 'var(--blue)', amber: 'var(--amber)', purple: 'var(--purple)' }
const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planung' },
  { value: 'active', label: 'Aktiv' },
  { value: 'paused', label: 'Pausiert' },
  { value: 'completed', label: 'Abgeschlossen' },
]

export default function Dashboard() {
  const { projectId } = useParams()
  const { project, update, loading } = useProject(projectId)
  const { t } = useLanguage()
  const [editingName, setEditingName] = useState(false)
  const [editingShort, setEditingShort] = useState(false)
  const [nameVal, setNameVal] = useState('')
  const [shortVal, setShortVal] = useState('')
  const [checked] = useProjectState('tasks', {}, projectId)
  const [glChecked] = useProjectState('golive', {}, projectId)
  const [angebotData] = useProjectState('angebot', null, projectId)

  const phases = project?.service_package?.phases || PHASES
  const goliveliste = project?.service_package?.goliveliste || GOLIVELISTE
  const customer = project?.customer_data || CUSTOMER

  const phaseProgress = phases.map((p) => {
    const done = (p.tasks || []).filter((task) => checked[task.id]).length
    const total = (p.tasks || []).length
    return { ...p, done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
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
  const overallPct = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0
  const glDone = goliveliste.filter((g) => glChecked[g.id]).length
  const pending = goliveliste.filter((g) => g.pending && !glChecked[g.id])

  if (loading) {
    return <div style={{ padding: 40, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Loading...</div>
  }

  const saveName = () => {
    if (nameVal.trim() && nameVal.trim() !== project?.name) {
      update({ name: nameVal.trim() })
    }
    setEditingName(false)
  }
  const saveShort = () => {
    if (shortVal.trim() !== (project?.short_name || '')) {
      update({ short_name: shortVal.trim() })
    }
    setEditingShort(false)
  }
  const changeStatus = (newStatus) => {
    update({ status: newStatus })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Editable project header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        {editingName ? (
          <input
            autoFocus
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false) }}
            style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)', background: 'var(--ink)', border: '1px solid var(--green-b)', borderRadius: 6, padding: '4px 10px', outline: 'none', minWidth: 200 }}
          />
        ) : (
          <span
            onClick={() => { setNameVal(project?.name || ''); setEditingName(true) }}
            title="Klick zum Bearbeiten"
            style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)', cursor: 'pointer', borderBottom: '1px dashed var(--border)' }}
          >
            {project?.name || 'Projektname'}
          </span>
        )}

        {editingShort ? (
          <input
            autoFocus
            value={shortVal}
            onChange={(e) => setShortVal(e.target.value)}
            onBlur={saveShort}
            onKeyDown={(e) => { if (e.key === 'Enter') saveShort(); if (e.key === 'Escape') setEditingShort(false) }}
            style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--muted-l)', background: 'var(--ink)', border: '1px solid var(--green-b)', borderRadius: 4, padding: '3px 8px', outline: 'none', width: 80 }}
          />
        ) : (
          <span
            onClick={() => { setShortVal(project?.short_name || ''); setEditingShort(true) }}
            title="Kürzel bearbeiten"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', padding: '3px 8px', border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer' }}
          >
            {project?.short_name || '—'}
          </span>
        )}

        <select
          value={project?.status || 'planning'}
          onChange={(e) => changeStatus(e.target.value)}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '4px 8px',
            borderRadius: 4, border: '1px solid var(--border)', cursor: 'pointer', outline: 'none',
            background: project?.status === 'active' ? 'var(--green-d)' : 'var(--ink-m)',
            color: project?.status === 'active' ? 'var(--green)' : 'var(--muted-l)',
          }}
        >
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>✎ klick zum bearbeiten</span>
      </div>

      {/* Hero KPI Strip */}
      <div style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 8, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ProgressRing pct={overallPct} size={68} stroke={5} />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>
              {t('dashboard.overall')}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{totalDone} / {totalTasks} {t('dashboard.tasks')}</div>
            <div style={{ fontSize: 12, color: 'var(--muted-l)', marginTop: 2 }}>{t('dashboard.golive')}: {glDone} / {goliveliste.length} {t('dashboard.checks')}</div>
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
          <Link to={`/projects/${projectId}/checkliste`} style={{ color: 'var(--amber)', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
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
            <Link key={p.id} to={`/projects/${projectId}/phasen`} style={{ textDecoration: 'none' }}>
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
            ['Name', customer.name],
            ['URL', customer.url],
            ['E-Mail', customer.email],
            ['Zendesk', customer.zendeskSubdomain],
            ['JTL Shop', customer.jtlShop],
            ['JTL WAWI', customer.jtlWawi],
          ].map(([k, v]) => v ? (
            <div key={k} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <span style={{ color: 'var(--muted-l)', minWidth: 80, flexShrink: 0 }}>{k}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)', wordBreak: 'break-all' }}>{v}</span>
            </div>
          ) : null)}
        </Card>
        <Card>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
            {t('dashboard.quicklinks')}
          </div>
          {[
            { to: `/projects/${projectId}/phasen`, labelKey: 'dashboard.link.phases', icon: '◈' },
            { to: `/projects/${projectId}/checkliste`, labelKey: 'dashboard.link.checklist', icon: '✓' },
            { to: `/projects/${projectId}/makros`, labelKey: 'dashboard.link.macros', icon: '⚡' },
            { to: `/projects/${projectId}/dns`, labelKey: 'dashboard.link.dns', icon: '◎' },
            { to: `/projects/${projectId}/faq`, labelKey: 'dashboard.link.faq', icon: '?' },
            { to: `/projects/${projectId}/intern`, labelKey: 'dashboard.link.intern', icon: '⊙' },
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
