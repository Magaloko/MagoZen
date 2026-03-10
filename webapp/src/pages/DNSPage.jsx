import { useState } from 'react'
import { DNS_RECORDS, CUSTOMER } from '../data/hfkData'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

function CopyField({ label, value, pending }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    if (pending) return
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div
      style={{
        padding: '12px 16px',
        background: 'var(--ink)',
        border: `1px solid ${pending ? 'rgba(245,158,11,.2)' : 'var(--border)'}`,
        borderRadius: 6,
        marginBottom: 10,
      }}
    >
      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.07em' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <code
          style={{
            flex: 1,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: pending ? 'var(--amber)' : 'var(--green)',
            wordBreak: 'break-all',
            lineHeight: 1.5,
          }}
        >
          {value}
        </code>
        {!pending && (
          <Button size="sm" variant="secondary" onClick={copy} style={{ flexShrink: 0 }}>
            {copied ? '✓' : '⧉ Kopieren'}
          </Button>
        )}
        {pending && <Badge color="amber">AUSSTEHEND</Badge>}
      </div>
    </div>
  )
}

export default function DNSPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Info */}
      <div style={{ padding: '12px 18px', background: 'var(--blue-d)', border: '1px solid rgba(96,165,250,.2)', borderRadius: 6, fontSize: 13, color: 'var(--blue)' }}>
        <strong>Phase 2:</strong> DNS-Records bei All-inkl eintragen — Propagation prüfen: <code>dnschecker.org</code> · Typisch unter 30 Min.
      </div>

      {/* DNS Records */}
      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 18 }}>
          DNS-Records für All-inkl (herrundfrauklein.com)
        </div>

        <div style={{ overflowX: 'auto', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Typ', 'Host', 'Wert', 'Aktion'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', background: 'var(--border)', color: 'var(--muted-l)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DNS_RECORDS.map((r, i) => (
                <DnsRow key={i} record={r} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* E-Mail Setup */}
      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          E-Mail Kanal konfigurieren
        </div>
        <CopyField label="Support-Adresse (Zendesk)" value={CUSTOMER.email} />
        <CopyField label="Absender-Name" value="Herr & Frau Klein Service" />
        <CopyField label="Zendesk Subdomain" value={CUSTOMER.zendeskSubdomain} />
        <CopyField label="Eingangsbestätigung Timing" value="Wir antworten innerhalb von 8 Stunden" />
      </Card>

      {/* Zendesk URLs */}
      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          Wichtige URLs & Pfade
        </div>
        {[
          ['Zendesk Admin Center', `https://${CUSTOMER.zendeskSubdomain}/admin`],
          ['DKIM Keys finden', `https://${CUSTOMER.zendeskSubdomain}/admin/channels/email`],
          ['JTL Marketplace App', `https://${CUSTOMER.zendeskSubdomain}/admin/apps-and-integrations/apps/marketplace`],
          ['DNS Checker', 'https://dnschecker.org'],
          ['SPF Validator', 'https://mxtoolbox.com/spf.aspx'],
          ['JTL REST API Endpoint', `https://${CUSTOMER.url}/api/v1`],
        ].map(([label, url]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: 'var(--muted-l)', minWidth: 220, flexShrink: 0 }}>{label}</span>
            <code style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)' }}>{url}</code>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(url)}
            >
              ⧉
            </Button>
          </div>
        ))}
      </Card>
    </div>
  )
}

function DnsRow({ record }) {
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-l)', whiteSpace: 'nowrap' }}>{record.type}</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--blue)', whiteSpace: 'nowrap' }}>{record.host}</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 11, color: record.pending ? 'var(--amber)' : 'var(--green)', maxWidth: 320, wordBreak: 'break-all', lineHeight: 1.5 }}>{record.value}</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
        {record.pending
          ? <Badge color="amber">AUSSTEHEND</Badge>
          : <Button size="sm" variant="secondary" onClick={copy}>{copied ? '✓' : '⧉ Kopieren'}</Button>
        }
      </td>
    </tr>
  )
}
