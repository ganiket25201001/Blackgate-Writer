import React, { createContext, useContext, useState, useEffect } from 'react'

export interface AppSettings {
  theme: 'dark' | 'light'
  autoSaveInterval: number // milliseconds
  defaultFont: string
  language: 'en' | 'es' | 'fr' | 'de'
  showLineNumbers: boolean
  enableAutoSave: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  autoSaveInterval: 30000, // 30 seconds
  defaultFont: 'Segoe UI',
  language: 'en',
  showLineNumbers: false,
  enableAutoSave: true,
}

const STORAGE_KEY = 'blackgate_app_settings'

const SettingsContext = createContext<{
  settings: AppSettings
  updateSettings: (partial: Partial<AppSettings>) => void
  resetSettings: () => void
}>({} as any)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)

  // Load settings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) })
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
  }, [])

  // Apply theme to DOM
  useEffect(() => {
    const html = document.documentElement
    if (settings.theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [settings.theme])

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...partial }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error('Failed to save settings:', e)
      }
      return updated
    })
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to reset settings:', e)
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
