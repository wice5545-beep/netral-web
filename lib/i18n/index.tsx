'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, locales, type Locale } from './translations'

type I18nContextType = { t: any; locale: Locale; setLocale: (l: Locale) => void }

const I18nContext = createContext<I18nContextType>({ t: translations.fr, locale: 'fr', setLocale: () => {} })

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'fr'
  const stored = localStorage.getItem('netral-locale') as Locale | null
  if (stored && locales.includes(stored)) return stored
  const browserLang = navigator.language.split('-')[0] as Locale
  return locales.includes(browserLang) ? browserLang : 'fr'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr')

  useEffect(() => { setLocaleState(detectLocale()) }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('netral-locale', l)
    document.documentElement.lang = l
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'
  }

  // Fallback to EN for new languages that don't have full translations yet
  const t = translations[locale] || translations.en

  return (
    <I18nContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)
