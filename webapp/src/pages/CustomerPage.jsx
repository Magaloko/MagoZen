import { CUSTOMER, GRUPPEN, LIZENZEN, COPILOT_SETTINGS } from '../data/hfkData'
import { useLanguage } from '../context/LanguageContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

function Row({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <span style={{ color: 'var(--muted-l)', minWidth: 140, flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: mono ? 'var(--font-mono)' : undefined, fontSize: mono ? 12 : 13, color: mono ? 'var(--green)' : 'var(--white-d)', wordBreak: 'break-all' }}>{value}</span>
    </div>
  )
}

export default function CustomerPage() {
  const { t } = useLanguage()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          {t('customer.confirmed')}
        </div>
        <Row label={t('customer.labels.name')} value={CUSTOMER.name} />
        <Row label={t('customer.labels.short')} value={CUSTOMER.short} mono />
        <Row label={t('customer.labels.url')} value={CUSTOMER.url} mono />
        <Row label={t('customer.labels.email')} value={CUSTOMER.email} mono />
        <Row label={t('customer.labels.hoster')} value={CUSTOMER.hoster} />
        <Row label={t('customer.labels.zendesk')} value={CUSTOMER.zendeskSubdomain} mono />
        <Row label={t('customer.labels.jtlShop')} value={CUSTOMER.jtlShop} mono />
        <Row label={t('customer.labels.jtlWawi')} value={CUSTOMER.jtlWawi} mono />
        <Row label={t('customer.labels.agents')} value="6 Agenten (4 Full + 2 Light)" />
        <Row label={t('customer.labels.volume')} value={CUSTOMER.volumen} />
        <Row label={t('customer.labels.market')} value={CUSTOMER.markt} />
        <Row label={t('customer.labels.tz')} value={CUSTOMER.timezone} mono />
        <Row label={t('customer.labels.range')} value={CUSTOMER.sortiment} />
        <Row label={t('customer.labels.channels')} value={CUSTOMER.aktuelleKanäle} />
      </Card>

      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          {t('customer.branding')}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {Object.entries(CUSTOMER.branding).map(([name, hex]) => (
            <div key={name} onClick={() => navigator.clipboard.writeText(hex)} title={`${t('customer.clickCopy')}: ${hex}`}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 6, background: hex, border: '1px solid rgba(255,255,255,.1)' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted-l)' }}>{hex}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>{name}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          {t('customer.groups')}
        </div>
        <div className="grid-auto-fill" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {GRUPPEN.map((g) => (
            <div key={g.name} style={{ padding: '14px 14px', background: 'var(--ink)', border: `1px solid ${g.inactive ? 'rgba(245,158,11,.2)' : 'var(--border)'}`, borderRadius: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{g.name}</span>
                {g.inactive && <Badge color="amber">{t('customer.inactive')}</Badge>}
              </div>
              {g.agents.length > 0 && <div style={{ fontSize: 11, color: 'var(--muted-l)' }}>{g.agents.join(', ')}</div>}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
          {t('customer.licenses')}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 420 }}>
            <thead>
              <tr>
                {[t('customer.lic.role'), t('customer.lic.type'), t('customer.lic.cost'), t('customer.lic.note')].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', background: 'var(--border)', color: 'var(--muted-l)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LIZENZEN.map((l, i) => (
                <tr key={l.rolle} style={{ background: i % 2 === 1 ? 'rgba(255,255,255,.02)' : 'transparent' }}>
                  <td style={{ padding: '10px 10px', borderBottom: '1px solid var(--border)' }}>{l.rolle}</td>
                  <td style={{ padding: '10px 10px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)' }}>{l.typ}</td>
                  <td style={{ padding: '10px 10px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>{l.kosten}</td>
                  <td style={{ padding: '10px 10px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted-l)' }}>{l.hinweis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 6, fontSize: 12, color: 'var(--green)' }}>
          {t('customer.savings')}
        </div>
      </Card>

      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
          {t('customer.copilot')}
        </div>
        {COPILOT_SETTINGS.map((s) => (
          <div key={s.feature} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', minHeight: 44 }}>
            <Badge color={s.active ? 'green' : 'red'}>{s.value}</Badge>
            <span style={{ fontWeight: 500, fontSize: 13, minWidth: 160 }}>{s.feature}</span>
            <span style={{ fontSize: 12, color: 'var(--muted-l)' }}>{s.reason}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}
