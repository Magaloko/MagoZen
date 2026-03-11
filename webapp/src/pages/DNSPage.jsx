import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { DNS_RECORDS, CUSTOMER } from '../data/hfkData'
import { useProject } from '../context/ProjectContext'
import { useLanguage } from '../context/LanguageContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const PA_BLUE = '#0078D4'
const PA_BLUE_BG = 'rgba(0,120,212,0.1)'
const PA_BLUE_BORDER = 'rgba(0,120,212,0.35)'

// ── Zendesk DNS helpers ────────────────────────────────────────────────────
function CopyField({ label, value, pending, t }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    if (pending) return
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <div style={{ padding: '12px 14px', background: 'var(--ink)', border: `1px solid ${pending ? 'rgba(245,158,11,.2)' : 'var(--border)'}`, borderRadius: 6, marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.07em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <code style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12, color: pending ? 'var(--amber)' : 'var(--green)', wordBreak: 'break-all', lineHeight: 1.5 }}>{value}</code>
        {!pending && <Button size="sm" variant="secondary" onClick={copy} style={{ flexShrink: 0 }}>{copied ? t('common.copied') : t('dns.copy')}</Button>}
        {pending && <Badge color="amber">{t('dns.pending')}</Badge>}
      </div>
    </div>
  )
}

