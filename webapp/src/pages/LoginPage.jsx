import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      // AuthContext will load profile, then App redirects based on role
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'E-Mail oder Passwort falsch.'
        : err.message)
    } finally {
      setLoading(false)
    }
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

            <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', justifyContent: 'center' }}>
              Anmelden
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
