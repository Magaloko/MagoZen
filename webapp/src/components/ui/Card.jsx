const padMap = { sm: 14, md: 20, lg: 28 }

export default function Card({ children, padding = 'md', className, style, onClick }) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: 'var(--ink-m)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r)',
        padding: padMap[padding] ?? 20,
        cursor: onClick ? 'pointer' : undefined,
        transition: onClick ? 'border-color .15s' : undefined,
        ...style,
      }}
      onMouseEnter={(e) => { if (onClick) e.currentTarget.style.borderColor = 'var(--border-l)' }}
      onMouseLeave={(e) => { if (onClick) e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      {children}
    </div>
  )
}
