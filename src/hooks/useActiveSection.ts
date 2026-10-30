import React from 'react'

/**
 * Tracks which page section currently occupies the viewport center.
 * @param sectionIds - The section ids to observe.
 * @returns The active section id, or null before any section is visible.
 */
export function useActiveSection(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const sections = sectionIds
      .map((id: string) => document.getElementById(id))
      .filter((section: HTMLElement | null): section is HTMLElement => section !== null)

    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0,
      },
    )

    sections.forEach((section: HTMLElement) => {
      observer.observe(section)
    })

    return () => {
      observer.disconnect()
    }
  }, [sectionIds])

  return activeId
}