function DnsRow({ record, t }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    if (record.pending) return
    navigator.clipboard.writeText(record.value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <tr style={{ background: record.pending ? 'rgba(245,158,11,.03)' : 'transparent' }}>
      <td style={{ padding: '10px 10px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-l)', whiteSpace: 'nowrap' }}>{record.type}</td>
      <td style={{ padding: '10px 10px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--blue)', whiteSpace: 'nowrap' }}>{record.host}</td>
      <td style={{ padding: '10px 10px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 11, color: record.pending ? 'var(--amber)' : 'var(--green)', wordBreak: 'break-all', lineHeight: 1.5 }}>{record.value}</td>
      <td style={{ padding: '10px 10px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
        {record.pending
          ? <Badge color="amber">{t('dns.pending')}</Badge>
          : <Button size="sm" variant="secondary" onClick={copy}>{copied ? t('common.copied') : t('dns.copy')}</Button>
        }
      </td>
    </tr>
  )
}

// ── PA Environments View ──────────────────────────────────────────────────
const ENV_STATUS_STYLE = {
  active:   { color: 'var(--green)', label: '● Aktiv' },
  pending:  { color: 'var(--amber)', label: '◐ Bereitstellung' },
  inactive: { color: 'var(--muted)', label: '○ Inaktiv' },
}

const CONNECTOR_TYPE_STYLE = {
  Standard: { color: 'var(--muted-l)', bg: 'var(--ink-m)', border: 'var(--border)' },
  Premium:  { color: PA_BLUE,          bg: PA_BLUE_BG,     border: PA_BLUE_BORDER },
  Custom:   { color: '#D97706',         bg: 'rgba(217,119,6,0.1)', border: 'rgba(217,119,6,0.3)' },
}

function PAEnvironmentsView({ environments, connections, customer }) {
  const [copiedUrl, setCopiedUrl] = useState('')
  const copyUrl = (url) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(''), 1800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Info banner */}
      <div style={{ padding: '12px 16px', background: PA_BLUE_BG, border: `1px solid ${PA_BLUE_BORDER}`, borderRadius: 6, fontSize: 13, color: PA_BLUE }}>
        <strong>Phase 1 & 2:</strong> Power Platform Umgebungen und Connector-Konfiguration. Dev → Test → Prod Deployment-Strategie.
      </div>

      {/* Environment Cards */}
      {environments && environments.length > 0 && (
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: PA_BLUE, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>
            Umgebungen (Environments)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {environments.map((env, i) => {
              const statusCfg = ENV_STATUS_STYLE[env.status] || ENV_STATUS_STYLE.inactive
              return (
                <Card key={env.id || i}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px' }}>
                      {env.type || 'ENV'}
                    </span>
                    <span style={{ fontSize: 11, color: statusCfg.color, fontFamily: 'var(--font-mono)' }}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--white)', marginBottom: 8 }}>{env.name}</div>
                  {env.url && (
                    <div style={{ marginBottom: 6 }}>
                      <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>UMGEBUNGS-URL</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <code style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 10, color: PA_BLUE, wordBreak: 'break-all' }}>{env.url}</code>
                        <button onClick={() => copyUrl(env.url)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 12, padding: '2px 4px' }}>
                          {copiedUrl === env.url ? '✓' : '⧉'}
                        </button>
                      </div>
                    </div>
                  )}
                  {env.ppId && (
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>POWER PLATFORM ID</div>
                      <code style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted-l)' }}>{env.ppId}</code>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Connector Table */}
      {connections && connections.length > 0 && (
        <Card>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: PA_BLUE, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
            Connector-Referenz
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 560 }}>
              <thead>
                <tr>
                  {['Connector', 'Typ', 'Auth-Methode', 'Status', 'Beschreibung'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', background: PA_BLUE_BG, color: 'var(--muted-l)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {connections.map((conn, i) => {
                  const typeStyle = CONNECTOR_TYPE_STYLE[conn.type] || CONNECTOR_TYPE_STYLE.Standard
                  return (
                    <tr key={conn.id || i} style={{ background: i % 2 === 1 ? 'rgba(255,255,255,.02)' : 'transparent' }}>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>{conn.name}</td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 4, background: typeStyle.bg, border: `1px solid ${typeStyle.border}`, fontSize: 11, color: typeStyle.color, fontFamily: 'var(--font-mono)' }}>
                          {conn.type}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', color: 'var(--muted-l)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                        {conn.authMethod || conn.auth || '—'}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: conn.status === 'active' ? 'var(--green)' : conn.status === 'pending' ? 'var(--amber)' : 'var(--muted)' }}>
                          {conn.status === 'active' ? '● Aktiv' : conn.status === 'pending' ? '◐ Ausstehend' : '○ Inaktiv'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', color: 'var(--muted-l)', fontSize: 12 }}>
                        {conn.description || conn.desc || '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Reference Links */}
      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: PA_BLUE, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
          Referenz-Links
        </div>
        {[
          ['Power Platform Admin Center', 'https://admin.powerplatform.microsoft.com'],
          ['Power Automate Portal', 'https://make.powerautomate.com'],
          ['Connector Catalog', 'https://learn.microsoft.com/en-us/connectors/connector-reference/'],
          ['PA Monitor Dashboard', `https://make.powerautomate.com/environments/`],
          ['M365 Admin Center', 'https://admin.microsoft.com'],
          ['Azure Portal', 'https://portal.azure.com'],
          ...(customer?.m365Tenant ? [['Tenant Admin', `https://${customer.m365Tenant}`]] : []),
        ].map(([label, url]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', minHeight: 40 }}>
            <span style={{ fontSize: 12, color: 'var(--muted-l)', minWidth: 200, flexShrink: 0 }}>{label}</span>
            <code style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11, color: PA_BLUE, wordBreak: 'break-all' }}>{url}</code>
            <Button size="sm" variant="ghost" onClick={() => copyUrl(url)} style={{ flexShrink: 0 }}>
              {copiedUrl === url ? '✓' : '⧉'}
            </Button>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ── Main Export ────────────────────────────────────────────────────────────
export default function DNSPage() {
  const { projectId } = useParams()
  const { project } = useProject(projectId)
  const { t } = useLanguage()

  const svcType = project?.service_package?.service_type ?? 'zendesk'
  const isPA = svcType === 'power-automate'

  if (isPA) {
    const environments = project?.service_package?.environments || []
    const connections = project?.service_package?.connections || []
    const customer = project?.customer_data || {}
    return <PAEnvironmentsView environments={environments} connections={connections} customer={customer} />
  }

  const dnsRecords = project?.service_package?.dns_records || DNS_RECORDS
  const customer = project?.customer_data || CUSTOMER

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      <div style={{ padding: '12px 16px', background: 'var(--blue-d)', border: '1px solid rgba(96,165,250,.2)', borderRadius: 6, fontSize: 13, color: 'var(--blue)' }}>
        <strong>Phase 2:</strong> {t('dns.info')}
      </div>

      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          {t('dns.recordsTitle')}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 480 }}>
            <thead>
              <tr>
                {[t('dns.type'), t('dns.host'), t('dns.value'), t('dns.action')].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', background: 'var(--border)', color: 'var(--muted-l)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dnsRecords.map((r, i) => <DnsRow key={i} record={r} t={t} />)}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
          {t('dns.emailTitle')}
        </div>
        <CopyField label="Support-Adresse (Zendesk)" value={customer.email} t={t} />
        <CopyField label="Absender-Name" value="Herr & Frau Klein Service" t={t} />
        <CopyField label="Zendesk Subdomain" value={customer.zendeskSubdomain} t={t} />
        <CopyField label="Eingangsbestätigung" value="Wir antworten innerhalb von 8 Stunden" t={t} />
      </Card>

      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
          {t('dns.urlsTitle')}
        </div>
        {[
          ['Zendesk Admin Center', `https://${customer.zendeskSubdomain}/admin`],
          ['DKIM Keys', `https://${customer.zendeskSubdomain}/admin/channels/email`],
          ['JTL Marketplace App', `https://${customer.zendeskSubdomain}/admin/apps-and-integrations/apps/marketplace`],
          ['DNS Checker', 'https://dnschecker.org'],
          ['SPF Validator', 'https://mxtoolbox.com/spf.aspx'],
          ['JTL REST API', `https://${customer.url}/api/v1`],
        ].map(([label, url]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', minHeight: 40 }}>
            <span style={{ fontSize: 12, color: 'var(--muted-l)', minWidth: 160, flexShrink: 0 }}>{label}</span>
            <code style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', wordBreak: 'break-all' }}>{url}</code>
            <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(url)} style={{ flexShrink: 0 }}>⧉</Button>
          </div>
        ))}
      </Card>
    </div>
  )
}
