import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { ANFRAGEN, IMPLEMENTIERUNGS_TIMELINE, KPIS_AUTO } from '../data/automatisierungData'

const GRAD_COLOR = {
  voll: 'var(--green)',
  teilauto: 'var(--amber)',
  halb: 'var(--amber)',
}
const GRAD_BG = {
  voll: 'var(--green-d)',
  teilauto: 'rgba(180,130,58,0.12)',
  halb: 'rgba(180,130,58,0.12)',
}
const GRAD_BORDER = {
  voll: 'var(--green-b)',
  teilauto: 'rgba(180,130,58,0.35)',
  halb: 'rgba(180,130,58,0.35)',
}

function WorkflowArrow({ steps, color, label }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((step, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: 'var(--muted-l)', lineHeight: 1.4 }}>{step}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ marginLeft: 2, width: 2, height: 12, background: `${color}44` }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function AnfrageCard({ anfrage }) {
  const [expanded, setExpanded] = useState(false)
  const color = anfrage.farbe
  const gradColor = GRAD_COLOR[anfrage.automationsgrad]
  const gradBg = GRAD_BG[anfrage.automationsgrad]
  const gradBorder = GRAD_BORDER[anfrage.automationsgrad]

  return (
    <div style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color, flexShrink: 0 }}>
          {anfrage.nr}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)' }}>{anfrage.titel}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>{anfrage.haeufigkeit}</span>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>·</span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{anfrage.anteil} aller Anfragen</span>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>·</span>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '1px 8px', borderRadius: 10, background: gradBg, border: `1px solid ${gradBorder}`, color: gradColor }}>{anfrage.automationsLabel}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: `${color}11`, border: `1px solid ${color}33`, color, fontFamily: 'var(--font-mono)' }}>{anfrage.phaseName}</div>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: 'var(--muted-l)', cursor: 'pointer', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}
          >
            {expanded ? '▲ Schließen' : '▼ Details'}
          </button>
        </div>
      </div>

      {/* Tools row */}
      <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginRight: 4 }}>Tools:</span>
        {anfrage.tools.map((tool) => (
          <span key={tool} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 4, background: 'var(--ink)', border: '1px solid var(--border)', color: 'var(--muted-l)' }}>{tool}</span>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
          ↓ {anfrage.zeitersparnis}
        </span>
      </div>

      {/* Expanded: Workflow Detail */}
      {expanded && (
        <div style={{ padding: '16px 18px' }}>
          {/* Beispiel-E-Mail */}
          <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--ink)', border: '1px solid var(--border)', borderLeft: '3px solid var(--muted)', borderRadius: 6 }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Typische Kundenanfrage</div>
            <div style={{ fontSize: 12, color: 'var(--muted-l)', fontStyle: 'italic', lineHeight: 1.6 }}>{anfrage.beispielEmail}</div>
          </div>

          {/* Manuell vs Automatisiert */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ padding: '12px 14px', background: 'rgba(220,60,60,0.05)', border: '1px solid rgba(220,60,60,0.2)', borderRadius: 8 }}>
              <WorkflowArrow steps={anfrage.manuell} color="rgba(220,80,80,0.7)" label="Aktuell — Manuell" />
            </div>
            <div style={{ padding: '12px 14px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 8 }}>
              <WorkflowArrow steps={anfrage.automatisiert} color="var(--green)" label="Nach Implementierung — Automatisch" />
            </div>
          </div>

          {/* Ergebnis */}
          <div style={{ marginTop: 12, padding: '10px 14px', background: `${color}10`, border: `1px solid ${color}33`, borderRadius: 6, fontSize: 12, color }}>
            <strong>Ergebnis:</strong> {anfrage.ergebnis}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AutomatisierungPage() {
  const { projectId } = useParams()

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 6 }}>
          Intern · Projekt-Strategie
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--white)', margin: 0, marginBottom: 6 }}>
              Automatisierungsplan HFK
            </h1>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 560, margin: 0 }}>
              Basierend auf den 5 häufigsten Kundenanfragen bei Herr &amp; Frau Klein — konkrete Workflows,
              Tools und Implementierungsreihenfolge.
            </p>
          </div>
          <Link
            to={`/projects/${projectId}/wissen`}
            style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginTop: 4 }}
          >
            ○ Wissen & Strategie →
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 24 }}>
        {KPIS_AUTO.map(({ label, value, color, sub }) => (
          <div key={label} style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '12px 14px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted-l)', marginTop: 3 }}>{label}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1, fontFamily: 'var(--font-mono)' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Implementierungs-Timeline */}
      <div style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px 20px', marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
          Implementierungs-Reihenfolge
        </div>
        <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
          {IMPLEMENTIERUNGS_TIMELINE.map((phase, i) => {
            const phaseDefs = ANFRAGEN.filter((a) => phase.anfragenIds.includes(a.id))
            return (
              <div key={phase.phase} style={{ flex: 1, display: 'flex', alignItems: 'stretch', gap: 0 }}>
                <div style={{ flex: 1, padding: '12px 14px', background: `${phase.farbe}10`, border: `1px solid ${phase.farbe}33`, borderRadius: i === 0 ? '8px 0 0 8px' : i === IMPLEMENTIERUNGS_TIMELINE.length - 1 ? '0 8px 8px 0' : 0, borderLeft: i > 0 ? 'none' : undefined }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: phase.farbe, fontFamily: 'var(--font-mono)', marginBottom: 2 }}>{phase.phaseName}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>{phase.wochen}</div>
                  {phaseDefs.map((a) => (
                    <div key={a.id} style={{ fontSize: 11, color: 'var(--muted-l)', padding: '2px 0', display: 'flex', gap: 5, alignItems: 'center' }}>
                      <span style={{ color: phase.farbe, fontSize: 9 }}>●</span> {a.titel}
                    </div>
                  ))}
                </div>
                {i < IMPLEMENTIERUNGS_TIMELINE.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px', color: 'var(--muted)', fontSize: 18, zIndex: 1, background: 'var(--ink-m)', margin: '0 -1px' }}>→</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Workflow Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ANFRAGEN.map((anfrage) => (
          <AnfrageCard key={anfrage.id} anfrage={anfrage} />
        ))}
      </div>

      {/* Summary */}
      <div style={{ marginTop: 24, background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 'var(--r)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Gesamteffekt</div>
          <div style={{ fontSize: 13, color: 'var(--muted-l)', lineHeight: 1.6 }}>
            80% der täglichen Anfragen automatisiert · Support-Team fokussiert auf komplexe Fälle<br />
            Schnellere Antwortzeiten · Bessere Kundenzufriedenheit · Niedrigere Supportkosten
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>~12h</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Zeitersparnis/Woche</div>
        </div>
      </div>
    </div>
  )
}
