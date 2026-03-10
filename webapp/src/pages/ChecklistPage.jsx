import { GOLIVELISTE } from '../data/hfkData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useLanguage } from '../context/LanguageContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function ChecklistPage() {
  const { t } = useLanguage()
  const [checked, setChecked] = useLocalStorage('hfk-golive', {})

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  const done = GOLIVELISTE.filter((g) => checked[g.id]).length
  const total = GOLIVELISTE.length
  const pct = Math.round((done / total) * 100)
  const pendingItems = GOLIVELISTE.filter((g) => g.pending && !checked[g.id])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: pct === 100 ? 'var(--green)' : 'var(--white)' }}>{pct}%</div>
            <div style={{ fontSize: 12, color: 'var(--muted-l)', marginTop: 2 }}>{done} / {total} {t('checklist.done')}</div>
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'var(--green)' : 'var(--amber)', borderRadius: 4, transition: 'width .5s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--muted)' }}>
              <span>{t('checklist.setupStart')}</span>
              <span>{t('checklist.goLiveReady')}</span>
            </div>
          </div>
          {pct === 100 && (
            <div style={{ padding: '8px 16px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 6, fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
              {t('checklist.readyBanner')}
            </div>
          )}
        </div>
      </Card>

      {pendingItems.length > 0 && (
        <div style={{ padding: '12px 16px', background: 'var(--amber-d)', border: '1px solid rgba(245,158,11,.25)', borderRadius: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--amber)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
            {t('checklist.requiredFrom')}
          </div>
          {pendingItems.map((p) => (
            <div key={p.id} style={{ fontSize: 13, color: 'var(--amber)', padding: '3px 0' }}>→ {p.title}</div>
          ))}
        </div>
      )}

      <Card style={{ padding: 0 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{t('checklist.title')}</span>
          <Button size="sm" variant="ghost" onClick={() => setChecked({})}>{t('checklist.reset')}</Button>
        </div>
        <div className="grid-auto-fill" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {GOLIVELISTE.map((item, i) => {
            const isDone = !!checked[item.id]
            const isLast = i === GOLIVELISTE.length - 1
            return (
              <label
                key={item.id}
                onClick={() => toggle(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '14px 18px',
                  cursor: 'pointer',
                  borderBottom: !isLast ? '1px solid var(--border)' : 'none',
                  background: isDone ? 'rgba(63,207,142,.04)' : item.pending && !isDone ? 'rgba(245,158,11,.04)' : 'transparent',
                  transition: 'background .15s',
                  minHeight: 44,
                }}
              >
                <div style={{ width: 20, height: 20, border: isDone ? '2px solid var(--green)' : item.pending ? '2px solid var(--amber)' : '2px solid var(--border-l)', borderRadius: 4, background: isDone ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all .15s' }}>
                  {isDone && <span style={{ color: 'var(--ink)', fontSize: 12, fontWeight: 700 }}>✓</span>}
                  {!isDone && item.pending && <span style={{ color: 'var(--amber)', fontSize: 10 }}>!</span>}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: isDone ? 'var(--muted-l)' : item.pending ? 'var(--amber)' : 'var(--white-d)', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{item.sub}</div>
                </div>
              </label>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
