const SCROLL_DURATION_MS = 600

interface ActiveScroll {
  frame: number
  cancelHandlers: Array<[string, EventListener]>
}

let active: ActiveScroll | null = null

/**
 * Eases progress with a cubic ease-out curve so scrolling starts fast and settles gently.
 * @param progress - Normalized progress between zero and one.
 * @returns The eased progress.
 */
function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3
}

/**
 * Stops the running scroll animation and detaches its input listeners.
 * @returns Nothing.
 */
function cancelScroll(): void {
  if (active === null) {
    return
  }

  window.cancelAnimationFrame(active.frame)

  active.cancelHandlers.forEach(([type, listener]: [string, EventListener]) => {
    window.removeEventListener(type, listener)
  })

  active = null
}

/**
 * Reads the scroll padding offset applied to the scroll container.
 * @returns The offset in pixels, zero when unsupported.
 */
function scrollPaddingTop(): number {
  const computed = window.getComputedStyle(document.documentElement).scrollPaddingTop
  const value = parseFloat(computed)

  if (Number.isNaN(value)) {
    return 0
  }

  if (computed.endsWith('rem')) {
    return value * parseFloat(window.getComputedStyle(document.documentElement).fontSize)
  }

  return value
}

/**
 * Animates the window scroll to a vertical position in a rAF loop, independent from
 * system smooth scrolling preferences such as Windows reduced motion.
 * @param target - The vertical position in pixels, clamped to the scrollable range.
 * @returns Nothing.
 */
export function animateScrollTo(target: number): void {
  cancelScroll()

  const start = window.scrollY
  const maximum = document.documentElement.scrollHeight - window.innerHeight
  const end = Math.max(0, Math.min(target, maximum))

  if (Math.abs(end - start) < 1) {
    return
  }

  const began = performance.now()
  const cancelHandlers: Array<[string, EventListener]> = [
    ['wheel', cancelScroll],
    ['touchstart', cancelScroll],
    ['keydown', cancelScroll],
  ]

  active = { frame: 0, cancelHandlers }

  const step = (now: number): void => {
    const progress = Math.min((now - began) / SCROLL_DURATION_MS, 1)
    const position = start + (end - start) * easeOutCubic(progress)

    if (active !== null && progress < 1) {
      active.frame = window.requestAnimationFrame(step)
    } else {
      cancelScroll()
    }

    window.scrollTo({ behavior: 'instant', top: position })
  }

  active.frame = window.requestAnimationFrame(step)

  cancelHandlers.forEach(([type, listener]: [string, EventListener]) => {
    window.addEventListener(type, listener, { passive: true })
  })
}

/**
 * Finds the vertical document position of an element, ignoring reveal transforms.
 * @param element - The element to locate.
 * @returns The element top in document coordinates.
 */
function documentPosition(element: HTMLElement): number {
  let position = 0
  let current: HTMLElement | null = element

  while (current !== null) {
    position += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }

  return position
}

/**
 * Glides the window so the element sits below the sticky header offset.
 * @param element - The element to scroll to.
 * @returns Nothing.
 */
export function scrollToElement(element: HTMLElement): void {
  animateScrollTo(documentPosition(element) - scrollPaddingTop())
}
