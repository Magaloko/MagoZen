import { useState } from 'react'
import { FRAGENKATALOG } from '../data/hfkData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useLanguage } from '../context/LanguageContext'

const PRIO_COLOR = {
  MUSS:   { bar: '#C0392B', badge: { background: '#FEF2F0', color: '#C0392B' } },
  SOLLTE: { bar: '#C47C20', badge: { background: '#FEF3DC', color: '#C47C20' } },
  KANN:   { bar: '#2563A8', badge: { background: '#EEF4FF', color: '#2563A8' } },
}

const CAT_COLOR = { green: 'var(--green)', amber: 'var(--amber)', blue: 'var(--blue)', purple: 'var(--purple)' }

const allFragen = FRAGENKATALOG.flatMap((k) => k.fragen)
const mustCount = allFragen.filter((f) => f.prio === 'MUSS').length
const sollteCount = allFragen.filter((f) => f.prio === 'SOLLTE').length
const kannCount = allFragen.filter((f) => f.prio === 'KANN').length

export default function FragenPage() {
  const { t } = useLanguage()
  const [answered, setAnswered] = useLocalStorage('hfk-fragen', {})
  const [notes, setNotes] = useLocalStorage('hfk-fragen-notes', {})
  const [filter, setFilter] = useState('ALL')
  const [openNote, setOpenNote] = useState(null)

  const totalAnswered = Object.values(answered).filter(Boolean).length

  const toggleAnswered = (id) => setAnswered((prev) => ({ ...prev, [id]: !prev[id] }))
  const updateNote = (id, value) => setNotes((prev) => ({ ...prev, [id]: value }))

  const filterLabel = filter === 'ALL' ? t('questions.filter.all') : filter
  const visibleFragen = (fragen) => filter === 'ALL' ? fragen : fragen.filter((f) => f.prio === filter)

  return (
    <div style={{ maxWidth: 880 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
          {t('nav.questions')}
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg, var(--white))', marginBottom: 6 }}>
          Was ich HFK fragen muss, kann &amp; sollte
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{t('questions.header')}</p>
      </div>

      {/* Summary */}
      <div className="grid-auto-fill" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: 20 }}>
        {[
          { label: t('questions.totalAnswered'), value: `${totalAnswered} / 24`, color: 'var(--green)' },
          { label: 'MUSS', value: mustCount, sub: t('questions.mustSub'), color: '#C0392B' },
          { label: 'SOLLTE', value: sollteCount, sub: t('questions.shouldSub'), color: '#C47C20' },
          { label: 'KANN', value: kannCount, sub: t('questions.canSub'), color: '#2563A8' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '12px 14px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--white)', marginTop: 4 }}>{label}</div>
            {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>{sub}</div>}
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ background: 'var(--border)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
          <div style={{ width: `${(totalAnswered / 24) * 100}%`, height: '100%', background: 'var(--green)', borderRadius: 4, transition: 'width .3s' }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5, fontFamily: 'var(--font-mono)' }}>
          {totalAnswered} {t('questions.progress')} ({Math.round((totalAnswered / 24) * 100)}%)
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 26, flexWrap: 'wrap' }}>
        {['ALL', 'MUSS', 'SOLLTE', 'KANN'].map((f) => {
          const label = f === 'ALL' ? t('questions.filter.all') : f
          return (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 14px', borderRadius: 20, border: '1px solid', fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600, cursor: 'pointer', background: filter === f ? (f === 'ALL' ? 'var(--green)' : PRIO_COLOR[f]?.bar) : 'transparent', color: filter === f ? '#fff' : 'var(--muted-l)', borderColor: filter === f ? 'transparent' : 'var(--border)', minHeight: 36 }}>
              {label}
            </button>
          )
        })}
      </div>

      {/* Categories */}
      {FRAGENKATALOG.map((kat) => {
        const visible = visibleFragen(kat.fragen)
        if (visible.length === 0) return null
        const katAnswered = kat.fragen.filter((f) => answered[f.id]).length

        return (
          <div key={kat.id} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--ink-m)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {kat.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: CAT_COLOR[kat.color], letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
                  {kat.id.toUpperCase()}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)' }}>{kat.kategorie}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>
                {katAnswered}/{kat.fragen.length}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {visible.map((frage) => {
                const prio = PRIO_COLOR[frage.prio]
                const isDone = !!answered[frage.id]
                const noteOpen = openNote === frage.id
                const hasNote = !!notes[frage.id]

                return (
                  <div key={frage.id} style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden', opacity: isDone ? 0.65 : 1, transition: 'opacity .2s' }}>
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: 5, flexShrink: 0, background: prio.bar }} />
                      <div style={{ padding: '12px 14px', flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div onClick={() => toggleAnswered(frage.id)} style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2, border: `2px solid ${isDone ? prio.bar : 'var(--border-l)'}`, background: isDone ? prio.bar : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>
                            {isDone && <span style={{ color: '#fff', fontSize: 11, lineHeight: 1 }}>✓</span>}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>{frage.id}</span>
                              <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, ...prio.badge }}>{frage.prio}</span>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)', lineHeight: 1.45, marginBottom: 5, textDecoration: isDone ? 'line-through' : 'none' }}>
                              {frage.text}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.55 }}>{frage.why}</div>
                            {frage.tip && (
                              <div style={{ marginTop: 6, padding: '5px 10px', background: 'var(--green-d)', borderRadius: 4, fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
                                // {frage.tip}
                              </div>
                            )}
                            <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                              <button onClick={() => setOpenNote(noteOpen ? null : frage.id)} style={{ background: 'transparent', border: `1px solid ${hasNote ? 'var(--green-b)' : 'var(--border)'}`, borderRadius: 4, padding: '3px 10px', fontSize: 11, color: hasNote ? 'var(--green)' : 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-mono)', minHeight: 28 }}>
                                {hasNote ? t('questions.editNote') : t('questions.addNote')}
                              </button>
                              {hasNote && !noteOpen && (
                                <span style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>
                                  {notes[frage.id]}
                                </span>
                              )}
                            </div>
                            {noteOpen && (
                              <textarea autoFocus value={notes[frage.id] || ''} onChange={(e) => updateNote(frage.id, e.target.value)} placeholder={t('questions.notePlaceholder')}
                                style={{ marginTop: 8, width: '100%', minHeight: 68, background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', fontSize: 12, color: 'var(--white)', fontFamily: 'var(--font-sans)', resize: 'vertical', outline: 'none', lineHeight: 1.5 }}
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
