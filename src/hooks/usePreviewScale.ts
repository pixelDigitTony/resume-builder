import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react'

const MM_TO_PX = 96 / 25.4
export const A4_WIDTH_PX = 210 * MM_TO_PX
export const A4_HEIGHT_PX = 297 * MM_TO_PX

export function usePreviewScale(containerRef: RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1)
  const scaleRef = useRef(1)
  const frameRef = useRef<number | null>(null)

  const update = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const availableWidth = Math.max(0, container.clientWidth - 1)
    const rawScale = availableWidth > 0 ? Math.min(1, availableWidth / A4_WIDTH_PX) : 1
    const nextScale = Math.floor(rawScale * 10_000) / 10_000

    if (Math.abs(scaleRef.current - nextScale) < 0.0001) return
    scaleRef.current = nextScale
    setScale(nextScale)
  }, [containerRef])

  const scheduleUpdate = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null
      update()
    })
  }, [update])

  useLayoutEffect(() => {
    update()
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(scheduleUpdate)
    observer.observe(container)
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', scheduleUpdate)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [update, scheduleUpdate, containerRef])

  return scale
}
