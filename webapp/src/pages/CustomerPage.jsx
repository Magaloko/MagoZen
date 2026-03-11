import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CUSTOMER, GRUPPEN, LIZENZEN, COPILOT_SETTINGS } from '../data/hfkData'
import { useProject } from '../context/ProjectContext'
import { useLanguage } from '../context/LanguageContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

const FIELDS = [
  { key: 'name', labelKey: 'customer.labels.name' },
  { key: 'short', labelKey: 'customer.labels.short', mono: true },
  { key: 'url', labelKey: 'customer.labels.url', mono: true },
  { key: 'email', labelKey: 'customer.labels.email', mono: true },
  { key: 'hoster', labelKey: 'customer.labels.hoster' },
  { key: 'zendeskSubdomain', labelKey: 'customer.labels.zendesk', mono: true },
  { key: 'jtlShop', labelKey: 'customer.labels.jtlShop', mono: true },
  { key: 'jtlWawi', labelKey: 'customer.labels.jtlWawi', mono: true },
  { key: 'volumen', labelKey: 'customer.labels.volume' },
  { key: 'markt', labelKey: 'customer.labels.market' },
  { key: 'timezone', labelKey: 'customer.labels.tz', mono: true },
  { key: 'sortiment', labelKey: 'customer.labels.range' },
  { key: 'aktuelleKanäle', labelKey: 'customer.labels.channels' },
]

function Row({ label, value, mono, editing, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13, alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ color: 'var(--muted-l)', minWidth: 140, flexShrink: 0 }}>{label}</span>
      {editing ? (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1, minWidth: 160,
            fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
            fontSize: mono ? 12 : 13,
            color: 'var(--white-d)',
            background: 'var(--ink)',
            border: '1px solid var(--border)',
            borderRadius: 5,
            padding: '5px 8px',
            outline: 'none',
          }}
        />
      ) : (
        <span style={{
          fontFamily: mono ? 'var(--font-mono)' : undefined,
          fontSize: mono ? 12 : 13,
          color: value ? (mono ? 'var(--green)' : 'var(--white-d)') : 'var(--muted)',
          wordBreak: 'break-all',
        }}>
          {value || '—'}
        </span>
      )}
    </div>
  )
}

export default function CustomerPage() {
  const { projectId } = useParams()
  const { project, update } = useProject(projectId)
  const { t } = useLanguage()
  const [editing, setEditing]     = useState(false)
  const [draft, setDraft]         = useState(null)
  const [original, setOriginal]   = useState(null)
  const [saving, setSaving]       = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [changedFields, setChangedFields] = useState([])

  const customer        = project?.customer_data || CUSTOMER
  const lizenzen        = project?.service_package?.lizenzen || LIZENZEN
  const gruppen         = project?.service_package?.gruppen || GRUPPEN
  const copilotSettings = project?.service_package?.copilot_settings || COPILOT_SETTINGS

  const agentsLabel = project
    ? [
        project.service_package?.agents_full  ? `${project.service_package.agents_full} Full`  : null,
        project.service_package?.agents_light ? `${project.service_package.agents_light} Light` : null,
      ].filter(Boolean).join(' + ') || '–'
    : '6 Agenten (4 Full + 2 Light)'

  const startEdit = () => {
    const snap = { ...customer }
    setOriginal(snap)
    setDraft({ ...snap })
    setEditing(true)
  }

  const cancelEdit = () => {
    setDraft(null)
    setOriginal(null)
    setEditing(false)
    setConfirmOpen(false)
  }

  // Intercept save — compute diff and show modal if anything changed
  const requestSave = () => {
    const changed = FIELDS.filter((f) => (draft[f.key] ?? '') !== (original[f.key] ?? ''))
    if (changed.length === 0) {
      // No changes — just close edit mode
      setEditing(false)
      setDraft(null)
      setOriginal(null)
      return
    }
    setChangedFields(changed)
    setConfirmOpen(true)
  }

  const confirmSave = async () => {
    setSaving(true)
    try {
      await update({ customer_data: draft })
      setEditing(false)
      setDraft(null)
      setOriginal(null)
      setConfirmOpen(false)
    } catch (e) {
      console.error('Save failed:', e)
    } finally {
      setSaving(false)
    }
  }

  const updateField = (key, val) => {
    setDraft((prev) => ({ ...prev, [key]: val }))
  }

  const displayData = editing ? draft : customer

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Confirmation Modal */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Änderungen bestätigen"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Zurück zum Bearbeiten</Button>
            <Button variant="primary" onClick={confirmSave} loading={saving}>Bestätigen & Speichern</Button>
          </>
        }
      >
        <div style={{ fontSize: 13, color: 'var(--muted-l)', marginBottom: 16 }}>
          Folgende Felder werden geändert. Bitte prüfen Sie die Änderungen vor dem Speichern.
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {['Feld', 'Vorher', 'Nachher'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', background: 'var(--border)', color: 'var(--muted-l)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {changedFields.map((f) => (
                <tr key={f.key}>
                  <td style={{ padding: '9px 10px', borderBottom: '1px solid var(--border)', color: 'var(--muted-l)', whiteSpace: 'nowrap' }}>{t(f.labelKey)}</td>
                  <td style={{ padding: '9px 10px', borderBottom: '1px solid var(--border)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 11, maxWidth: 200, wordBreak: 'break-all' }}>
                    {original[f.key] || '—'}
                  </td>
                  <td style={{ padding: '9px 10px', borderBottom: '1px solid var(--border)', color: 'var(--green)', fontFamily: 'var(--font-mono)', fontSize: 11, maxWidth: 200, wordBreak: 'break-all' }}>
                    {draft[f.key] || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
            {t('customer.confirmed')}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {editing ? (
              <>
                <Button size="sm" variant="ghost" onClick={cancelEdit}>Abbrechen</Button>
                <Button size="sm" variant="primary" onClick={requestSave} loading={saving}>Speichern</Button>
              </>
            ) : (
              <Button size="sm" variant="secondary" onClick={startEdit}>✎ Bearbeiten</Button>
            )}
          </div>
        </div>

        {FIELDS.map((f) => (
          <Row
            key={f.key}
            label={t(f.labelKey)}
            value={displayData[f.key]}
            mono={f.mono}
            editing={editing}
            onChange={(val) => updateField(f.key, val)}
          />
        ))}
        {!editing && <Row label={t('customer.labels.agents')} value={agentsLabel} />}
      </Card>

      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          {t('customer.branding')}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {Object.entries(customer.branding || {}).map(([name, hex]) => (
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
          {gruppen.map((g) => (
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
              {lizenzen.map((l, i) => (
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
        {copilotSettings.map((s) => (
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
