'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'bn'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (en: string, bn: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'bn',
  setLanguage: () => {},
  t: (en: string, bn: string) => bn,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('bn')

  useEffect(() => {
    const saved = localStorage.getItem('cropconnect_lang') as Language
    if (saved === 'en' || saved === 'bn') {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('cropconnect_lang', lang)
  }

  const t = (en: string, bn: string) => {
    return language === 'bn' ? bn : en
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
