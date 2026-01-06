import { useEffect, useState } from 'react'

export function useActiveSection(
  containerRef: React.RefObject<HTMLDivElement | null>,
  sectionIds: string[],
  isReady: boolean
) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '')

  useEffect(() => {
    const viewport = containerRef.current
    if (!viewport || !isReady) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        root: viewport,
        rootMargin: '-20% 0% -70% 0%',
        threshold: 0,
      }
    )

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [containerRef, sectionIds, isReady])

  return activeSection
}
