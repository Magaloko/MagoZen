import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const inviteToken = params.get('token') || ''

  const [invite, setInvite] = useState(null)
  const [loadingInvite, setLoadingInvite] = useState(!!inviteToken)

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Load invite details if token present
  useEffect(() => {
    if (!inviteToken) return
    const load = async () => {
      const { data } = await supabase
        .from('project_members')
        .select('*, projects(name, short_name)')
        .eq('invite_token', inviteToken)
        .is('user_id', null)
        .single()
      if (data) {
        setInvite(data)
        if (data.invite_email) setEmail(data.invite_email)
      }
      setLoadingInvite(false)
    }
    load()
  }, [inviteToken])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== passwordConfirm) {
      setError('Passwörter stimmen nicht überein.')
      return
    }
    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein.')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password, displayName, inviteToken || undefined)
      setSuccess(true)
    } catch (err) {
      if (err.message?.includes('already registered')) {
        setError('Diese E-Mail ist bereits registriert. Bitte anmelden.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', padding: 20,
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12, color: 'var(--green)' }}>✓</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>
                Registrierung erfolgreich!
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted-l)', marginBottom: 20, lineHeight: 1.5 }}>
                Dein Account wurde erstellt. Du kannst dich jetzt anmelden.
              </div>
              <Button variant="primary" onClick={() => navigate('/login')} style={{ width: '100%', justifyContent: 'center' }}>
                Zur Anmeldung
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--green)', marginBottom: 6 }}>
            DADAKAEV_LABS
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            Kunden-Registrierung
          </div>
        </div>

        <Card>
          {loadingInvite ? (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              Einladung wird geladen...
            </div>
          ) : (
            <>
              {invite && (
                <div style={{ padding: '10px 12px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 6, marginBottom: 20, fontSize: 13, color: 'var(--green)' }}>
                  Einladung zum Projekt: <strong>{invite.projects?.short_name || invite.projects?.name || 'Projekt'}</strong>
                </div>
              )}

              {inviteToken && !invite && !loadingInvite && (
                <div style={{ padding: '10px 12px', background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 6, marginBottom: 20, fontSize: 13, color: 'var(--amber)' }}>
                  Einladungslink ungültig oder bereits verwendet.
                </div>
              )}

              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)', marginBottom: 24, textAlign: 'center' }}>
                Registrieren
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--muted-l)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    autoFocus
                    placeholder="Vor- und Nachname"
                    style={{
                      width: '100%', padding: '10px 12px', fontSize: 14,
                      background: 'var(--ink)', border: '1px solid var(--border)',
                      borderRadius: 6, color: 'var(--white-d)', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--muted-l)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
                    E-Mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    readOnly={!!invite?.invite_email}
                    style={{
                      width: '100%', padding: '10px 12px', fontSize: 14,
                      background: invite?.invite_email ? 'var(--ink-m)' : 'var(--ink)',
                      border: '1px solid var(--border)',
                      borderRadius: 6, color: 'var(--white-d)', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--muted-l)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
                    Passwort
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{
                      width: '100%', padding: '10px 12px', fontSize: 14,
                      background: 'var(--ink)', border: '1px solid var(--border)',
                      borderRadius: 6, color: 'var(--white-d)', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--muted-l)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
                    Passwort bestätigen
                  </label>
                  <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                    style={{
                      width: '100%', padding: '10px 12px', fontSize: 14,
                      background: 'var(--ink)', border: '1px solid var(--border)',
                      borderRadius: 6, color: 'var(--white-d)', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {error && (
                  <div style={{ padding: '10px 12px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 6, fontSize: 13, color: '#ef4444' }}>
                    {error}
                  </div>
                )}

                <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', justifyContent: 'center' }}>
                  Registrieren
                </Button>
              </form>

              <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--muted-l)' }}>
                Bereits registriert?{' '}
                <Link to="/login" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 600 }}>
                  Anmelden
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
