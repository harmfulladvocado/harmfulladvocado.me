import React from 'react'

interface UseInViewResult<TElement extends HTMLElement> {
  inView: boolean
  ref: React.RefObject<TElement | null>
}

/**
 * Tracks when an element first enters the viewport.
 * @returns The element ref and whether it has been seen.
 */
export function useInView<TElement extends HTMLElement = HTMLElement>(): UseInViewResult<TElement> {
  const ref = React.useRef<TElement | null>(null)
  const [inView, setInView] = React.useState<boolean>(false)

  React.useEffect(() => {
    const element = ref.current

    if (element === null) {
      return
    }

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15,
      },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  return { inView, ref }
}
