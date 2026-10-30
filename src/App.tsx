import React from 'react'

import { AboutSection } from './components/AboutSection.tsx'
import { Footer } from './components/Footer.tsx'
import { Header } from './components/Header.tsx'
import { Hero } from './components/Hero.tsx'
import { NotFound } from './components/NotFound.tsx'
import { ProjectsSection } from './components/ProjectsSection.tsx'
import { SkipLink } from './components/SkipLink.tsx'
import { SkillsSection } from './components/SkillsSection.tsx'
import { ThemeProvider } from './hooks/useTheme.tsx'

const HOME_PATHS = ['/', '/index.html']

const isHomePath = (pathname: string): boolean => {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return HOME_PATHS.includes(normalized)
}

export const App: React.FC = () => {
  const isHome = React.useMemo<boolean>(() => isHomePath(window.location.pathname), [])

  return (
    <ThemeProvider>
      <div className="app">
        <SkipLink />
        <Header />
        <main className="main" id="main-content">
          {isHome ? (
            <>
              <Hero />
              <AboutSection />
              <ProjectsSection />
              <SkillsSection />
            </>
          ) : (
            <NotFound />
          )}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
