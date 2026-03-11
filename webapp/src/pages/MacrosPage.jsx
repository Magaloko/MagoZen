import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { MACROS } from '../data/hfkData'
import { useProject } from '../context/ProjectContext'
import { useLanguage } from '../context/LanguageContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

const typeColorMap = { green: 'green', amber: 'amber', blue: 'blue', red: 'red' }

const PA_BLUE = '#0078D4'
const PA_BLUE_BG = 'rgba(0,120,212,0.1)'
const PA_BLUE_BORDER = 'rgba(0,120,212,0.35)'

// PA flow type visual config
const FLOW_TYPE_CONFIG = {
  automated: { label: 'Cloud Automated', color: '#0078D4', bg: 'rgba(0,120,212,0.12)', border: 'rgba(0,120,212,0.3)', icon: '⚡' },
  scheduled:  { label: 'Scheduled',       color: '#D97706', bg: 'rgba(217,119,6,0.12)',  border: 'rgba(217,119,6,0.3)',  icon: '⏱' },
  instant:    { label: 'Instant',          color: '#16A34A', bg: 'rgba(22,163,74,0.12)',  border: 'rgba(22,163,74,0.3)',  icon: '▶' },
  desktop:    { label: 'Desktop / RPA',    color: '#7C3AED', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.3)', icon: '🖥' },
}

// Connector chip styles
const CONNECTOR_TYPE_STYLE = {
  Standard: { color: 'var(--muted-l)', bg: 'var(--ink-m)', border: 'var(--border)' },
  Premium:  { color: PA_BLUE, bg: PA_BLUE_BG, border: PA_BLUE_BORDER },
  Custom:   { color: '#D97706', bg: 'rgba(217,119,6,0.1)', border: 'rgba(217,119,6,0.3)' },
}

function FlowTypeBadge({ flowType }) {
  const cfg = FLOW_TYPE_CONFIG[flowType] || FLOW_TYPE_CONFIG.automated
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 20,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
      color: cfg.color, whiteSpace: 'nowrap',
    }}>
      {cfg.icon} {cfg.label}
    </span>
  )
}

function ConnectorChip({ name, connType }) {
  const style = CONNECTOR_TYPE_STYLE[connType] || CONNECTOR_TYPE_STYLE.Standard
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 4,
      background: style.bg, border: `1px solid ${style.border}`,
      fontSize: 10, color: style.color, fontFamily: 'var(--font-mono)',
      whiteSpace: 'nowrap',
    }}>
      {name}
    </span>
  )
}

