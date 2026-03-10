import { useState } from 'react'
import { FRAGENKATALOG } from '../data/hfkData'
import { useLocalStorage } from '../hooks/useLocalStorage'

const PRIO_COLOR = {
  MUSS: { bar: '#C0392B', badge: { background: '#FEF2F0', color: '#C0392B' } },
  SOLLTE: { bar: '#C47C20', badge: { background: '#FEF3DC', color: '#C47C20' } },
  KANN: { bar: '#2563A8', badge: { background: '#EEF4FF', color: '#2563A8' } },
}

const CAT_COLOR = {
  green: 'var(--green)',
  amber: 'var(--amber)',
  blue: 'var(--blue)',
  purple: 'var(--purple)',
}

const allFragen = FRAGENKATALOG.flatMap(k => k.fragen)
const mustCount = allFragen.filter(f => f.prio === 'muss' || f.prio === 'MUSS').length
const sollteCount = allFragen.filter(f => f.prio === 'sollte' || f.prio === 'SOLLTE').length
const kannCount = allFragen.filter(f => f.prio === 'kann' || f.prio === 'KANN').length

export default function FragenPage() {
  const [answered, setAnswered] = useLocalStorage('hfk-fragen', {})
  const [notes, setNotes] = useLocalStorage('hfk-fragen-notes', {})
  const [filter, setFilter] = useState('ALL')
  const [openNote, setOpenNote] = useState(null)

  const totalAnswered = Object.values(answered).filter(Boolean).length

  function toggleAnswered(id) {
    setAnswered(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function updateNote(id, value) {
    setNotes(prev => ({ ...prev, [id]: value }))
  }

  const visibleFragen = (fragen) =>
    filter === 'ALL' ? fragen : fragen.filter(f => f.prio === filter)

  return (
    <div style={{ padding: '28px 32px', maxWidth: 880 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
          Fragenkatalog
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg)', marginBottom: 6 }}>
          Was ich HFK fragen muss, kann &amp; sollte
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
          Strukturierter Informations-Katalog für das Erstgespräch und die Projektdurchführung.
        </p>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Gesamt beantwortet', value: `${totalAnswered} / 24`, color: 'var(--green)' },
          { label: 'MUSS', value: mustCount, sub: 'Blockieren Projektstart', color: '#C0392B' },
          { label: 'SOLLTE', value: sollteCount, sub: 'Qualität & Vollständigkeit', color: '#C47C20' },
          { label: 'KANN', value: kannCount, sub: 'Upselling & Zukunft', color: '#2563A8' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '14px 16px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)', marginTop: 4 }}>{label}</div>
            {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ background: 'var(--border)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
          <div style={{ width: `${(totalAnswered / 24) * 100}%`, height: '100%', background: 'var(--green)', borderRadius: 4, transition: 'width .3s' }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5, fontFamily: 'var(--font-mono)' }}>
          {totalAnswered} von 24 Fragen beantwortet ({Math.round((totalAnswered / 24) * 100)}%)
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {['ALL', 'MUSS', 'SOLLTE', 'KANN'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '5px 14px',
              borderRadius: 20,
              border: '1px solid',
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              cursor: 'pointer',
              background: filter === f ? (f === 'ALL' ? 'var(--green)' : PRIO_COLOR[f]?.bar) : 'transparent',
              color: filter === f ? '#fff' : 'var(--muted-l)',
              borderColor: filter === f ? 'transparent' : 'var(--border)',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Categories */}
      {FRAGENKATALOG.map(kat => {
        const visible = visibleFragen(kat.fragen)
        if (visible.length === 0) return null
        const katAnswered = kat.fragen.filter(f => answered[f.id]).length

        return (
          <div key={kat.id} style={{ marginBottom: 36 }}>
            {/* Category header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>
                {kat.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: CAT_COLOR[kat.color], letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
                  {kat.id.toUpperCase()}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg)' }}>{kat.kategorie}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>
                {katAnswered}/{kat.fragen.length}
              </div>
            </div>

            {/* Questions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {visible.map(frage => {
                const prio = PRIO_COLOR[frage.prio]
                const isDone = !!answered[frage.id]
                const hasNote = notes[frage.id]
                const noteOpen = openNote === frage.id

                return (
                  <div
                    key={frage.id}
                    style={{
                      background: isDone ? 'var(--surface)' : 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--r)',
                      overflow: 'hidden',
                      opacity: isDone ? 0.65 : 1,
                      transition: 'opacity .2s',
                    }}
                  >
                    <div style={{ display: 'flex' }}>
                      {/* Priority bar */}
                      <div style={{ width: 5, flexShrink: 0, background: prio.bar }} />

                      {/* Body */}
                      <div style={{ padding: '12px 16px', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          {/* Checkbox */}
                          <div
                            onClick={() => toggleAnswered(frage.id)}
                            style={{
                              width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2,
                              border: `2px solid ${isDone ? prio.bar : 'var(--border)'}`,
                              background: isDone ? prio.bar : 'transparent',
                              cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all .15s',
                            }}
                          >
                            {isDone && <span style={{ color: '#fff', fontSize: 11, lineHeight: 1 }}>✓</span>}
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', marginRight: 2 }}>{frage.id}</span>
                              <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, ...prio.badge }}>
                                {frage.prio}
                              </span>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.45, marginBottom: 5, textDecoration: isDone ? 'line-through' : 'none' }}>
                              {frage.text}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.55 }}>
                              {frage.why}
                            </div>
                            {frage.tip && (
                              <div style={{ marginTop: 6, padding: '5px 10px', background: 'var(--green-d)', borderRadius: 4, fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
                                // {frage.tip}
                              </div>
                            )}

                            {/* Note toggle */}
                            <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                              <button
                                onClick={() => setOpenNote(noteOpen ? null : frage.id)}
                                style={{
                                  background: 'transparent', border: '1px solid var(--border)',
                                  borderRadius: 4, padding: '3px 10px', fontSize: 11,
                                  color: hasNote ? 'var(--green)' : 'var(--muted)',
                                  cursor: 'pointer', fontFamily: 'var(--font-mono)',
                                  borderColor: hasNote ? 'var(--green-b)' : 'var(--border)',
                                }}
                              >
                                {hasNote ? '✎ Notiz' : '+ Notiz'}
                              </button>
                              {hasNote && !noteOpen && (
                                <span style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>
                                  {notes[frage.id]}
                                </span>
                              )}
                            </div>

                            {noteOpen && (
                              <textarea
                                autoFocus
                                value={notes[frage.id] || ''}
                                onChange={e => updateNote(frage.id, e.target.value)}
                                placeholder="Antwort / Notiz eingeben..."
                                style={{
                                  marginTop: 8, width: '100%', minHeight: 72,
                                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                                  borderRadius: 6, padding: '8px 10px', fontSize: 12,
                                  color: 'var(--fg)', fontFamily: 'var(--font-sans)', resize: 'vertical',
                                  outline: 'none', lineHeight: 1.5,
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
