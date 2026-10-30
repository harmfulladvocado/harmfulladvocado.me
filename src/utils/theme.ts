import type { ThemeMode } from '../types.ts'

const THEME_STORAGE_KEY = 'theme'

/**
 * Reads the stored theme preference.
 * @returns The stored theme, or null when unset or invalid.
 */
export function getStoredTheme(): ThemeMode | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'dark' || stored === 'light' ? stored : null
  } catch {
    return null
  }
}

/**
 * Resolves the theme currently reported by the system.
 * @returns The system theme.
 */
export function getSystemTheme(): ThemeMode {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

/**
 * Resolves the theme in effect, preferring an explicit document attribute.
 * @returns The active theme.
 */
export function getEffectiveTheme(): ThemeMode {
  const attribute = document.documentElement.dataset.theme
  if (attribute === 'dark' || attribute === 'light') {
    return attribute
  }
  return getStoredTheme() ?? getSystemTheme()
}

/**
 * Applies a theme to the document without persisting it.
 * @param theme - The theme to set.
 */
export function setDocumentTheme(theme: ThemeMode): void {
  document.documentElement.dataset.theme = theme
}

/**
 * Persists a theme preference for future visits.
 * @param theme - The theme to store.
 */
export function persistTheme(theme: ThemeMode): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // storage can be blocked, the theme still applies for this session
  }
}
