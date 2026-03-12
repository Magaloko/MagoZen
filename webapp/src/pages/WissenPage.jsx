import { useState } from 'react'
import { KI_GRUNDLAGEN, AUTO_LEVELS, VOKABULAR, KMU_PROBLEME } from '../data/wissenData'

const TABS = [
  { id: 'ki', label: 'KI Grundlagen', icon: '◈' },
  { id: 'auto', label: 'Automatisierung', icon: '⚡' },
  { id: 'vokab', label: 'Vokabular', icon: '≡' },
  { id: 'kmu', label: 'KMU-Probleme', icon: '◇' },
]

const VOKAB_GRUPPEN = ['basis', 'mittel', 'automation', 'agents', 'dsgvo']
const VOKAB_GRUPPEN_LABELS = {
  basis: 'Gruppe 1 — Die Basis',
  mittel: 'Gruppe 2 — Mittlere Ebene',
  automation: 'Gruppe 3 — Automatisierung konkret',
  agents: 'Gruppe 4 — Agenten & Zukunft',
  dsgvo: 'Gruppe 5 — Österreich & DSGVO',
}

const AUTOMATIONSGRAD_COLOR = {
  voll: 'var(--green)',
  teilauto: 'var(--amber)',
  halb: 'var(--amber)',
}
const AUTOMATIONSGRAD_BG = {
  voll: 'var(--green-d)',
  teilauto: 'rgba(180,130,58,0.12)',
  halb: 'rgba(180,130,58,0.12)',
}

