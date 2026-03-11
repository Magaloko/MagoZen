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

export default function MacrosPage() {
  const { projectId } = useParams()
  const { project } = useProject(projectId)
  const { t } = useLanguage()
  const [selected, setSelected] = useState(null)
  const [copied, setCopied] = useState(false)
  const macros = project?.service_package?.macros || MACROS

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
