import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { PHASES } from '../data/hfkData'
import { useProject } from '../context/ProjectContext'
import { useProjectState } from '../hooks/useProjectState'
import { useLanguage } from '../context/LanguageContext'
import { isTaskAvailable, getPlanId, ZENDESK_PLANS } from '../utils/planUtils'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ProgressRing from '../components/shared/ProgressRing'

const phaseColors = {
  green:  { badge: 'green',  bar: 'var(--green)',  ring: 'var(--green)' },
  blue:   { badge: 'blue',   bar: 'var(--blue)',   ring: 'var(--blue)' },
  amber:  { badge: 'amber',  bar: 'var(--amber)',  ring: 'var(--amber)' },
  purple: { badge: 'purple', bar: 'var(--purple)', ring: 'var(--purple)' },
}

const STATUS_CYCLE = ['erstellt', 'eingetragen', 'funktioniert']
const STATUS_CONFIG = {
  erstellt:    { color: 'var(--amber)',  bg: 'var(--amber-d)',  border: 'rgba(245,158,11,.25)', icon: '◯' },
  eingetragen: { color: 'var(--blue)',   bg: 'rgba(37,99,235,.08)', border: 'rgba(37,99,235,.25)', icon: '◎' },
  funktioniert:{ color: 'var(--green)',  bg: 'var(--green-d)',  border: 'var(--green-b)', icon: '✓' },
}

function StatusBadge({ status, onClick }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.erstellt
  return (
    <button
      onClick={onClick}
      title="Status wechseln"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 4,
        padding: '2px 8px',
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        color: cfg.color,
        cursor: 'pointer',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        minHeight: 24,
      }}
    >
      <span>{cfg.icon}</span>
      <span>{status}</span>
    </button>
  )
}

