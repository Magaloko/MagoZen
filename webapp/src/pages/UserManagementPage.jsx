import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useProjects } from '../context/ProjectContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

function generateToken() {
  return crypto.randomUUID()
}

function InviteModal({ project, onClose }) {
  const [email, setEmail]     = useState('')
  const [link, setLink]       = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied]   = useState(false)

  const create = async () => {
    setLoading(true)
    const token = generateToken()
    const { error } = await supabase
      .from('project_members')
      .insert([{ project_id: project.id, invite_token: token, invite_email: email || null, visible_pages: [] }])
    if (!error) {
      setLink(`${window.location.origin}/register?token=${token}`)
    }
    setLoading(false)
  }

  const copy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, width: '100%', maxWidth: 480 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Einladungslink</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 20 }}>
          Projekt: {project.short_name || project.name}
        </div>

        {!link ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--muted-l)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
                E-Mail (optional — wird im Formular vorausgefüllt)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kunde@firma.de"
                style={{ width: '100%', padding: '9px 12px', fontSize: 13, background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--white-d)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted-l)', cursor: 'pointer', fontSize: 13 }}>Abbrechen</button>
              <button onClick={create} disabled={loading} style={{ padding: '8px 16px', background: 'var(--green)', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                {loading ? 'Erstelle...' : 'Link generieren'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, color: 'var(--muted-l)', marginBottom: 12 }}>
              Schicken Sie diesen Link an den Kunden. Er ist einmalig nutzbar.
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <input readOnly value={link} style={{ flex: 1, padding: '9px 12px', fontSize: 11, background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted-l)', outline: 'none', fontFamily: 'var(--font-mono)' }} />
              <button onClick={copy} style={{ padding: '8px 14px', background: copied ? 'rgba(63,207,142,.15)' : 'var(--ink)', border: `1px solid ${copied ? 'var(--green-b)' : 'var(--border)'}`, borderRadius: 6, color: copied ? 'var(--green)' : 'var(--muted-l)', cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap', transition: 'all .15s' }}>
                {copied ? '✓ Kopiert' : 'Kopieren'}
              </button>
            </div>
            <div style={{ padding: '10px 12px', background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.15)', borderRadius: 6, fontSize: 12, color: 'var(--amber)', marginBottom: 20 }}>
              Seiten-Zugriff wird nach der Registrierung in dieser Übersicht konfiguriert.
            </div>
            <button onClick={onClose} style={{ width: '100%', padding: '9px 16px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted-l)', cursor: 'pointer', fontSize: 13 }}>Schließen</button>
          </>
        )}
      </div>
    </div>
  )
}

const TOGGLEABLE_PAGES = [
  { seg: 'phasen',    label: 'Phasen',         icon: '◈' },
  { seg: 'checkliste',label: 'Go-Live Check',   icon: '✓' },
  { seg: 'makros',    label: 'Makros',          icon: '⚡' },
  { seg: 'dns',       label: 'DNS & E-Mail',    icon: '◎' },
  { seg: 'risiken',   label: 'Risiken',         icon: '△' },
  { seg: 'kunde',     label: 'Kundendaten',     icon: '◇' },
  { seg: 'fragen',    label: 'Fragenkatalog',   icon: '≡' },
  { seg: 'faq',       label: 'FAQ',             icon: '?' },
  { seg: 'demo',      label: 'Demo & Schulung', icon: '▷' },
]

const ghostBtn = {
  padding: '4px 10px', borderRadius: 5, fontSize: 11,
  border: '1px solid var(--border)', background: 'transparent',
  color: 'var(--muted-l)', cursor: 'pointer', fontFamily: 'var(--font-mono)',
  transition: 'all .15s',
}

export default function UserManagementPage() {
  const { projects } = useProjects()
  const [users, setUsers]     = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [saving, setSaving]   = useState(false)
  const [inviteProject, setInviteProject] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [{ data: profiles }, { data: membersData }] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at'),
      supabase.from('project_members').select('*').order('invited_at'),
    ])
    setUsers(profiles || [])
    setMembers(membersData || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const userMembers = (userId) => members.filter((m) => m.user_id === userId)
  const getMember   = (userId, projectId) => members.find((m) => m.user_id === userId && m.project_id === projectId)

  const assignProject = async (userId, projectId) => {
    setSaving(true)
    const { data } = await supabase
      .from('project_members')
      .insert([{ project_id: projectId, user_id: userId, visible_pages: [], accepted_at: new Date().toISOString() }])
      .select().single()
    if (data) setMembers((prev) => [...prev, data])
    setSaving(false)
  }

  const unassignProject = async (memberId) => {
    if (!window.confirm('Projektzugang wirklich entziehen?')) return
    setSaving(true)
    await supabase.from('project_members').delete().eq('id', memberId)
    setMembers((prev) => prev.filter((m) => m.id !== memberId))
    setSaving(false)
  }

  const togglePage = async (memberId, seg) => {
    const member = members.find((m) => m.id === memberId)
    if (!member) return
    const current = member.visible_pages || []
    const updated = current.includes(seg) ? current.filter((s) => s !== seg) : [...current, seg]
    setSaving(true)
    const { data } = await supabase.from('project_members').update({ visible_pages: updated }).eq('id', memberId).select().single()
    if (data) setMembers((prev) => prev.map((m) => (m.id === memberId ? data : m)))
    setSaving(false)
  }

  const toggleAllPages = async (memberId, enable) => {
    const updated = enable ? TOGGLEABLE_PAGES.map((p) => p.seg) : []
    setSaving(true)
    const { data } = await supabase.from('project_members').update({ visible_pages: updated }).eq('id', memberId).select().single()
    if (data) setMembers((prev) => prev.map((m) => (m.id === memberId ? data : m)))
    setSaving(false)
  }

  const changeRole = async (userId, newRole) => {
    if (!window.confirm(`Rolle zu "${newRole}" wechseln?`)) return
    setSaving(true)
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
    setSaving(false)
  }

  if (loading) {
    return <div style={{ padding: 40, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Laden...</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {inviteProject && <InviteModal project={inviteProject} onClose={() => setInviteProject(null)} />}

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>
            Admin · Benutzerverwaltung
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--white)', margin: 0 }}>
            Benutzer & Zugriffsrechte
          </h1>
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          {users.length} Accounts · {projects.length} Projekte
        </div>
      </div>

      {/* User cards */}
      {users.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 13, color: 'var(--muted-l)' }}>Noch keine Benutzer registriert.</div>
        </Card>
      ) : (
        users.map((user) => {
          const isExpanded = expanded === user.id
          const uMembers   = userMembers(user.id)
          const initials   = (user.display_name || user.email || '?')[0].toUpperCase()
          const isAdmin    = user.role === 'admin'

          return (
            <Card key={user.id}>
              {/* ── User header row ── */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => setExpanded(isExpanded ? null : user.id)}
              >
                {/* Avatar */}
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  background: isAdmin ? 'var(--green-d)' : 'rgba(59,130,246,.1)',
                  border: isAdmin ? '1px solid var(--green-b)' : '1px solid rgba(59,130,246,.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700,
                  color: isAdmin ? 'var(--green)' : 'var(--blue)',
                }}>
                  {initials}
                </div>

                {/* Name + email */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--white)', marginBottom: 2 }}>
                    {user.display_name || user.email}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </div>
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <Badge color={isAdmin ? 'green' : 'blue'}>
                    {isAdmin ? 'Admin' : 'Kunde'}
                  </Badge>
                  {uMembers.map((m) => {
                    const proj = projects.find((p) => p.id === m.project_id)
                    return proj ? (
                      <span key={m.id} style={{
                        fontSize: 11, padding: '3px 8px', borderRadius: 10,
                        background: 'var(--ink-m)', border: '1px solid var(--border)',
                        color: 'var(--muted-l)', fontFamily: 'var(--font-mono)',
                      }}>
                        {proj.short_name || proj.name}
                      </span>
                    ) : null
                  })}
                  <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 4 }}>
                    {isExpanded ? '▴' : '▾'}
                  </span>
                </div>
              </div>

              {/* ── Expanded panel ── */}
              {isExpanded && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 18 }}>

                  {/* Role control */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)' }}>Rolle:</span>
                    <button
                      onClick={() => changeRole(user.id, isAdmin ? 'customer' : 'admin')}
                      disabled={saving}
                      style={{
                        ...ghostBtn,
                        borderColor: isAdmin ? 'rgba(59,130,246,.3)' : 'var(--green-b)',
                        color: isAdmin ? 'var(--blue)' : 'var(--green)',
                      }}
                    >
                      {isAdmin ? '→ zu Kunde wechseln' : '→ zu Admin wechseln'}
                    </button>
                  </div>

                  {/* Project assignments */}
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
                      Projektzugang
                    </div>

                    {projects.length === 0 ? (
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>Keine Projekte vorhanden.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {projects.map((project) => {
                          const member   = getMember(user.id, project.id)
                          const assigned = !!member

                          return (
                            <div key={project.id} style={{
                              border: '1px solid',
                              borderColor: assigned ? 'var(--green-b)' : 'var(--border)',
                              borderRadius: 8, overflow: 'hidden',
                              transition: 'border-color .15s',
                            }}>
                              {/* Project row */}
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                                background: assigned ? 'rgba(63,207,142,.04)' : 'transparent',
                              }}>
                                <input
                                  type="checkbox"
                                  checked={assigned}
                                  disabled={saving}
                                  onChange={() => assigned ? unassignProject(member.id) : assignProject(user.id, project.id)}
                                  style={{ width: 17, height: 17, cursor: 'pointer', accentColor: 'var(--green)', flexShrink: 0 }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: assigned ? 'var(--white)' : 'var(--muted-l)' }}>
                                    {project.name}
                                  </div>
                                  {project.short_name && project.short_name !== project.name && (
                                    <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                                      {project.short_name}
                                    </div>
                                  )}
                                </div>
                                {assigned && (
                                  <Badge color="green">Aktiv</Badge>
                                )}
                                {!assigned && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setInviteProject(project) }}
                                    style={{ ...ghostBtn, borderColor: 'rgba(63,207,142,.25)', color: 'var(--green)', fontSize: 10 }}
                                  >
                                    + Einladungslink
                                  </button>
                                )}
                              </div>

                              {/* Visible pages (only when assigned) */}
                              {assigned && (
                                <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', background: 'var(--ink)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
                                    <span style={{ fontSize: 11, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)' }}>
                                      Sichtbare Seiten ({(member.visible_pages || []).length}/{TOGGLEABLE_PAGES.length})
                                    </span>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                      <button onClick={() => toggleAllPages(member.id, true)}  disabled={saving} style={ghostBtn}>Alle ✓</button>
                                      <button onClick={() => toggleAllPages(member.id, false)} disabled={saving} style={ghostBtn}>Keine</button>
                                    </div>
                                  </div>

                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 6 }}>
                                    {TOGGLEABLE_PAGES.map(({ seg, label, icon }) => {
                                      const active = (member.visible_pages || []).includes(seg)
                                      return (
                                        <label
                                          key={seg}
                                          onClick={() => togglePage(member.id, seg)}
                                          style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '7px 10px', borderRadius: 5, cursor: 'pointer',
                                            border: active ? '1px solid var(--green-b)' : '1px solid var(--border)',
                                            background: active ? 'rgba(63,207,142,.04)' : 'transparent',
                                            transition: 'all .15s', userSelect: 'none',
                                          }}
                                        >
                                          <div style={{
                                            width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                                            border: active ? '2px solid var(--green)' : '2px solid var(--border-l)',
                                            background: active ? 'var(--green)' : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all .15s',
                                          }}>
                                            {active && <span style={{ color: 'var(--ink)', fontSize: 9, fontWeight: 700 }}>✓</span>}
                                          </div>
                                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, width: 14, textAlign: 'center', color: active ? 'var(--green)' : 'var(--muted)' }}>
                                            {icon}
                                          </span>
                                          <span style={{ fontSize: 12, color: active ? 'var(--white-d)' : 'var(--muted-l)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {label}
                                          </span>
                                        </label>
                                      )
                                    })}
                                  </div>

                                  <div style={{ marginTop: 10, padding: '8px 10px', background: 'var(--ink-m)', borderRadius: 5, fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                                    Immer gesperrt: Angebot (€) · Intern (⊙)
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          )
        })
      )}
    </div>
  )
}
