import React from 'react'

import type { ThemeMode } from '../types.ts'
import { getEffectiveTheme, getStoredTheme, getSystemTheme, persistTheme, setDocumentTheme } from '../utils/theme.ts'

interface ThemeContextValue {
  theme: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: (): void => {},
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = React.useState<ThemeMode>(() => getEffectiveTheme())

  React.useEffect(() => {
    setDocumentTheme(theme)
    const meta = document.querySelector('meta[name="theme-color"]')

    if (meta !== null) {
      const background = getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim()

      if (background.length > 0) {
        meta.setAttribute('content', background)
      }
    }
  }, [theme])

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)')

    const handleSystemChange = (): void => {
      if (getStoredTheme() === null) {
        setTheme(getSystemTheme())
      }
    }

    media.addEventListener('change', handleSystemChange)

    return () => {
      media.removeEventListener('change', handleSystemChange)
    }
  }, [])

  const toggleTheme = (): void => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark'
    persistTheme(nextTheme)
    setTheme(nextTheme)
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

/**
 * Exposes the active theme and the toggle action.
 * @returns The theme context value.
 */
export function useTheme(): ThemeContextValue {
  return React.useContext(ThemeContext)
}
