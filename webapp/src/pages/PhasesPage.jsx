import { useState } from 'react'
import { PHASES } from '../data/hfkData'
import { useLocalStorage } from '../hooks/useLocalStorage'
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

function PhaseBlock({ phase, checked, onToggle }) {
  const [open, setOpen] = useState(true)
  const colors = phaseColors[phase.color] || phaseColors.green
  const done = phase.tasks.filter((t) => checked[t.id]).length
  const total = phase.tasks.length
  const pct = Math.round((done / total) * 100)

  return (
    <Card style={{ overflow: 'hidden', padding: 0 }}>
      {/* Phase Header */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 20px',
          cursor: 'pointer',
          borderBottom: open ? '1px solid var(--border)' : 'none',
        }}
      >
        <Badge color={colors.badge}>{phase.number}</Badge>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{phase.title}</div>
          {phase.risk && (
            <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>
              ⚠ {phase.risk}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>~{phase.hours}h</span>
          {phase.honorar > 0 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)' }}>€{phase.honorar}</span>
          )}
          <ProgressRing pct={pct} size={44} stroke={3} color={colors.ring} />
          <span style={{ color: 'var(--muted-l)', fontSize: 16 }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Progress bar */}
      {open && (
        <div style={{ height: 3, background: 'var(--border)' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: colors.bar, transition: 'width .4s' }} />
        </div>
      )}

      {/* Tasks */}
      {open && (
        <div style={{ padding: '8px 0' }}>
          {phase.tasks.map((task) => {
            const isDone = !!checked[task.id]
            return (
              <label
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '10px 20px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border)',
                  background: isDone ? 'rgba(63,207,142,.04)' : 'transparent',
                  transition: 'background .15s',
                }}
              >
                {/* Custom checkbox */}
                <div
                  onClick={() => onToggle(task.id)}
                  style={{
                    width: 18,
                    height: 18,
                    border: isDone ? '2px solid var(--green)' : '2px solid var(--border-l)',
                    borderRadius: 3,
                    background: isDone ? 'var(--green)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1,
                    transition: 'all .15s',
                    cursor: 'pointer',
                  }}
                >
                  {isDone && <span style={{ color: 'var(--ink)', fontSize: 11, fontWeight: 700 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: isDone ? 'var(--muted-l)' : 'var(--white-d)',
                      textDecoration: isDone ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                    {task.pending && (
                      <Badge color="amber" style={{ marginLeft: 8, fontSize: 10 }}>AUSSTEHEND</Badge>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3, lineHeight: 1.45 }}>
                    {task.detail}
                  </div>
                </div>
              </label>
            )
          })}

          {/* Phase summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--muted-l)' }}>{done}/{total} erledigt</span>
            {done < total && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => phase.tasks.forEach((t) => onToggle(t.id, true))}
              >
                Alle als erledigt
              </Button>
            )}
            {done === total && (
              <span style={{ fontSize: 12, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
                ✓ Phase abgeschlossen
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

export default function PhasesPage() {
  const [checked, setChecked] = useLocalStorage('hfk-tasks', {})

  const handleToggle = (id, forceTrue) => {
    setChecked((prev) => ({
      ...prev,
      [id]: forceTrue !== undefined ? forceTrue : !prev[id],
    }))
  }

  const resetAll = () => {
    if (window.confirm('Alle Aufgaben-Checks zurücksetzen?')) setChecked({})
  }

  const totalDone = PHASES.flatMap((p) => p.tasks).filter((t) => checked[t.id]).length
  const totalAll = PHASES.flatMap((p) => p.tasks).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--green)' }}>
            {totalDone} / {totalAll} Aufgaben
          </span>
          <span style={{ color: 'var(--muted-l)', fontSize: 13, marginLeft: 8 }}>abgeschlossen</span>
        </div>
        <Button size="sm" variant="ghost" onClick={resetAll}>Reset</Button>
      </div>

      {PHASES.map((phase) => (
        <PhaseBlock
          key={phase.id}
          phase={phase}
          checked={checked}
          onToggle={handleToggle}
        />
      ))}
    </div>
  )
}
