import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { DNS_RECORDS, CUSTOMER } from '../data/hfkData'
import { useProject } from '../context/ProjectContext'
import { useLanguage } from '../context/LanguageContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

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

export default function DNSPage() {
  const { projectId } = useParams()
  const { project } = useProject(projectId)
  const { t } = useLanguage()

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