// ── PA Flows View ─────────────────────────────────────────────────────────
function PAFlowsView({ flows, connections }) {
  const [selected, setSelected] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 13, color: 'var(--muted-l)', marginBottom: 4 }}>
        Automatisierungs-Flows für dieses Power Automate Projekt. Klicken für Details & Schritte.
      </div>

      {/* Flow Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
        {flows.map((flow) => (
          <Card key={flow.id} onClick={() => setSelected(flow)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px' }}>
                {flow.id}
              </span>
              <FlowTypeBadge flowType={flow.flowType} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--white)', marginBottom: 6 }}>{flow.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted-l)', marginBottom: 10, lineHeight: 1.4 }}>
              <span style={{ color: 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}>TRIGGER  </span>
              {flow.trigger}
            </div>
            {flow.connectors && flow.connectors.length > 0 && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                {flow.connectors.map((c, i) => {
                  // Determine connector type for chip styling
                  const connType = c.includes('Custom') ? 'Custom' : c.includes('JTL') || c.includes('Zendesk') || c.includes('HTTP') ? 'Premium' : 'Standard'
                  return <ConnectorChip key={i} name={c} connType={connType} />
                })}
              </div>
            )}
            <div style={{ marginTop: 6 }}>
              <Button size="sm" variant="ghost">Details ansehen →</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Connector Overview Table */}
      {connections && connections.length > 0 && (
        <Card style={{ marginTop: 8 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: PA_BLUE, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
            Connector-Übersicht
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 540 }}>
              <thead>
                <tr>
                  {['Connector', 'Typ', 'Auth-Methode', 'Status'].map((h) => (
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
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', color: 'var(--muted-l)', fontSize: 12 }}>
                        {conn.authMethod || conn.auth || '—'}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{
                          fontSize: 11, fontFamily: 'var(--font-mono)',
                          color: conn.status === 'active' ? 'var(--green)' : conn.status === 'pending' ? 'var(--amber)' : 'var(--muted)',
                        }}>
                          {conn.status === 'active' ? '● Aktiv' : conn.status === 'pending' ? '◐ Ausstehend' : '○ Inaktiv'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Flow Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.id} — ${selected.name}` : ''}
        footer={
          <Button variant="ghost" onClick={() => setSelected(null)}>Schließen</Button>
        }
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header info */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <FlowTypeBadge flowType={selected.flowType} />
              {selected.priority && (
                <span style={{
                  padding: '2px 8px', borderRadius: 20, fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700,
                  color: selected.priority === 'hoch' ? 'var(--red)' : selected.priority === 'mittel' ? 'var(--amber)' : 'var(--muted-l)',
                  background: selected.priority === 'hoch' ? 'rgba(239,68,68,.1)' : selected.priority === 'mittel' ? 'rgba(217,119,6,.1)' : 'var(--ink-m)',
                  border: selected.priority === 'hoch' ? '1px solid rgba(239,68,68,.3)' : '1px solid var(--border)',
                }}>
                  Priorität: {selected.priority}
                </span>
              )}
            </div>

            {/* Trigger */}
            <div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: PA_BLUE, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>Trigger</div>
              <div style={{ padding: '10px 12px', background: PA_BLUE_BG, border: `1px solid ${PA_BLUE_BORDER}`, borderRadius: 6, fontSize: 13, color: 'var(--white-d)' }}>
                {selected.trigger}
              </div>
            </div>

            {/* Conditions */}
            {selected.conditions && selected.conditions.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>Bedingungen</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {selected.conditions.map((cond, i) => (
                    <div key={i} style={{ padding: '8px 12px', background: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 5, fontSize: 13, color: 'var(--muted-l)' }}>
                      {cond}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Steps */}
            {selected.steps && selected.steps.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Aktionen / Schritte</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selected.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 12px', background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 5 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', background: PA_BLUE_BG, border: `1px solid ${PA_BLUE_BORDER}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700, color: PA_BLUE,
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--white-d)', lineHeight: 1.5, paddingTop: 1 }}>{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connectors */}
            {selected.connectors && selected.connectors.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>Verwendete Connectors</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {selected.connectors.map((c, i) => {
                    const connType = c.includes('Custom') ? 'Custom' : c.includes('JTL') || c.includes('Zendesk') || c.includes('HTTP') ? 'Premium' : 'Standard'
                    return <ConnectorChip key={i} name={c} connType={connType} />
                  })}
                </div>
              </div>
            )}

            {/* PA plan note */}
            {selected.available_from && selected.available_from !== 'free' && (
              <div style={{ padding: '8px 12px', background: PA_BLUE_BG, border: `1px solid ${PA_BLUE_BORDER}`, borderRadius: 5, fontSize: 12, color: PA_BLUE }}>
                ℹ Erfordert PA-Plan: <strong>{selected.available_from === 'premium' ? 'Premium (Per User)' : selected.available_from}</strong>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

// ── Zendesk Macros View ───────────────────────────────────────────────────
function ZendeskMacrosView({ macros, t }) {
  const [selected, setSelected] = useState(null)
  const [copied, setCopied] = useState(false)

  const copyTemplate = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 13, color: 'var(--muted-l)', marginBottom: 4 }}>
        {t('macros.subtitle')}
      </div>

      <div className="grid-auto-fill" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {macros.map((macro) => (
          <Card key={macro.id} onClick={() => setSelected(macro)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{macro.id}</span>
              <Badge color={typeColorMap[macro.typeColor] || 'gray'}>{macro.type}</Badge>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{macro.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted-l)', lineHeight: 1.5 }}>{macro.description}</div>
            <div style={{ marginTop: 14 }}>
              <Button size="sm" variant="ghost">{t('macros.open')}</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* SLA Info */}
      <Card style={{ marginTop: 8 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
          {t('macros.sla')}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 480 }}>
            <thead>
              <tr>
                {[t('macros.sla.policy'), t('macros.sla.firstReply'), t('macros.sla.resolution'), t('macros.sla.condition')].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', background: 'var(--border)', color: 'var(--muted-l)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Standard', '8h', '48h', 'Default · AT Geschäftszeiten Mo–Fr'],
                ['Dringend', '1h', '8h', 'Priorität = Urgent · Manuell oder Trigger'],
                ['Möbel & Sperrgut', '24h', '72h', 'Custom Field: Möbel-Sperrgut = true'],
              ].map(([name, first, res, cond], i) => (
                <tr key={name} style={{ background: i % 2 === 1 ? 'rgba(255,255,255,.02)' : 'transparent' }}>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>{name}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{first}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{res}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', color: 'var(--muted-l)', fontSize: 12 }}>{cond}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.id} — ${selected.name}` : ''}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelected(null)}>{t('macros.close')}</Button>
            <Button variant="primary" onClick={() => copyTemplate(selected?.template)}>
              {copied ? t('macros.copied') : t('macros.copy')}
            </Button>
          </>
        }
      >
        {selected && (
          <div>
            <div style={{ marginBottom: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge color={typeColorMap[selected.typeColor] || 'gray'}>{selected.type}</Badge>
              <span style={{ fontSize: 12, color: 'var(--muted-l)', alignSelf: 'center' }}>{selected.description}</span>
            </div>
            <pre style={{ background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 6, padding: 16, fontSize: 12, lineHeight: 1.7, color: 'var(--white-d)', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {selected.template}
            </pre>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ── Main Export ───────────────────────────────────────────────────────────
export default function MacrosPage() {
  const { projectId } = useParams()
  const { project } = useProject(projectId)
  const { t } = useLanguage()

  const svcType = project?.service_package?.service_type ?? 'zendesk'
  const macros = project?.service_package?.macros || MACROS
  const connections = project?.service_package?.connections || []

  if (svcType === 'power-automate') {
    return <PAFlowsView flows={macros} connections={connections} />
  }

  return <ZendeskMacrosView macros={macros} t={t} />
}
