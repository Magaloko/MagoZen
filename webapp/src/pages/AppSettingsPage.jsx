import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { LANGUAGES } from '../i18n/translations'
import { supabase } from '../lib/supabase'

export default function AppSettingsPage() {
  const { profile, signOut } = useAuth()
  const { lang, switchLang, t } = useLanguage()
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  async function handleSaveProfile(e) {
    e.preventDefault()
    if (!displayName.trim()) return
    setSaving(true)
    setError(null)
    setSaved(false)
    const { error: err } = await supabase
      .from('profiles')
      .update({ display_name: displayName.trim() })
      .eq('id', profile.id)
    setSaving(false)
    if (err) {
      setError(err.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 6 }}>
          Dadakaev Labs · App
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--white)', margin: 0, marginBottom: 6 }}>
          Einstellungen
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
          Globale Einstellungen für die Webapp — unabhängig vom einzelnen Projekt.
        </p>
      </div>

      {/* Profil */}
      <section style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>
          Profil
        </div>
        <div style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
                  Anzeigename
                </label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px', background: 'var(--ink)', border: '1px solid var(--border)',
                    borderRadius: 6, color: 'var(--white)', fontSize: 13, fontFamily: 'var(--font-mono)',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
                  E-Mail
                </label>
                <div style={{ padding: '8px 12px', background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted-l)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                  {profile?.email || '—'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="submit"
                disabled={saving || !displayName.trim()}
                style={{
                  padding: '8px 18px', background: 'var(--green)', color: '#fff', border: 'none',
                  borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: saving ? 'wait' : 'pointer',
                  opacity: saving || !displayName.trim() ? 0.6 : 1,
                }}
              >
                {saving ? 'Speichern…' : 'Speichern'}
              </button>
              {saved && (
                <span style={{ fontSize: 12, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>✓ Gespeichert</span>
              )}
              {error && (
                <span style={{ fontSize: 12, color: 'var(--red, #e05252)', fontFamily: 'var(--font-mono)' }}>{error}</span>
              )}
            </div>
          </form>

          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 4, background: 'var(--ink)', border: '1px solid var(--border)', color: profile?.role === 'admin' ? 'var(--green)' : 'var(--muted-l)', marginRight: 8 }}>
                {profile?.role || '—'}
              </span>
              Rolle kann nur vom Super-Admin geändert werden
            </div>
          </div>
        </div>
      </section>

      {/* Sprache */}
      <section style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>
          Sprache / Language
        </div>
        <div style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => switchLang(code)}
                style={{
                  padding: '9px 22px', borderRadius: 6, fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: lang === code ? 700 : 400,
                  cursor: 'pointer', transition: 'all .15s',
                  border: lang === code ? '1px solid var(--green-b)' : '1px solid var(--border)',
                  background: lang === code ? 'var(--green-d)' : 'transparent',
                  color: lang === code ? 'var(--green)' : 'var(--muted-l)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--muted)' }}>
            Spracheinstellung gilt für die gesamte Webapp. Gespeichert im Browser.
          </div>
        </div>
      </section>

      {/* Session */}
      <section style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>
          Session
        </div>
        <div style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted-l)', marginBottom: 2 }}>
              Angemeldet als <strong style={{ color: 'var(--white)' }}>{profile?.display_name || profile?.email}</strong>
            </div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>{profile?.email}</div>
          </div>
          <button
            onClick={signOut}
            style={{
              padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)',
              borderRadius: 6, fontSize: 12, color: 'var(--muted-l)', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', transition: 'all .15s',
            }}
          >
            Abmelden
          </button>
        </div>
      </section>

      {/* App Info */}
      <section>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>
          App Info
        </div>
        <div style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '14px 20px' }}>
          {[
            { label: 'Plattform', value: 'Dadakaev Labs CRM' },
            { label: 'Stack', value: 'React 18 · Vite 5 · Supabase' },
            { label: 'Version', value: 'v1.0.0-beta' },
            { label: 'Umgebung', value: import.meta.env.MODE || 'development' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{label}</span>
              <span style={{ fontSize: 12, color: 'var(--muted-l)', fontFamily: 'var(--font-mono)' }}>{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
