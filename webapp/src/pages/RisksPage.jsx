import { RISKS } from '../data/hfkData'
import { useLanguage } from '../context/LanguageContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function RisksPage() {
  const { t } = useLanguage()

  const levelConfig = {
    hoch:    { badge: 'red',   labelKey: 'risks.high',   border: 'rgba(239,68,68,.2)',   bg: 'rgba(239,68,68,.04)' },
    mittel:  { badge: 'amber', labelKey: 'risks.medium', border: 'rgba(245,158,11,.2)', bg: 'rgba(245,158,11,.04)' },
    niedrig: { badge: 'green', labelKey: 'risks.low',    border: 'var(--green-b)',       bg: 'var(--green-d)' },
  }

  const grouped = {
    hoch: RISKS.filter((r) => r.level === 'hoch'),
    mittel: RISKS.filter((r) => r.level === 'mittel'),
    niedrig: RISKS.filter((r) => r.level === 'niedrig'),
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {Object.entries(grouped).map(([level, items]) => {
        if (!items.length) return null
        const cfg = levelConfig[level]
        return (
          <div key={level}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>
              {t(cfg.labelKey)}
            </div>
            <div className="grid-auto-fill" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {items.map((risk) => (
                <div key={risk.title} style={{ padding: '18px 18px', borderRadius: 'var(--r)', border: `1px solid ${cfg.border}`, background: cfg.bg }}>
                  <div style={{ marginBottom: 8 }}><Badge color={cfg.badge}>{level.toUpperCase()}</Badge></div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{risk.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted-l)', lineHeight: 1.55 }}>{risk.description}</div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
          {t('risks.webhookTitle')}
        </div>
        <p style={{ fontSize: 13, color: 'var(--white-d)', marginBottom: 12, lineHeight: 1.6 }}>
          {t('risks.webhookText')}
        </p>
        <pre style={{ background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 6, padding: 16, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--amber)', lineHeight: 1.7, overflowX: 'auto' }}>
{`Webhook Trigger: WAWI → Zendesk
Condition: Artikel-Kategorie = "Möbel"
Event: Liefertermin bestätigt
Custom Field: Möbel-Sperrgut = TRUE
SLA Policy: Möbel & Sperrgut (24h/72h)
Zeitpuffer Phase 3: +2h einplanen`}
        </pre>
      </Card>
    </div>
  )
}
