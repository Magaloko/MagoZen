import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useProject } from '../context/ProjectContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const TOGGLEABLE_PAGES = [
  { seg: 'phasen', label: 'Phasen', icon: '◈' },
  { seg: 'checkliste', label: 'Go-Live Checkliste', icon: '✓' },
  { seg: 'makros', label: 'Makros', icon: '⚡' },
  { seg: 'dns', label: 'DNS & E-Mail', icon: '◎' },
  { seg: 'risiken', label: 'Risiken', icon: '△' },
  { seg: 'kunde', label: 'Kundendaten', icon: '◇' },
  { seg: 'fragen', label: 'Fragenkatalog', icon: '≡' },
  { seg: 'faq', label: 'FAQ', icon: '?' },
  { seg: 'demo', label: 'Demo & Schulung', icon: '▷' },
]

export default function ProjectSettingsPage() {
  const { projectId } = useParams()
  const { project } = useProject(projectId)
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const loadMember = useCallback(async () => {
    const { data } = await supabase
      .from('project_members')
      .select('*, profiles(email, display_name)')
      .eq('project_id', projectId)
      .order('invited_at', { ascending: false })
      .limit(1)
      .single()
    setMember(data)
    setLoading(false)
  }, [projectId])

  useEffect(() => { loadMember() }, [loadMember])

  const generateInvite = async () => {
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('project_members')
        .insert([{
          project_id: projectId,
          invite_email: inviteEmail || null,
          visible_pages: [],
        }])
        .select()
        .single()
      if (!error && data) {
        setMember(data)
        setInviteEmail('')
      }
    } finally {
      setSaving(false)
    }
  }

  const togglePage = async (seg) => {
    if (!member) return
    const current = member.visible_pages || []
    const updated = current.includes(seg)
      ? current.filter((s) => s !== seg)
      : [...current, seg]

    setSaving(true)
    const { data } = await supabase
      .from('project_members')
      .update({ visible_pages: updated })
      .eq('id', member.id)
      .select()
      .single()
    if (data) setMember(data)
    setSaving(false)
  }

  const toggleAll = async (enable) => {
    if (!member) return
    const updated = enable ? TOGGLEABLE_PAGES.map((p) => p.seg) : []
    setSaving(true)
    const { data } = await supabase
      .from('project_members')
      .update({ visible_pages: updated })
      .eq('id', member.id)
      .select()
      .single()
    if (data) setMember(data)
    setSaving(false)
  }

  const revokeAccess = async () => {
    if (!member) return
    if (!window.confirm('Zugang wirklich entziehen? Der Kunde verliert sofort den Zugriff.')) return
    await supabase.from('project_members').delete().eq('id', member.id)
    setMember(null)
  }

  const inviteUrl = member?.invite_token
    ? `${window.location.origin}/register?token=${member.invite_token}`
    : ''

  const copyLink = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <div style={{ padding: 40, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Laden...</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
        Projekt-Einstellungen: {project?.short_name || project?.name}
      </div>

      {/* Invite Section */}
      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          Kunden-Zugang
        </div>

        {!member ? (
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted-l)', marginBottom: 16, lineHeight: 1.5 }}>
              Noch kein Kunde eingeladen. Generiere einen Einladungslink, den der Kunde zum Registrieren nutzt.
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--muted-l)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
                  Kunden-E-Mail (optional)
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="kunde@firma.de"
                  style={{
                    width: '100%', padding: '8px 10px', fontSize: 13,
                    background: 'var(--ink)', border: '1px solid var(--border)',
                    borderRadius: 6, color: 'var(--white-d)', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <Button variant="primary" onClick={generateInvite} loading={saving}>
                Einladung generieren
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: member.accepted_at ? 'var(--green-d)' : 'rgba(245,158,11,.1)',
                border: member.accepted_at ? '1px solid var(--green-b)' : '1px solid rgba(245,158,11,.2)',
                color: member.accepted_at ? 'var(--green)' : 'var(--amber)',
              }}>
                {member.accepted_at ? 'Angenommen' : 'Ausstehend'}
              </div>
              {member.profiles?.display_name && (
                <span style={{ fontSize: 13, color: 'var(--white-d)' }}>
                  {member.profiles.display_name}
                </span>
              )}
              {(member.invite_email || member.profiles?.email) && (
                <span style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)' }}>
                  {member.profiles?.email || member.invite_email}
                </span>
              )}
            </div>

            {/* Invite link (only if not yet accepted) */}
            {!member.accepted_at && (
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--muted-l)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
                  Einladungslink
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={inviteUrl}
                    readOnly
                    style={{
                      flex: 1, padding: '8px 10px', fontSize: 11,
                      background: 'var(--ink)', border: '1px solid var(--border)',
                      borderRadius: 6, color: 'var(--green)', outline: 'none',
                      fontFamily: 'var(--font-mono)', boxSizing: 'border-box',
                    }}
                  />
                  <Button size="sm" variant="secondary" onClick={copyLink}>
                    {copied ? 'Kopiert!' : 'Kopieren'}
                  </Button>
                </div>
              </div>
            )}

            {/* Revoke */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
              <Button size="sm" variant="danger" onClick={revokeAccess}>
                Zugang entziehen
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Visibility Toggles */}
      {member && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
              Sichtbare Seiten für Kunden
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="sm" variant="ghost" onClick={() => toggleAll(true)}>Alle aktivieren</Button>
              <Button size="sm" variant="ghost" onClick={() => toggleAll(false)}>Alle deaktivieren</Button>
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--muted-l)', marginBottom: 16, lineHeight: 1.5 }}>
            Das Dashboard ist immer sichtbar. Angebot und Intern sind für Kunden gesperrt.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
            {TOGGLEABLE_PAGES.map(({ seg, label, icon }) => {
              const active = (member.visible_pages || []).includes(seg)
              return (
                <label
                  key={seg}
                  onClick={() => togglePage(seg)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 6, cursor: 'pointer',
                    border: active ? '1px solid var(--green-b)' : '1px solid var(--border)',
                    background: active ? 'rgba(63,207,142,.04)' : 'transparent',
                    transition: 'all .15s',
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                    border: active ? '2px solid var(--green)' : '2px solid var(--border-l)',
                    background: active ? 'var(--green)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .15s',
                  }}>
                    {active && <span style={{ color: 'var(--ink)', fontSize: 11, fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, width: 16, textAlign: 'center', color: active ? 'var(--green)' : 'var(--muted)' }}>
                    {icon}
                  </span>
                  <span style={{ fontSize: 13, color: active ? 'var(--white-d)' : 'var(--muted-l)' }}>
                    {label}
                  </span>
                </label>
              )
            })}
          </div>

          {/* Always-hidden info */}
          <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--ink)', borderRadius: 6, fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            Immer gesperrt: Angebot (€) · Intern (⊙)
          </div>
        </Card>
      )}
    </div>
  )
}
