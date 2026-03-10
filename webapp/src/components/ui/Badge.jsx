const colorMap = {
  green:  { bg: 'var(--green-d)',  border: 'var(--green-b)',                 color: 'var(--green)' },
  amber:  { bg: 'var(--amber-d)', border: 'rgba(245,158,11,.2)',             color: 'var(--amber)' },
  red:    { bg: 'var(--red-d)',   border: 'rgba(239,68,68,.2)',              color: 'var(--red)' },
  blue:   { bg: 'var(--blue-d)',  border: 'rgba(96,165,250,.25)',            color: 'var(--blue)' },
  purple: { bg: 'var(--purple-d)',border: 'rgba(167,139,250,.2)',            color: 'var(--purple)' },
  gray:   { bg: 'rgba(255,255,255,.04)', border: 'var(--border-l)',         color: 'var(--muted-l)' },
}

export default function Badge({ color = 'gray', children, style }) {
  const c = colorMap[color] || colorMap.gray
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 9px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '.02em',
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  )
}
