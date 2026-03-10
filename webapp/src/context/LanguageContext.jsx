import { createContext, useContext, useState } from 'react'
import { TRANSLATIONS } from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('hfk-lang') || 'de' } catch { return 'de' }
  })

  const switchLang = (code) => {
    setLang(code)
    try { localStorage.setItem('hfk-lang', code) } catch {}
  }

  const t = (key) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS['de']?.[key] ?? key

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
