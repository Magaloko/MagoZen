import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function LoginPage() {
  const { signIn, user, profile, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Redirect when user + profile are loaded (after login or already logged in)
  useEffect(() => {
    if (!loading && user && profile) {
      console.log('[Login] Redirecting to / — user:', user.email, 'role:', profile.role)
      navigate('/', { replace: true })
    }
  }, [loading, user, profile, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email, password)
      // Don't navigate here! useEffect above will redirect once profile loads.
    } catch (err) {
      console.error('[Login] Error:', err.message)
      setError(
        err.message === 'Invalid login credentials'
          ? 'E-Mail oder Passwort falsch.'
          : err.message
      )
      setSubmitting(false)
    }
  }

  // If already logged in, show loading while redirect happens
  if (!loading && user && profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Weiterleitung...</div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
            ← Zur Hauptseite
          </Link>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--green)', marginBottom: 6 }}>
            DADAKAEV_LABS
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            CRM Platform
          </div>
        </div>

        <Card>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)', marginBottom: 24, textAlign: 'center' }}>
            Anmelden
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--muted-l)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
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
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <Button type="submit" variant="primary" loading={submitting} style={{ width: '100%', justifyContent: 'center' }}>
              {submitting ? 'Wird angemeldet...' : 'Anmelden'}
            </Button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--muted-l)' }}>
            Einladung erhalten?{' '}
            <Link to="/register" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 600 }}>
              Registrieren
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
