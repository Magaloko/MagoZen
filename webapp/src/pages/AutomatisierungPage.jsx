import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { ANFRAGEN, IMPLEMENTIERUNGS_TIMELINE, KPIS_AUTO, GRUNDPRINZIP, STACK_TOOLS, MITARBEITER_TASKS } from '../data/automatisierungData'

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

function GrundprinzipBanner() {
  return (
    <div style={{ marginBottom: 20, padding: '12px 16px', background: 'var(--ink-m)', border: '1px solid var(--border)', borderLeft: '3px solid var(--amber)', borderRadius: 'var(--r)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>⚡</span>
      <div>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Grundprinzip</div>
        <div style={{ fontSize: 13, color: 'var(--muted-l)', lineHeight: 1.7 }}>{GRUNDPRINZIP}</div>
      </div>
    </div>
  )
}

function StackTable() {
  return (
    <div style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', marginBottom: 20, overflow: 'hidden' }}>
      <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14 }}>🔧</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Der Stack</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--ink)' }}>
            <th style={{ padding: '8px 18px', textAlign: 'left', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>Tool</th>
            <th style={{ padding: '8px 18px', textAlign: 'left', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>Rolle</th>
            <th style={{ padding: '8px 18px', textAlign: 'center', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {STACK_TOOLS.map((row, i) => (
            <tr key={row.tool} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--ink)04' }}>
              <td style={{ padding: '9px 18px', fontSize: 12, fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{row.tool}</td>
              <td style={{ padding: '9px 18px', fontSize: 12, color: 'var(--muted-l)', lineHeight: 1.4 }}>{row.rolle}</td>
              <td style={{ padding: '9px 18px', textAlign: 'center' }}>
                {row.status === 'vorhanden' ? (
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 4, background: 'var(--green-d)', border: '1px solid var(--green-b)', color: 'var(--green)' }}>✅ vorhanden</span>
                ) : (
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 4, background: 'rgba(180,130,58,0.10)', border: '1px solid rgba(180,130,58,0.3)', color: 'var(--amber)' }}>🔧 einrichten</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MitarbeiterSection() {
  return (
    <div style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px 20px', marginTop: 24 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
        Was die 6 Mitarbeiter danach machen
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
        {MITARBEITER_TASKS.map((task, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 12px', background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 8 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{task.icon}</span>
            <span style={{ fontSize: 12, color: 'var(--muted-l)', lineHeight: 1.5 }}>{task.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TechDetailPanel({ techDetails }) {
  const [open, setOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(null)

  if (!techDetails) return null

  return (
    <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 14px', fontSize: 12, color: 'var(--amber)', cursor: 'pointer', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 6 }}
      >
        🔧 {open ? '▲ Technischen Plan schließen' : '▼ Technischer Umsetzungsplan (n8n)'}
      </button>

      {open && (
        <div style={{ marginTop: 14 }}>
          {/* Voraussetzungen */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Voraussetzungen</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {techDetails.voraussetzungen.map((v) => (
                <span key={v.was} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '3px 10px', borderRadius: 4, background: v.status === 'vorhanden' ? 'var(--green-d)' : 'rgba(180,130,58,0.10)', border: `1px solid ${v.status === 'vorhanden' ? 'var(--green-b)' : 'rgba(180,130,58,0.3)'}`, color: v.status === 'vorhanden' ? 'var(--green)' : 'var(--amber)' }}>
                  {v.status === 'vorhanden' ? '✅' : '🔧'} {v.was}
                </span>
              ))}
            </div>
          </div>

          {/* Setup Schritte */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Setup-Schritte</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {techDetails.schritte.map((s) => (
                <div key={s.nr} style={{ background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                  <button
                    onClick={() => setActiveStep(activeStep === s.nr ? null : s.nr)}
                    style={{ width: '100%', background: 'none', border: 'none', padding: '10px 14px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--amber)', background: 'rgba(180,130,58,0.15)', border: '1px solid rgba(180,130,58,0.3)', borderRadius: 4, padding: '1px 7px', flexShrink: 0 }}>Schritt {s.nr}</span>
                    <span style={{ fontSize: 12, color: 'var(--white)', fontWeight: 600 }}>{s.titel}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{activeStep === s.nr ? '▲' : '▼'}</span>
                  </button>
                  {activeStep === s.nr && (
                    <div style={{ padding: '0 14px 12px', borderTop: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 12, color: 'var(--muted-l)', lineHeight: 1.7, margin: '10px 0 0' }}>{s.beschreibung}</p>
                      {s.code && (
                        <pre style={{ marginTop: 10, padding: '10px 12px', background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)', overflowX: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                          {s.code}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* n8n Nodes */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>n8n Workflow — 10 Nodes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {techDetails.n8n_nodes.map((node) => (
                <div key={node.nr} style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: 10, alignItems: 'center', padding: '7px 12px', background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>{node.nr}</span>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--white)', fontWeight: 600 }}>{node.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--muted-l)', marginLeft: 8 }}>{node.details}</span>
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 7px', borderRadius: 4, background: 'var(--ink-m)', border: '1px solid var(--border)', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{node.typ}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Beispiel-E-Mail */}
          <div style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>Kunden-E-Mail (Eingang)</div>
              <div style={{ padding: '10px 12px', background: 'rgba(220,60,60,0.05)', border: '1px solid rgba(220,60,60,0.2)', borderRadius: 8, fontSize: 12, color: 'var(--muted-l)', fontStyle: 'italic', lineHeight: 1.6 }}>
                {techDetails.beispielInput}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>Automatische Antwort — nach ~8 Sek.</div>
              <div style={{ padding: '10px 12px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 8, fontSize: 12, color: 'var(--muted-l)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {techDetails.beispielOutput}
              </div>
            </div>
          </div>

          {/* Nächste Schritte */}
          <div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Nächste Schritte</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { label: 'Heute', items: techDetails.naechsteSchritte.heute, color: 'var(--amber)' },
                { label: 'Diese Woche', items: techDetails.naechsteSchritte.woche, color: 'var(--blue)' },
                { label: 'Testen', items: techDetails.naechsteSchritte.testen, color: 'var(--green)' },
              ].map(({ label, items, color }) => (
                <div key={label} style={{ padding: '10px 12px', background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>{label}</div>
                  {items.map((item, i) => (
                    <div key={i} style={{ fontSize: 11, color: 'var(--muted-l)', lineHeight: 1.5, display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 4 }}>
                      <span style={{ color, flexShrink: 0, marginTop: 1 }}>→</span> {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
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

          {/* Technischer Umsetzungsplan (nur wenn vorhanden) */}
          <TechDetailPanel techDetails={anfrage.techDetails} />
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

      {/* Grundprinzip + Stack */}
      <GrundprinzipBanner />
      <StackTable />

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

      {/* Was die Mitarbeiter danach machen */}
      <MitarbeiterSection />

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
