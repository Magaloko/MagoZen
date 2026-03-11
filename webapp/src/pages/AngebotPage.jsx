import { useState } from 'react'
import { PHASES } from '../data/hfkData'
import { useLocalStorage } from '../hooks/useLocalStorage'

const DEFAULT_PHASES = Object.fromEntries(PHASES.map((p) => [p.id, p.honorar]))
const TOTAL_HOURS = PHASES.reduce((a, p) => a + p.hours, 0)

function numId() {
  return Math.random().toString(36).slice(2, 9)
}

export default function AngebotPage() {
  const [data, setData] = useLocalStorage('hfk-angebot', { phases: DEFAULT_PHASES, extras: [] })
  const [newLabel, setNewLabel] = useState('')
  const [newPrice, setNewPrice] = useState('')

  const phases = { ...DEFAULT_PHASES, ...data.phases }
  const extras = data.extras || []

  const phaseTotal = Object.values(phases).reduce((a, v) => a + (Number(v) || 0), 0)
  const extraTotal = extras.reduce((a, e) => a + (Number(e.price) || 0), 0)
  const total = phaseTotal + extraTotal
  const stundensatz = TOTAL_HOURS > 0 ? Math.round(total / TOTAL_HOURS) : 0

  const setPhasePrice = (id, val) => {
    setData((prev) => ({ ...prev, phases: { ...prev.phases, [id]: Number(val) || 0 } }))
  }

  const addExtra = () => {
    if (!newLabel.trim()) return
    const extra = { id: numId(), label: newLabel.trim(), price: Number(newPrice) || 0 }
    setData((prev) => ({ ...prev, extras: [...(prev.extras || []), extra] }))
    setNewLabel('')
    setNewPrice('')
  }

  const updateExtra = (id, key, val) => {
    setData((prev) => ({
      ...prev,
      extras: prev.extras.map((e) => (e.id === id ? { ...e, [key]: key === 'price' ? Number(val) || 0 : val } : e)),
    }))
  }

  const removeExtra = (id) => {
    setData((prev) => ({ ...prev, extras: prev.extras.filter((e) => e.id !== id) }))
  }

  const reset = () => {
    if (window.confirm('Alle Angebot-Preise zurücksetzen?')) {
      setData({ phases: DEFAULT_PHASES, extras: [] })
    }
  }

  return (
    <div style={{ maxWidth: 820 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
          Intern · Vertraulich
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg, var(--white))', margin: 0 }}>
            Angebot erstellen
          </h1>
          <button onClick={reset} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 14px', fontSize: 12, color: 'var(--muted-l)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
            ↺ Reset
          </button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, lineHeight: 1.6 }}>
          Preise pro Phase editieren — Gesamtsumme wird live berechnet und im Dashboard angezeigt.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Gesamt-Honorar', value: `€${total.toLocaleString('de')}`, color: 'var(--green)' },
          { label: 'Ø Stundensatz', value: `€${stundensatz}/h`, color: 'var(--blue)' },
          { label: 'Stunden gesamt', value: `${TOTAL_HOURS}h`, color: 'var(--muted-l)' },
          { label: 'Positionen', value: PHASES.length + extras.length, color: 'var(--amber)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '12px 14px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted-l)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Phases Table */}
      <div style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Phasen-Honorar</span>
        </div>
        {PHASES.map((phase, i) => (
          <div key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: i < PHASES.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', width: 60, flexShrink: 0 }}>{phase.number}</div>
            <div style={{ flex: 1, fontSize: 13, color: 'var(--white-d)', minWidth: 0 }}>{phase.title}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>~{phase.hours}h</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 13, color: 'var(--muted-l)' }}>€</span>
              <input
                type="number"
                min="0"
                step="10"
                value={phases[phase.id] ?? phase.honorar}
                onChange={(e) => setPhasePrice(phase.id, e.target.value)}
                style={{ width: 90, background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 5, padding: '5px 8px', fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--green)', textAlign: 'right', outline: 'none' }}
              />
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'var(--green-d)', borderTop: '1px solid var(--border)' }}>
          <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>PHASEN GESAMT</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>€{phaseTotal.toLocaleString('de')}</div>
        </div>
      </div>

      {/* Extra Positions */}
      <div style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Zusatz-Positionen</span>
        </div>

        {extras.length === 0 && (
          <div style={{ padding: '16px', fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>Keine Zusatzpositionen — unten hinzufügen.</div>
        )}

        {extras.map((extra, i) => (
          <div key={extra.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
            <input
              type="text"
              value={extra.label}
              onChange={(e) => updateExtra(extra.id, 'label', e.target.value)}
              style={{ flex: 1, background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 5, padding: '5px 8px', fontSize: 13, color: 'var(--white-d)', outline: 'none' }}
            />
            <span style={{ fontSize: 13, color: 'var(--muted-l)', flexShrink: 0 }}>€</span>
            <input
              type="number"
              min="0"
              step="10"
              value={extra.price}
              onChange={(e) => updateExtra(extra.id, 'price', e.target.value)}
              style={{ width: 90, background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 5, padding: '5px 8px', fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--green)', textAlign: 'right', outline: 'none' }}
            />
            <button onClick={() => removeExtra(extra.id)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 16, padding: '2px 4px', lineHeight: 1, flexShrink: 0 }}>×</button>
          </div>
        ))}

        {/* Add new row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderTop: extras.length > 0 ? '1px solid var(--border)' : 'none' }}>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addExtra()}
            placeholder="Leistungsbeschreibung..."
            style={{ flex: 1, background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 5, padding: '5px 8px', fontSize: 13, color: 'var(--white-d)', outline: 'none' }}
          />
          <span style={{ fontSize: 13, color: 'var(--muted-l)', flexShrink: 0 }}>€</span>
          <input
            type="number"
            min="0"
            step="10"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addExtra()}
            placeholder="0"
            style={{ width: 90, background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 5, padding: '5px 8px', fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--green)', textAlign: 'right', outline: 'none' }}
          />
          <button onClick={addExtra} style={{ background: 'var(--green)', border: 'none', borderRadius: 5, padding: '5px 14px', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
            + Zeile
          </button>
        </div>

        {extras.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'var(--amber-d)', borderTop: '1px solid var(--border)' }}>
            <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>EXTRAS GESAMT</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>€{extraTotal.toLocaleString('de')}</div>
          </div>
        )}
      </div>

      {/* Total Summary */}
      <div style={{ background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 'var(--r)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Gesamt-Honorar (netto)</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{TOTAL_HOURS}h × €{stundensatz}/h Ø · {PHASES.length + extras.length} Positionen</div>
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>€{total.toLocaleString('de')}</div>
      </div>
    </div>
  )
}
