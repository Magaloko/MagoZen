import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useProject } from '../context/ProjectContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const TOGGLEABLE_PAGES = [
  { seg: 'phasen',    label: 'Phasen',         icon: '◈' },
  { seg: 'checkliste',label: 'Go-Live Checkliste', icon: '✓' },
  { seg: 'makros',    label: 'Makros',          icon: '⚡' },
  { seg: 'dns',       label: 'DNS & E-Mail',    icon: '◎' },
  { seg: 'risiken',   label: 'Risiken',         icon: '△' },
  { seg: 'kunde',     label: 'Kundendaten',     icon: '◇' },
  { seg: 'fragen',    label: 'Fragenkatalog',   icon: '≡' },
  { seg: 'faq',       label: 'FAQ',             icon: '?' },
  { seg: 'demo',      label: 'Demo & Schulung', icon: '▷' },
]

function MemberCard({ member, onTogglePage, onToggleAll, onRevoke, onCopied, copied, saving }) {
  const inviteUrl = member.invite_token
    ? `${window.location.origin}/register?token=${member.invite_token}`
    : ''

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 12,
    }}>
      {/* Member header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{
          padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
          background: member.accepted_at ? 'var(--green-d)' : 'rgba(245,158,11,.1)',
          border: member.accepted_at ? '1px solid var(--green-b)' : '1px solid rgba(245,158,11,.2)',
          color: member.accepted_at ? 'var(--green)' : 'var(--amber)',
        }}>
          {member.accepted_at ? 'Angenommen' : 'Ausstehend'}
        </div>
        {member.profiles?.display_name && (
          <span style={{ fontSize: 13, color: 'var(--white-d)', fontWeight: 600 }}>
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
      {!member.accepted_at && inviteUrl && (
        <div style={{ padding: '0 16px 12px' }}>
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
            <Button size="sm" variant="secondary" onClick={() => onCopied(inviteUrl)}>
              {copied === inviteUrl ? 'Kopiert!' : 'Kopieren'}
            </Button>
          </div>
        </div>
      )}

      {/* Visible pages */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--ink)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)' }}>
            Sichtbare Seiten ({(member.visible_pages || []).length}/{TOGGLEABLE_PAGES.length})
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" variant="ghost" onClick={() => onToggleAll(member.id, true)}>Alle aktivieren</Button>
            <Button size="sm" variant="ghost" onClick={() => onToggleAll(member.id, false)}>Alle deaktivieren</Button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 8 }}>
          {TOGGLEABLE_PAGES.map(({ seg, label, icon }) => {
            const active = (member.visible_pages || []).includes(seg)
            return (
              <label
                key={seg}
                onClick={() => onTogglePage(member.id, seg)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 6, cursor: 'pointer',
                  border: active ? '1px solid var(--green-b)' : '1px solid var(--border)',
                  background: active ? 'rgba(63,207,142,.04)' : 'transparent',
                  transition: 'all .15s', userSelect: 'none',
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

        <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--ink-m)', borderRadius: 6, fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          Immer gesperrt: Angebot (€) · Intern (⊙)
        </div>
      </div>

      {/* Revoke */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="sm" variant="danger" onClick={() => onRevoke(member.id)} loading={saving}>
          Zugang entziehen
        </Button>
      </div>
    </div>
  )
}

export default function ProjectSettingsPage() {
  const { projectId } = useParams()
  const { project } = useProject(projectId)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [copied, setCopied]   = useState('')
  const [inviteEmail, setInviteEmail] = useState('')

  const loadMembers = useCallback(async () => {
    const { data } = await supabase
      .from('project_members')
      .select('*, profiles(email, display_name)')
      .eq('project_id', projectId)
      .order('invited_at', { ascending: false })
    setMembers(data || [])
    setLoading(false)
  }, [projectId])

  useEffect(() => { loadMembers() }, [loadMembers])

  const generateInvite = async () => {
    setSaving(true)
    const { data, error } = await supabase
      .from('project_members')
      .insert([{ project_id: projectId, invite_email: inviteEmail || null, visible_pages: [] }])
      .select('*, profiles(email, display_name)')
      .single()
    if (!error && data) {
      setMembers((prev) => [data, ...prev])
      setInviteEmail('')
    }
    setSaving(false)
  }

  const togglePage = async (memberId, seg) => {
    const member = members.find((m) => m.id === memberId)
    if (!member) return
    const current = member.visible_pages || []
    const updated = current.includes(seg) ? current.filter((s) => s !== seg) : [...current, seg]
    setSaving(true)
    const { data } = await supabase.from('project_members').update({ visible_pages: updated }).eq('id', memberId).select('*, profiles(email, display_name)').single()
    if (data) setMembers((prev) => prev.map((m) => (m.id === memberId ? data : m)))
    setSaving(false)
  }

  const toggleAll = async (memberId, enable) => {
    const updated = enable ? TOGGLEABLE_PAGES.map((p) => p.seg) : []
    setSaving(true)
    const { data } = await supabase.from('project_members').update({ visible_pages: updated }).eq('id', memberId).select('*, profiles(email, display_name)').single()
    if (data) setMembers((prev) => prev.map((m) => (m.id === memberId ? data : m)))
    setSaving(false)
  }

  const revokeAccess = async (memberId) => {
    if (!window.confirm('Zugang wirklich entziehen? Der Kunde verliert sofort den Zugriff.')) return
    await supabase.from('project_members').delete().eq('id', memberId)
    setMembers((prev) => prev.filter((m) => m.id !== memberId))
  }

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(''), 2000)
  }

  if (loading) {
    return <div style={{ padding: 40, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Laden...</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
        Projekt-Einstellungen: {project?.short_name || project?.name}
      </div>

      {/* Invite new member */}
      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
          Neuen Kunden einladen
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted-l)', marginBottom: 16, lineHeight: 1.5 }}>
          Generiere einen Einladungslink. Der Kunde registriert sich damit und erhält sofort Zugang.
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
      </Card>

      {/* Member list */}
      {members.length > 0 && (
        <Card>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>
            Kunden-Zugänge ({members.length})
          </div>
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onTogglePage={togglePage}
              onToggleAll={toggleAll}
              onRevoke={revokeAccess}
              onCopied={handleCopy}
              copied={copied}
              saving={saving}
            />
          ))}
        </Card>
      )}

      {members.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 13, color: 'var(--muted-l)' }}>Noch keine Kunden für dieses Projekt eingeladen.</div>
        </Card>
      )}
    </div>
  )
}