function PhaseBlock({ phase, availableTasks, lockedTasks, checked, onToggle, taskStatus, onCycleStatus, taskFields, onUpdateField, t }) {
  const [open, setOpen] = useState(true)
  const [openFields, setOpenFields] = useState({})
  const [lockedOpen, setLockedOpen] = useState(false)
  const colors = phaseColors[phase.color] || phaseColors.green
  const done = availableTasks.filter((task) => checked[task.id]).length
  const total = availableTasks.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  const toggleFields = (id) => setOpenFields((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <Card style={{ overflow: 'hidden', padding: 0 }}>
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', cursor: 'pointer', borderBottom: open ? '1px solid var(--border)' : 'none', flexWrap: 'wrap', gap: 10 }}>
        <Badge color={colors.badge}>{phase.number}</Badge>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{phase.title}</div>
          {phase.risk && (
            <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>⚠ {phase.risk}</div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>~{phase.hours}h</span>
          {phase.honorar > 0 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)' }}>€{phase.honorar}</span>
          )}
          <ProgressRing pct={pct} size={40} stroke={3} color={colors.ring} />
          <span style={{ color: 'var(--muted-l)', fontSize: 14 }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {open && <div style={{ height: 3, background: 'var(--border)' }}><div style={{ height: '100%', width: `${pct}%`, background: colors.bar, transition: 'width .4s' }} /></div>}

      {open && (
        <div style={{ padding: '6px 0' }}>
          {availableTasks.map((task) => {
            const isDone = !!checked[task.id]
            const hasFields = task.fields && task.fields.length > 0
            const status = taskStatus[task.id] || 'erstellt'
            const fieldsOpen = !!openFields[task.id]
            const canCheck = !hasFields || status === 'funktioniert'
            const fieldVals = taskFields[task.id] || {}

            return (
              <div key={task.id} style={{ borderBottom: '1px solid var(--border)', background: isDone ? 'rgba(63,207,142,.04)' : 'transparent', transition: 'background .15s' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 18px', minHeight: 44 }}>
                  {/* Checkbox */}
                  <div
                    onClick={() => canCheck && onToggle(task.id)}
                    title={!canCheck ? 'Status muss "funktioniert" sein' : ''}
                    style={{
                      width: 18, height: 18,
                      border: isDone ? '2px solid var(--green)' : canCheck ? '2px solid var(--border-l)' : '2px solid var(--border)',
                      borderRadius: 3,
                      background: isDone ? 'var(--green)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 2,
                      transition: 'all .15s',
                      cursor: canCheck ? 'pointer' : 'not-allowed',
                      opacity: canCheck ? 1 : 0.4,
                    }}
                  >
                    {isDone && <span style={{ color: 'var(--ink)', fontSize: 11, fontWeight: 700 }}>✓</span>}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: isDone ? 'var(--muted-l)' : 'var(--white-d)', textDecoration: isDone ? 'line-through' : 'none' }}>
                        {task.title}
                        {task.pending && <Badge color="amber" style={{ marginLeft: 8, fontSize: 10 }}>{t('phases.pending')}</Badge>}
                      </div>
                      {hasFields && (
                        <StatusBadge status={status} onClick={(e) => { e.stopPropagation(); onCycleStatus(task.id) }} />
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, lineHeight: 1.45 }}>{task.detail}</div>

                    {hasFields && (
                      <button
                        onClick={() => toggleFields(task.id)}
                        style={{ marginTop: 6, background: 'transparent', border: `1px solid ${fieldsOpen ? 'var(--green-b)' : 'var(--border)'}`, borderRadius: 4, padding: '3px 10px', fontSize: 11, color: fieldsOpen ? 'var(--green)' : 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-mono)', minHeight: 26 }}
                      >
                        {fieldsOpen ? '▲ Felder schließen' : '▼ Felder eingeben'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expandable Fields */}
                {hasFields && fieldsOpen && (
                  <div style={{ padding: '0 18px 12px 48px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {task.fields.map((field) => (
                      <div key={field.id}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: 4 }}>{field.label}</div>
                        <input
                          type="text"
                          value={fieldVals[field.id] || ''}
                          onChange={(e) => onUpdateField(task.id, field.id, e.target.value)}
                          placeholder={field.placeholder}
                          style={{
                            width: '100%',
                            background: 'var(--ink)',
                            border: '1px solid var(--border)',
                            borderRadius: 5,
                            padding: '6px 10px',
                            fontSize: 13,
                            color: 'var(--white)',
                            fontFamily: 'var(--font-mono)',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    ))}
                    {status !== 'funktioniert' && (
                      <div style={{ fontSize: 11, color: 'var(--amber)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                        ⚠ Aufgabe erst abhakbar wenn Status = "funktioniert"
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--muted-l)' }}>{done}/{total} {t('phases.done')}</span>
            {done < total && (
              <Button size="sm" variant="ghost" onClick={() => availableTasks.forEach((task) => {
                const hasFields = task.fields && task.fields.length > 0
                const status = taskStatus[task.id] || 'erstellt'
                if (!hasFields || status === 'funktioniert') onToggle(task.id, true)
              })}>
                {t('phases.markAll')}
              </Button>
            )}
            {done === total && total > 0 && (
              <span style={{ fontSize: 12, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>{t('phases.phaseComplete')}</span>
            )}
          </div>

          {/* Locked tasks (plan gate) */}
          {lockedTasks.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => setLockedOpen((v) => !v)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px', background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                  🔒 Nicht verfügbar in diesem Plan ({lockedTasks.length} Tasks)
                </span>
                <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 'auto' }}>{lockedOpen ? '▲' : '▼'}</span>
              </button>
              {lockedOpen && (
                <div>
                  {lockedTasks.map((task) => (
                    <div key={task.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '8px 18px', opacity: 0.5, borderTop: '1px solid var(--border)' }}>
                      <div style={{ width: 18, height: 18, border: '2px solid var(--border)', borderRadius: 3, flexShrink: 0, marginTop: 2 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: 'var(--muted-l)' }}>{task.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                          Ab {task.available_from?.charAt(0).toUpperCase() + task.available_from?.slice(1)} verfügbar
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export default function PhasesPage() {
  const { projectId } = useParams()
  const { project } = useProject(projectId)
  const { t } = useLanguage()
  const [checked, setChecked] = useProjectState('tasks', {}, projectId)
  const [taskStatus, setTaskStatus] = useProjectState('task-status', {}, projectId)
  const [taskFields, setTaskFields] = useProjectState('task-fields', {}, projectId)

  const phases   = project?.service_package?.phases || PHASES
  const planName = project?.service_package?.plan || ''
  const planId   = getPlanId(planName)
  const planInfo = ZENDESK_PLANS.find((p) => p.id === planId)

  const handleToggle = (id, forceTrue) => {
    setChecked((prev) => ({ ...prev, [id]: forceTrue !== undefined ? forceTrue : !prev[id] }))
  }

  const handleCycleStatus = (id) => {
    setTaskStatus((prev) => {
      const current = prev[id] || 'erstellt'
      const idx = STATUS_CYCLE.indexOf(current)
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
      return { ...prev, [id]: next }
    })
  }

  const handleUpdateField = (taskId, fieldId, value) => {
    setTaskFields((prev) => ({
      ...prev,
      [taskId]: { ...(prev[taskId] || {}), [fieldId]: value },
    }))
  }

  // Split tasks per plan
  const phasesWithFilter = phases.map((phase) => ({
    ...phase,
    availableTasks: (phase.tasks || []).filter((t) => isTaskAvailable(t, planName)),
    lockedTasks:    (phase.tasks || []).filter((t) => !isTaskAvailable(t, planName)),
  }))

  const totalDone   = phasesWithFilter.flatMap((p) => p.availableTasks).filter((task) => checked[task.id]).length
  const totalAll    = phasesWithFilter.flatMap((p) => p.availableTasks).length
  const totalLocked = phasesWithFilter.flatMap((p) => p.lockedTasks).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Plan banner */}
      <div style={{
        padding: '10px 16px', borderRadius: 8,
        background: planName ? 'rgba(63,207,142,.06)' : 'rgba(100,116,139,.06)',
        border: planName ? '1px solid var(--green-b)' : '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: planName ? 'var(--green)' : 'var(--muted)' }}>
          Plan: {planInfo?.name || 'Kein Plan konfiguriert'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted-l)' }}>
          {totalAll} Tasks verfügbar
          {totalLocked > 0 && (
            <span style={{ color: 'var(--muted)', marginLeft: 6 }}>· {totalLocked} gesperrt</span>
          )}
        </div>
        {!planName && (
          <div style={{ fontSize: 11, color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
            → Plan in Einstellungen auswählen
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--green)' }}>{totalDone} / {totalAll} {t('phases.tasks')}</span>
          <span style={{ color: 'var(--muted-l)', fontSize: 13, marginLeft: 8 }}>{t('phases.completed')}</span>
        </div>
        <Button size="sm" variant="ghost" onClick={() => { if (window.confirm(t('phases.resetConfirm'))) setChecked({}) }}>{t('phases.reset')}</Button>
      </div>

      {phasesWithFilter.map((phase) => (
        <PhaseBlock
          key={phase.id}
          phase={phase}
          availableTasks={phase.availableTasks}
          lockedTasks={phase.lockedTasks}
          checked={checked}
          onToggle={handleToggle}
          taskStatus={taskStatus}
          onCycleStatus={handleCycleStatus}
          taskFields={taskFields}
          onUpdateField={handleUpdateField}
          t={t}
        />
      ))}
    </div>
  )
}