function Tag({ label }) {
  const color = label.includes('Zendesk') ? 'var(--green)' : label.includes('Sofort') ? 'var(--blue)' : 'var(--muted)'
  const bg = label.includes('Zendesk') ? 'var(--green-d)' : label.includes('Sofort') ? 'rgba(74,144,226,0.12)' : 'var(--ink-m)'
  return (
    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 7px', borderRadius: 10, border: `1px solid ${color}`, color, background: bg, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

// ── Tab: KI Grundlagen ────────────────────────────────────────────────────────
function TabKI() {
  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.6 }}>
        Viele Leute reden über KI, als wäre es Magie. Ist es nicht. Es sind im Grunde 3 technische Kategorien.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {KI_GRUNDLAGEN.map((k) => (
          <div key={k.id} style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18, color: k.color }}>{k.icon}</span>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)' }}>{k.titel}</div>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <p style={{ fontSize: 13, color: 'var(--muted-l)', lineHeight: 1.6, marginBottom: 12 }}>{k.beschreibung}</p>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Beispiele</div>
                {k.beispiele.map((b) => (
                  <div key={b} style={{ fontSize: 12, color: 'var(--muted-l)', padding: '2px 0', display: 'flex', gap: 6 }}>
                    <span style={{ color: k.color }}>·</span> {b}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Begriffe</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {k.begriffe.map((b) => (
                    <span key={b} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 7px', borderRadius: 4, background: 'var(--ink)', border: '1px solid var(--border)', color: 'var(--muted-l)' }}>{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Stack */}
      <div style={{ marginTop: 24, background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px 20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Der KI-Stack moderner Unternehmen</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {['Frontend', 'Application Layer', 'AI Layer', 'Automation Layer', 'Data Layer'].map((layer, i, arr) => (
            <div key={layer} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ padding: '6px 12px', background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, color: 'var(--white-d)', fontFamily: 'var(--font-mono)' }}>{layer}</div>
              {i < arr.length - 1 && <span style={{ color: 'var(--muted)', fontSize: 14 }}>↓</span>}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--green-l, #8eb8a5)' }}>HFK-Beispiel:</strong>{' '}
          Frontend = Zendesk · Automation = Zendesk Trigger · AI = Claude/GPT Copilot · Data = JTL Warenwirtschaft
        </div>
      </div>

      {/* Tools 2026 */}
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
        {[
          { label: 'AI Modelle', items: ['OpenAI', 'Anthropic Claude', 'Google Gemini', 'Mistral'] },
          { label: 'Automation', items: ['n8n', 'Make', 'Power Automate'] },
          { label: 'Agent Frameworks', items: ['LangChain', 'LlamaIndex', 'CrewAI'] },
          { label: 'Datensysteme', items: ['Supabase', 'PostgreSQL', 'Pinecone', 'Qdrant'] },
        ].map(({ label, items }) => (
          <div key={label} style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '12px 14px' }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>{label}</div>
            {items.map((item) => (
              <div key={item} style={{ fontSize: 12, color: 'var(--muted-l)', padding: '2px 0' }}>· {item}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tab: Automatisierung ──────────────────────────────────────────────────────
function TabAuto() {
  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.6 }}>
        KI alleine bringt selten Geld. <strong style={{ color: 'var(--white-d)' }}>Automatisierung bringt Geld.</strong> Die meisten Firmen automatisieren mit diesen drei Ebenen.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {AUTO_LEVELS.map((level) => (
          <div key={level.level} style={{ background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${level.color}22`, border: `2px solid ${level.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: level.color, flexShrink: 0 }}>
                {level.level}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)' }}>{level.titel}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{level.subtitle}</div>
              </div>
            </div>
            <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <p style={{ fontSize: 13, color: 'var(--muted-l)', lineHeight: 1.6, marginBottom: 12 }}>{level.beschreibung}</p>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Tools</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {level.tools.map((t) => (
                    <span key={t} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 4, background: 'var(--ink)', border: '1px solid var(--border)', color: level.color }}>{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Beispiel-Workflow</div>
                {level.workflow.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: i === level.workflow.length - 1 ? level.color : 'var(--ink)', border: `1px solid ${level.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: i === level.workflow.length - 1 ? '#fff' : level.color, fontFamily: 'var(--font-mono)' }}>{i + 1}</div>
                      {i < level.workflow.length - 1 && <div style={{ width: 1, height: 8, background: `${level.color}44` }} />}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted-l)', paddingTop: 2 }}>{step}</div>
                  </div>
                ))}
                <div style={{ marginTop: 10, padding: '8px 10px', background: `${level.color}11`, border: `1px solid ${level.color}33`, borderRadius: 6, fontSize: 11, color: level.color, fontFamily: 'var(--font-mono)' }}>
                  HFK: {level.hfkBeispiel}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tab: Vokabular ────────────────────────────────────────────────────────────
function TabVokabular() {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const filtered = search.trim()
    ? VOKABULAR.filter((v) =>
        v.term.toLowerCase().includes(search.toLowerCase()) ||
        v.beschreibung.toLowerCase().includes(search.toLowerCase()) ||
        v.ausgeschrieben.toLowerCase().includes(search.toLowerCase())
      )
    : VOKABULAR

  const inSearch = search.trim().length > 0

  return (
    <div>
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 14 }}>⌕</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Begriff suchen..."
          style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 34, padding: '10px 12px 10px 34px', background: 'var(--ink-m)', border: '1px solid var(--border)', borderRadius: 'var(--r)', fontSize: 13, color: 'var(--white-d)', outline: 'none', fontFamily: 'inherit' }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
        )}
      </div>

      {inSearch ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
          {filtered.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>Kein Begriff gefunden.</div>
          ) : (
            filtered.map((v) => <VokabCard key={v.id} v={v} expanded={expandedId === v.id} onToggle={() => setExpandedId(expandedId === v.id ? null : v.id)} />)
          )}
        </div>
      ) : (
        VOKAB_GRUPPEN.map((gruppe) => {
          const items = VOKABULAR.filter((v) => v.gruppe === gruppe)
          return (
            <div key={gruppe} style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>
                {VOKAB_GRUPPEN_LABELS[gruppe]}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
                {items.map((v) => <VokabCard key={v.id} v={v} expanded={expandedId === v.id} onToggle={() => setExpandedId(expandedId === v.id ? null : v.id)} />)}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

function VokabCard({ v, expanded, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{ background: 'var(--ink-m)', border: `1px solid ${expanded ? 'var(--green-b)' : 'var(--border)'}`, borderRadius: 'var(--r)', cursor: 'pointer', transition: 'border-color .15s', overflow: 'hidden' }}
    >
      <div style={{ padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{v.term}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{v.ausgeschrieben}</div>
        </div>
        <span style={{ fontSize: 12, color: 'var(--muted)', flexShrink: 0, transition: 'transform .2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </div>
      {expanded && (
        <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: 'var(--muted-l)', lineHeight: 1.6, marginTop: 10, marginBottom: 10 }}>{v.beschreibung}</p>
          <div style={{ background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 6, padding: '8px 12px' }}>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Wie du es verwendest</div>
            <div style={{ fontSize: 12, color: 'var(--green-l, #8eb8a5)', fontStyle: 'italic', lineHeight: 1.5 }}>{v.verwendung}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tab: KMU-Probleme ─────────────────────────────────────────────────────────
function TabKMU() {
  const [filter, setFilter] = useState('alle')
  const [expandedId, setExpandedId] = useState(null)

  const FILTER_OPTS = [
    { id: 'alle', label: 'Alle' },
    { id: 'zendesk', label: 'Zendesk+JTL lösbar' },
    { id: 'zukuenftig', label: 'Zukünftig' },
  ]

  const filtered = KMU_PROBLEME.filter((p) => {
    if (filter === 'zendesk') return p.zendesk
    if (filter === 'zukuenftig') return !p.zendesk
    return true
  })

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
        Die 10 häufigsten Probleme österreichischer KMUs — und welche Lösung jeweils dahintersteckt.
        Mit echten Szenarien und der Technik im Hintergrund.
      </p>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTER_OPTS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-mono)',
              background: filter === id ? 'var(--green-d)' : 'transparent',
              border: filter === id ? '1px solid var(--green-b)' : '1px solid var(--border)',
              color: filter === id ? 'var(--green)' : 'var(--muted-l)',
            }}
          >{label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((p) => {
          const isOpen = expandedId === p.id
          return (
            <div key={p.id} style={{ background: 'var(--ink-m)', border: `1px solid ${isOpen ? 'var(--green-b)' : 'var(--border)'}`, borderRadius: 'var(--r)', overflow: 'hidden', transition: 'border-color .15s' }}>
              <button
                onClick={() => setExpandedId(isOpen ? null : p.id)}
                style={{ width: '100%', background: 'none', border: 'none', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ink)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>
                  {p.nr}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)' }}>{p.titel}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{p.loesungKurz}</div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {p.tags.map((tag) => <Tag key={tag} label={tag} />)}
                </div>
                <span style={{ fontSize: 12, color: 'var(--muted)', flexShrink: 0, marginLeft: 4, transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
              </button>

              {isOpen && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
                  {/* Was du hörst */}
                  <div style={{ margin: '14px 0 10px', padding: '10px 14px', background: 'var(--ink)', border: '1px solid var(--border)', borderLeft: '3px solid var(--muted)', borderRadius: 6 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Was du hörst</div>
                    <div style={{ fontSize: 13, color: 'var(--muted-l)', fontStyle: 'italic', lineHeight: 1.6 }}>{p.wasHoerst}</div>
                  </div>
                  {/* Was du sagst */}
                  <div style={{ margin: '10px 0', padding: '10px 14px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderLeft: '3px solid var(--green)', borderRadius: 6 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Was du sagst</div>
                    <div style={{ fontSize: 13, color: 'var(--green-l, #8eb8a5)', lineHeight: 1.6 }}>{p.wasDuSagst}</div>
                  </div>
                  {/* Technik */}
                  <div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Technik dahinter</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 6 }}>
                      {p.technik.map((t) => {
                        const [name, ...rest] = t.split(':')
                        return (
                          <div key={t} style={{ padding: '7px 10px', background: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 6 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--white-d)', fontFamily: 'var(--font-mono)' }}>{name}</div>
                            {rest.length > 0 && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{rest.join(':').trim()}</div>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function WissenPage() {
  const [activeTab, setActiveTab] = useState('ki')

  return (
    <div style={{ maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 6 }}>
          Intern · Sales-Training für Adnan
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--white)', margin: 0, marginBottom: 6 }}>
          Wissen & Strategie
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 600 }}>
          KI-Grundlagen, Automatisierungs-Konzepte, Verkaufs-Vokabular und die häufigsten KMU-Probleme —
          kompakt aufbereitet für Kundengespräche.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeTab === id ? 'var(--green)' : 'transparent'}`,
              color: activeTab === id ? 'var(--green)' : 'var(--muted-l)',
              fontWeight: activeTab === id ? 600 : 400,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: -1,
              transition: 'all .15s',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'ki' && <TabKI />}
      {activeTab === 'auto' && <TabAuto />}
      {activeTab === 'vokab' && <TabVokabular />}
      {activeTab === 'kmu' && <TabKMU />}
    </div>
  )
}
