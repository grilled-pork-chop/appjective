import { useCallback } from 'react'

export function useScrollToSection(containerRef: React.RefObject<HTMLDivElement | null>) {
  return useCallback(
    (sectionId: string) => {
      const viewport = containerRef.current?.querySelector('[data-radix-scroll-area-viewport]')
      const target = document.getElementById(sectionId)

      if (viewport && target) {
        const viewportTop = viewport.getBoundingClientRect().top
        const targetTop = target.getBoundingClientRect().top
        const scrollPos = targetTop - viewportTop + viewport.scrollTop - 20

        viewport.scrollTo({
          top: scrollPos,
          behavior: 'smooth',
        })
      }
    },
    [containerRef]
  )
}
