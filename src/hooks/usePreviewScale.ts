import { useCallback, useLayoutEffect, useState, type RefObject } from 'react'

const MM_TO_PX = 96 / 25.4
export const A4_WIDTH_PX = 210 * MM_TO_PX
export const A4_HEIGHT_PX = 297 * MM_TO_PX

export function usePreviewScale(containerRef: RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1)

  const update = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const availableWidth = container.clientWidth
    setScale(availableWidth > 0 ? Math.min(1, availableWidth / A4_WIDTH_PX) : 1)
  }, [containerRef])

  useLayoutEffect(() => {
    update()
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(update)
    observer.observe(container)
    window.addEventListener('resize', update)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [update, containerRef])

  return scale
}
