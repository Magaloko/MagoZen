import { Link } from 'react-router-dom'
import { useProjects } from '../context/ProjectContext'
import { useLanguage } from '../context/LanguageContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

const STATUS_BADGE = {
  active:    'green',
  planning:  'blue',
  paused:    'amber',
  completed: 'purple',
}

function getProgressFromCache(projectId, phases) {
  try {
    const cached = JSON.parse(window.localStorage.getItem(`proj-${projectId}-tasks`) || '{}')
    const allTasks = (phases || []).flatMap((p) => p.tasks || [])
    const done = allTasks.filter((task) => cached[task.id]).length
    const total = allTasks.length
    return total > 0 ? { done, total, pct: Math.round((done / total) * 100) } : { done: 0, total: 0, pct: 0 }
  } catch {
    return { done: 0, total: 0, pct: 0 }
  }
}

export default function HomePage() {
  const { t } = useLanguage()
  const { projects, loading } = useProjects()

  const activeCount = projects.filter((p) => p.status === 'active').length
  const totalAgents = projects.reduce((a, p) => {
    const sp = p.service_package || {}
    return a + (sp.agents_full || 0) + (sp.agents_light || 0)
  }, 0)

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
        Lädt...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>
            DADAKAEV_LABS · CRM
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--white)', margin: 0 }}>
            {t('home.allProjects')}
          </h1>
        </div>
        <Link
          to="/projects/new"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', background: 'var(--green)',
            color: '#fff', borderRadius: 'var(--r)', fontSize: 13,
            fontWeight: 600, textDecoration: 'none', transition: 'opacity .15s',
          }}
        >
          + {t('home.newProject')}
        </Link>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: t('home.activeProjects'), value: activeCount, color: 'var(--green)' },
          { label: t('home.allProjects'), value: projects.length, color: 'var(--white)' },
          { label: t('home.agents') + ' gesamt', value: totalAgents, color: 'var(--blue)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ padding: '12px 18px', background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', minWidth: 120 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Project list */}
      {projects.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>◇</div>
          <div style={{ fontSize: 14, color: 'var(--muted-l)', marginBottom: 16 }}>{t('home.noProjects')}</div>
          <Link
            to="/projects/new"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--green)', color: '#fff', borderRadius: 'var(--r)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
          >
            + {t('home.newProject')}
          </Link>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {projects.map((project) => {
            const phases = project.service_package?.phases || []
            const progress = getProgressFromCache(project.id, phases)
            const sp = project.service_package || {}
            const cd = project.customer_data || {}

            return (
              <Link key={project.id} to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                <Card style={{ cursor: 'pointer', transition: 'border-color .15s' }}>
                  {/* Card header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--white)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {project.short_name || project.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted-l)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {project.name !== project.short_name ? project.name : (cd.url || '')}
                      </div>
                    </div>
                    <Badge color={STATUS_BADGE[project.status] || 'blue'} style={{ marginLeft: 10, flexShrink: 0 }}>
                      {t(`status.${project.status}`) || project.status}
                    </Badge>
                  </div>

                  {/* Progress bar */}
                  {phases.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 5, fontFamily: 'var(--font-mono)' }}>
                        <span>{t('home.progress')}</span>
                        <span>{progress.pct}% ({progress.done}/{progress.total})</span>
                      </div>
                      <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress.pct}%`, background: 'var(--green)', borderRadius: 3, transition: 'width .4s' }} />
                      </div>
                    </div>
                  )}

                  {/* Meta */}
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--muted-l)', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
                    {sp.plan && (
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)', fontSize: 11 }}>{sp.plan}</span>
                    )}
                    {(sp.agents_full || sp.agents_light) && (
                      <span>{(sp.agents_full || 0) + (sp.agents_light || 0)} {t('home.agents')}</span>
                    )}
                    {cd.markt && <span>{cd.markt}</span>}
                  </div>

                  <div style={{ marginTop: 12, fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                    {t('home.open')}
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {/* General info CTA */}
      <Card style={{ background: 'var(--ink-m)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>
              Neuer Kunde?
            </div>
            <div style={{ fontSize: 14, color: 'var(--white-d)', marginBottom: 4 }}>
              Service-Katalog & Showcase für potenzielle Kunden
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              Zendesk-Pläne, Add-ons, Preise und Beispiel-Pakete auf einen Blick.
            </div>
          </div>
          <Link
            to="/general"
            style={{ padding: '10px 18px', background: 'transparent', border: '1px solid var(--green-b)', color: 'var(--green)', borderRadius: 'var(--r)', fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Allgemeiner Bereich →
          </Link>
        </div>
      </Card>

    </div>
  )
}
