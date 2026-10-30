import React from 'react'

import type { ThemeMode } from '../types.ts'
import { MoonIcon, SunIcon } from './icons.tsx'

interface ThemeToggleProps {
  onToggle: () => void
  theme: ThemeMode
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ onToggle, theme }) => {
  const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      aria-label={`Switch to ${nextTheme} theme`}
      className="theme-toggle"
      onClick={onToggle}
      type="button"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      <span className="theme-toggle__label">{nextTheme}</span>
    </button>
  )
}
