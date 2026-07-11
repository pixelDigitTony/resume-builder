import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent,
} from 'react'
import {
  DEFAULT_PHOTO_CROP,
  type PhotoCrop,
} from '../../types/resume'
import {
  drawCroppedPhoto,
  loadImage,
  PHOTO_CROP_VIEWPORT,
  PHOTO_OUTPUT_SIZE,
} from '../../utils/photoCrop'
import { primaryButton, secondaryButton } from './buttonStyles'

interface PhotoCropModalProps {
  sourceUrl: string
  initialCrop?: PhotoCrop
  onApply: (photoUrl: string, crop: PhotoCrop, originalUrl: string) => void
  onClose: () => void
}

export function PhotoCropModal({
  sourceUrl,
  initialCrop = DEFAULT_PHOTO_CROP,
  onApply,
  onClose,
}: PhotoCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const dragRef = useRef<{ x: number; y: number } | null>(null)
  const [crop, setCrop] = useState<PhotoCrop>(initialCrop)
  const [isLoading, setIsLoading] = useState(true)

  const clampCrop = useCallback((nextCrop: PhotoCrop, image = imageRef.current) => {
    const scale = Math.min(3, Math.max(1, nextCrop.scale))
    if (!image || image.naturalWidth === 0 || image.naturalHeight === 0) {
      return { ...nextCrop, scale }
    }

    const baseScale = PHOTO_CROP_VIEWPORT / Math.min(image.naturalWidth, image.naturalHeight)
    const drawWidth = image.naturalWidth * baseScale * scale
    const drawHeight = image.naturalHeight * baseScale * scale
    const maxOffsetX = Math.max(0, (drawWidth - PHOTO_CROP_VIEWPORT) / 2)
    const maxOffsetY = Math.max(0, (drawHeight - PHOTO_CROP_VIEWPORT) / 2)

    return {
      scale,
      offsetX: Math.min(maxOffsetX, Math.max(-maxOffsetX, nextCrop.offsetX)),
      offsetY: Math.min(maxOffsetY, Math.max(-maxOffsetY, nextCrop.offsetY)),
    }
  }, [])

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image) return

    const context = canvas.getContext('2d')
    if (!context) return

    drawCroppedPhoto(context, image, crop, PHOTO_CROP_VIEWPORT)
  }, [crop])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      try {
        const image = await loadImage(sourceUrl)
        if (cancelled) return
        imageRef.current = image
        setCrop((current) => clampCrop(current, image))
        drawPreview()
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [sourceUrl, drawPreview, clampCrop])

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), canvas[tabindex="0"]',
        ),
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  useEffect(() => {
    if (!isLoading) drawPreview()
  }, [crop, isLoading, drawPreview])

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    dragRef.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current) return

    const deltaX = event.clientX - dragRef.current.x
    const deltaY = event.clientY - dragRef.current.y
    dragRef.current = { x: event.clientX, y: event.clientY }

    setCrop((current) =>
      clampCrop({
        ...current,
        offsetX: current.offsetX + deltaX,
        offsetY: current.offsetY + deltaY,
      }),
    )
  }

  const handlePointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    dragRef.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const handleCropKeyDown = (event: ReactKeyboardEvent<HTMLCanvasElement>) => {
    const movement = 5
    const delta = {
      ArrowLeft: { x: -movement, y: 0 },
      ArrowRight: { x: movement, y: 0 },
      ArrowUp: { x: 0, y: -movement },
      ArrowDown: { x: 0, y: movement },
    }[event.key]
    if (!delta) return

    event.preventDefault()
    setCrop((current) =>
      clampCrop({
        ...current,
        offsetX: current.offsetX + delta.x,
        offsetY: current.offsetY + delta.y,
      }),
    )
  }

  const handleApply = async () => {
    const image = imageRef.current
    if (!image) return

    const output = document.createElement('canvas')
    output.width = PHOTO_OUTPUT_SIZE
    output.height = PHOTO_OUTPUT_SIZE
    const context = output.getContext('2d')
    if (!context) return

    drawCroppedPhoto(context, image, crop, PHOTO_OUTPUT_SIZE)
    onApply(output.toDataURL('image/jpeg', 0.92), crop, sourceUrl)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-crop-title"
    >
      <div ref={dialogRef} className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 id="photo-crop-title" className="text-lg font-semibold text-slate-900">
          Adjust profile photo
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Drag to reposition and use the slider to zoom.
        </p>

        <div className="mt-4 flex justify-center">
          <div className="rounded-full p-1 shadow-inner" style={{ background: '#115e59' }}>
            <canvas
              ref={canvasRef}
              width={PHOTO_CROP_VIEWPORT}
              height={PHOTO_CROP_VIEWPORT}
              className="cursor-grab rounded-full active:cursor-grabbing"
              tabIndex={0}
              role="application"
              aria-label="Photo crop area. Use arrow keys to reposition the photo."
              onKeyDown={handleCropKeyDown}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
          </div>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">Zoom</span>
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={crop.scale}
            onChange={(event) =>
              setCrop((current) => clampCrop({ ...current, scale: Number(event.target.value) }))
            }
            className="mt-2 w-full accent-teal-700"
          />
        </label>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className={secondaryButton}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleApply()}
            disabled={isLoading}
            className={primaryButton}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
