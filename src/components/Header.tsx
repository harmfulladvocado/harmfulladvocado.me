import React from 'react'

import navigationData from '../content/navigation.json'
import site from '../content/site.json'
import { useActiveSection } from '../hooks/useActiveSection.ts'
import { useTheme } from '../hooks/useTheme.tsx'
import type { NavigationItem } from '../types.ts'
import { CloseIcon, MenuIcon } from './icons.tsx'
import { ThemeToggle } from './ThemeToggle.tsx'

const NAVIGATION: NavigationItem[] = navigationData.items
const SECTION_IDS: string[] = NAVIGATION.map((item: NavigationItem) => item.id)

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false)
  const activeSection = useActiveSection(SECTION_IDS)
  const { theme, toggleTheme } = useTheme()

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  React.useEffect(() => {
    document.body.classList.toggle('body--menu-open', menuOpen)

    return () => {
      document.body.classList.remove('body--menu-open')
    }
  }, [menuOpen])

  const closeMenu = (): void => {
    setMenuOpen(false)
  }

  return (
    <header className={`header ${menuOpen ? 'header--open' : ''}`.trim()}>
      <div className="header__inner">
        <a className="header__brand" href="/" onClick={closeMenu}>
          <img alt="" aria-hidden="true" className="header__avatar" height="32" src="/images/pfp.svg" width="32" />
          <span className="header__brand-name">{site.name}</span>
        </a>
        <nav aria-label="Primary" className="header__nav" id="primary-navigation">
          {NAVIGATION.map((item: NavigationItem) => (
            <a
              aria-current={activeSection === item.id ? 'location' : undefined}
              className="header__link"
              href={`/${item.hash}`}
              key={item.id}
              onClick={closeMenu}
            >
              <span className="header__link-label">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="header__end">
          <ThemeToggle onToggle={toggleTheme} theme={theme} />
          <button
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="header__menu"
            onClick={() => setMenuOpen((open: boolean) => !open)}
            type="button"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
