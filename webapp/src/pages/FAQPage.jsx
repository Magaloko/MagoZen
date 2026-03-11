import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { FAQ_HFK } from '../data/hfkData'
import { useProject } from '../context/ProjectContext'
import { useLanguage } from '../context/LanguageContext'
import Card from '../components/ui/Card'

export default function FAQPage() {
  const { projectId } = useParams()
  const { project } = useProject(projectId)
  const { t } = useLanguage()
  const [open, setOpen] = useState(null)

  const faq = project?.service_package?.faq || FAQ_HFK

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ padding: '12px 16px', background: 'rgba(92,122,106,.15)', border: '1px solid rgba(92,122,106,.3)', borderRadius: 6, fontSize: 13 }}>
        <strong style={{ color: 'var(--accent)' }}>HFK:</strong>
        <span style={{ color: 'var(--muted-l)', marginLeft: 8 }}>{t('faq.intro')}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faq.map((item, i) => (
          <Card key={i} style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => setOpen(open === i ? null : i)}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', minHeight: 48 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', flexShrink: 0, marginTop: 2 }}>Q</span>
              <span style={{ fontWeight: 600, fontSize: 14, flex: 1, color: 'var(--white)' }}>{item.q}</span>
              <span style={{ color: 'var(--muted-l)', fontSize: 14, flexShrink: 0 }}>{open === i ? '▲' : '▼'}</span>
            </div>
            {open === i && (
              <>
                <div style={{ padding: '14px 16px', display: 'flex', gap: 12, borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,.02)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)', flexShrink: 0, marginTop: 2 }}>A</span>
                  <p style={{ fontSize: 13.5, color: 'var(--white-d)', lineHeight: 1.7, margin: 0 }}>{item.a}</p>
                </div>
                {item.tip && (
                  <div style={{ padding: '10px 16px 12px 44px', background: 'rgba(63,207,142,.03)', borderTop: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>
                    {t('faq.tip')} {item.tip}
                  </div>
                )}
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
