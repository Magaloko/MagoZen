const variants = {
  primary:   { bg: 'var(--green)', color: 'var(--ink)', border: 'transparent', hoverBg: '#36b87e' },
  secondary: { bg: 'rgba(255,255,255,.06)', color: 'var(--white)', border: 'var(--border-l)', hoverBg: 'rgba(255,255,255,.1)' },
  ghost:     { bg: 'transparent', color: 'var(--muted-l)', border: 'transparent', hoverBg: 'rgba(255,255,255,.05)' },
  danger:    { bg: 'var(--red-d)', color: 'var(--red)', border: 'rgba(239,68,68,.2)', hoverBg: 'rgba(239,68,68,.15)' },
}
const sizes = {
  sm: { padding: '5px 12px', fontSize: 12 },
  md: { padding: '7px 16px', fontSize: 13 },
  lg: { padding: '10px 22px', fontSize: 14 },
}

export default function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children,
  style,
  type = 'button',
}) {
  const v = variants[variant] || variants.secondary
  const s = sizes[size] || sizes.md
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        ...s,
        fontWeight: 500,
        fontFamily: 'var(--font-sans)',
        borderRadius: 'var(--r)',
        border: `1px solid ${v.border}`,
        background: v.bg,
        color: v.color,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? .45 : 1,
        transition: 'background .15s, opacity .15s',
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled && !loading) e.currentTarget.style.background = v.hoverBg }}
      onMouseLeave={(e) => { e.currentTarget.style.background = v.bg }}
    >
      {loading && (
        <span
          style={{
            width: 12, height: 12,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin .7s linear infinite',
          }}
        />
      )}
      {children}
    </button>
  )
}
