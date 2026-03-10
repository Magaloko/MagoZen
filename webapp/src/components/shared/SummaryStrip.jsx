export default function SummaryStrip({ items }) {
  return (
    <div style={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            flex: '1 1 140px',
            background: 'var(--ink-m)',
            border: '1px solid var(--border)',
            borderRadius: i === 0 ? '6px 0 0 6px' : i === items.length - 1 ? '0 6px 6px 0' : 0,
            padding: '14px 18px',
            borderLeft: i > 0 ? 'none' : undefined,
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600, color: item.color || 'var(--green)' }}>
            {item.value}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted-l)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '.07em' }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
