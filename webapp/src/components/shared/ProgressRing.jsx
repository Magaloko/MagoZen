export default function ProgressRing({ pct = 0, size = 56, stroke = 4, color = 'var(--green)' }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset .5s ease' }}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="var(--white)" fontSize={size * 0.22} fontFamily="var(--font-mono)" fontWeight="600">
        {pct}%
      </text>
    </svg>
  )
}
