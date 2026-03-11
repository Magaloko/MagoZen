import { useState } from 'react'
import { DEMO_CHECKLIST, DEMO_MILESTONES } from '../data/hfkData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useLanguage } from '../context/LanguageContext'

// ── Typ config ────────────────────────────────────────────────────────────────
const TYP = {
  self:        { color: 'var(--green)',  bg: 'var(--green-d)',  border: 'var(--green-b)' },
  'third-party':{ color: '#92400E',      bg: 'rgba(217,119,6,.06)',  border: 'rgba(217,119,6,.2)' },
  mixed:       { color: '#1D4ED8',       bg: 'rgba(37,99,235,.06)',  border: 'rgba(37,99,235,.2)' },
}

const STATUS_ORDER = ['pending', 'active', 'waiting', 'done']

const CAT_ICON = {
  zendesk:    '🟦',
  'jtl-shop': '🛒',
  'jtl-wawi': '🏭',
  branding:   '🎨',
  email:      '✉️',
  agents:     '👤',
}

export default function DemoPage() {
  const { t } = useLanguage()
  const [received, setReceived] = useLocalStorage('hfk-demo-received', {})
  const [milestoneStatus, setMilestoneStatus] = useLocalStorage('hfk-demo-milestones', {})
  const [openJtl, setOpenJtl] = useState(null)
  const [showIntern, setShowIntern] = useState({})

  const totalReceived = Object.values(received).filter(Boolean).length
  const blocking = DEMO_CHECKLIST.filter((i) => i.blocking)
  const blockingDone = blocking.filter((i) => received[i.id]).length

  const toggleReceived = (id) => setReceived((p) => ({ ...p, [id]: !p[id] }))
  const cycleStatus = (id) => {
    const cur = milestoneStatus[id] || 'pending'
    const next = STATUS_ORDER[(STATUS_ORDER.indexOf(cur) + 1) % STATUS_ORDER.length]
    setMilestoneStatus((p) => ({ ...p, [id]: next }))
  }
  const toggleIntern = (id) => setShowIntern((p) => ({ ...p, [id]: !p[id] }))

  const statusColors = {
    pending: { bg: 'var(--border)',        color: 'var(--muted-l)' },
    active:  { bg: 'var(--green-d)',       color: 'var(--green)' },
    waiting: { bg: 'rgba(217,119,6,.08)', color: '#92400E' },
    done:    { bg: 'rgba(37,99,235,.08)',  color: '#1D4ED8' },
  }

  const statusLabel = (s) => ({
    pending: t('demo.status.pending'),
    active:  t('demo.status.active'),
    waiting: t('demo.status.waiting'),
    done:    t('demo.status.done'),
  })[s] || s

  // Group checklist by category
  const cats = [...new Set(DEMO_CHECKLIST.map((i) => i.cat))]

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
          {t('nav.demo')}
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--white)', marginBottom: 6 }}>
          {t('title.demo')}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{t('demo.intro')}</p>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ background: 'var(--border)', borderRadius: 4, height: 6, overflow: 'hidden', marginBottom: 5 }}>
            <div style={{ width: `${(totalReceived / DEMO_CHECKLIST.length) * 100}%`, height: '100%', background: 'var(--green)', borderRadius: 4, transition: 'width .3s' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            {totalReceived}/{DEMO_CHECKLIST.length} {t('demo.progress')}
          </div>
        </div>
        <div style={{ padding: '6px 14px', background: blockingDone === blocking.length ? 'var(--green-d)' : 'rgba(239,68,68,.08)', border: `1px solid ${blockingDone === blocking.length ? 'var(--green-b)' : 'rgba(239,68,68,.25)'}`, borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: blockingDone === blocking.length ? 'var(--green)' : 'var(--red)' }}>
          {blockingDone}/{blocking.length} {t('demo.blocking')}
        </div>
      </div>

      {/* ── Section 1: Customer Checklist ──────────────────────────────────── */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>
          {t('demo.checklist.title')}
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>{t('demo.checklist.sub')}</p>

        {cats.map((cat) => {
          const items = DEMO_CHECKLIST.filter((i) => i.cat === cat)
          const catLabel = items[0].catLabel
          return (
            <div key={cat} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{CAT_ICON[cat]}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-l)', textTransform: 'uppercase', letterSpacing: '.1em' }}>{catLabel}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {items.map((item) => {
                  const done = !!received[item.id]
                  return (
                    <div key={item.id} onClick={() => toggleReceived(item.id)} style={{ background: 'var(--ink-m)', border: `1px solid ${done ? 'var(--green-b)' : 'var(--border)'}`, borderRadius: 'var(--r)', padding: '11px 14px', cursor: 'pointer', opacity: done ? 0.7 : 1, transition: 'all .15s', display: 'flex', alignItems: 'flex-start', gap: 12, minHeight: 44 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1, border: `2px solid ${done ? 'var(--green)' : 'var(--border-l)'}`, background: done ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>
                        {done && <span style={{ color: '#fff', fontSize: 11, lineHeight: 1 }}>✓</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', textDecoration: done ? 'line-through' : 'none' }}>{item.title}</span>
                          {item.blocking
                            ? <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '1px 7px', borderRadius: 3, background: 'rgba(239,68,68,.12)', color: 'var(--red)', border: '1px solid rgba(239,68,68,.2)' }}>{t('demo.blocking')}</span>
                            : <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '1px 7px', borderRadius: 3, background: 'var(--border)', color: 'var(--muted)' }}>{t('demo.optional')}</span>
                          }
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{item.desc}</div>
                      </div>
                      <div style={{ flexShrink: 0, fontSize: 11, fontFamily: 'var(--font-mono)', color: done ? 'var(--green)' : 'var(--muted)', paddingTop: 2 }}>
                        {done ? t('demo.received') : t('demo.outstanding')}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>

      {/* ── Section 2: JTL Technical Details ───────────────────────────────── */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>
          {t('demo.jtl.title')}
        </div>

        <div style={{ padding: '8px 14px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 6, fontSize: 12, color: 'var(--green)', fontFamily: 'var(--font-mono)', marginBottom: 14 }}>
          🔒 {t('demo.jtl.readonly')}
        </div>

        {[
          { key: 'shop', icon: '🛒', titleKey: 'demo.jtl.shop.title', stepsKey: 'demo.jtl.shop.steps' },
          { key: 'wawi', icon: '🏭', titleKey: 'demo.jtl.wawi.title', stepsKey: 'demo.jtl.wawi.steps' },
        ].map(({ key, icon, titleKey, stepsKey }) => (
          <div key={key} style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', marginBottom: 10, overflow: 'hidden' }}>
            <div onClick={() => setOpenJtl(openJtl === key ? null : key)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', cursor: 'pointer', minHeight: 48 }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: 'var(--white)' }}>{t(titleKey)}</span>
              <span style={{ color: 'var(--muted-l)', fontSize: 14, flexShrink: 0 }}>{openJtl === key ? '▲' : '▼'}</span>
            </div>
            {openJtl === key && (
              <div style={{ borderTop: '1px solid var(--border)', padding: '14px 16px', background: 'rgba(255,255,255,.02)' }}>
                <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--white-d)', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {t(stepsKey)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* ── Section 3: Timeline & Milestones ───────────────────────────────── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 6 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
            {t('demo.timeline.title')}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { typ: 'self', labelKey: 'demo.legend.self' },
              { typ: 'third-party', labelKey: 'demo.legend.third' },
              { typ: 'mixed', labelKey: 'demo.legend.mixed' },
            ].map(({ typ, labelKey }) => (
              <div key={typ} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted)' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: TYP[typ].color, flexShrink: 0 }} />
                <span>{t(labelKey)}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>{t('demo.timeline.sub')}</p>

        {/* Total duration badge */}
        <div style={{ marginBottom: 18, padding: '10px 14px', background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, color: 'var(--muted-l)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--white)', fontWeight: 600 }}>{t('demo.totalDays')}</span>
          <span>{t('demo.totalDaysValue')}</span>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 18, top: 22, bottom: 22, width: 2, background: 'var(--border)', zIndex: 0 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DEMO_MILESTONES.map((m, idx) => {
              const cfg = TYP[m.typ]
              const status = milestoneStatus[m.id] || 'pending'
              const sCfg = statusColors[status]
              const isDone = status === 'done'
              const internOpen = !!showIntern[m.id]

              return (
                <div key={m.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  {/* Timeline dot */}
                  <div style={{ width: 38, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, paddingTop: 12 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: isDone ? 'var(--green)' : cfg.color, border: `2px solid ${isDone ? 'var(--green)' : cfg.border}`, boxShadow: `0 0 0 3px ${isDone ? 'var(--green-d)' : cfg.bg}`, transition: 'all .2s' }} />
                    {idx < DEMO_MILESTONES.length - 1 && (
                      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: 4, writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.05em' }}>
                        {m.phaseLabel}
                      </div>
                    )}
                  </div>

                  {/* Card */}
                  <div style={{ flex: 1, background: 'var(--ink-m)', border: `1px solid ${isDone ? 'rgba(63,207,142,.2)' : cfg.border}`, borderRadius: 'var(--r)', overflow: 'hidden', opacity: isDone ? 0.7 : 1, transition: 'all .2s', minWidth: 0 }}>
                    {/* Left accent bar */}
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: 4, flexShrink: 0, background: cfg.color }} />
                      <div style={{ flex: 1, padding: '12px 14px', minWidth: 0 }}>
                        {/* Top row */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', lineHeight: 1.35, textDecoration: isDone ? 'line-through' : 'none' }}>
                              {m.title}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                              {m.typ === 'self' ? t('demo.typ.self') : m.typ === 'third-party' ? t('demo.typ.third') : t('demo.typ.mixed')}
                            </span>
                            <span style={{ padding: '2px 10px', borderRadius: 10, fontSize: 11, fontFamily: 'var(--font-mono)', background: sCfg.bg, color: sCfg.color, cursor: 'pointer', border: `1px solid transparent`, minHeight: 24, display: 'flex', alignItems: 'center' }} onClick={() => cycleStatus(m.id)} title="Klicken um Status zu ändern">
                              {statusLabel(status)}
                            </span>
                          </div>
                        </div>

                        {/* Duration */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: cfg.color }}>⏱</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-l)' }}>{m.dauer}</span>
                          {m.typ === 'third-party' && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#92400E', padding: '1px 6px', background: 'rgba(217,119,6,.06)', borderRadius: 3, border: '1px solid rgba(217,119,6,.2)' }}>⚠ wartet auf Dritte</span>
                          )}
                          {m.typ === 'mixed' && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#1D4ED8', padding: '1px 6px', background: 'rgba(37,99,235,.06)', borderRadius: 3, border: '1px solid rgba(37,99,235,.2)' }}>◑ gemischt</span>
                          )}
                        </div>

                        {/* Description */}
                        <div style={{ fontSize: 12.5, color: 'var(--muted-l)', lineHeight: 1.55, marginBottom: m.intern ? 8 : 0 }}>
                          {m.beschreibung}
                        </div>

                        {/* Internal note toggle */}
                        {m.intern && (
                          <>
                            <button onClick={() => toggleIntern(m.id)} style={{ marginTop: 2, background: 'transparent', border: '1px solid rgba(239,68,68,.2)', borderRadius: 4, padding: '3px 10px', fontSize: 11, color: 'var(--red)', cursor: 'pointer', fontFamily: 'var(--font-mono)', minHeight: 28, display: 'flex', alignItems: 'center', gap: 5 }}>
                              <span style={{ fontWeight: 700 }}>⊙ {t('demo.intern.label')}</span>
                              <span style={{ color: 'var(--muted)' }}>{internOpen ? '▲' : '▼'}</span>
                            </button>
                            {internOpen && (
                              <div style={{ marginTop: 8, padding: '10px 12px', background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 6, fontSize: 12, color: 'var(--red)', fontFamily: 'var(--font-mono)', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {m.intern}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
