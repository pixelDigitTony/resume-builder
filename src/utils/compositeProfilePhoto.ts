import {
  getLoadedProfilePhotoImage,
  getPageWidthPx,
  getPhotoFrameRectOnPage,
  photoRectToMm,
  resolveLoadedPhotoImage,
  type PhotoFrameRect,
} from './photoExport'

const BORDER_COLOR = '#0d9488'
const BORDER_WIDTH_PX = 4
const SIDEBAR_COLOR = '#115e59'

export function cloneCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = source.width
  canvas.height = source.height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Could not create canvas context')
  }

  context.drawImage(source, 0, 0)
  return canvas
}

export function renderCircularProfilePhoto(
  image: HTMLImageElement,
  frameSizePx: number,
  scale = 1,
): HTMLCanvasElement {
  const size = Math.max(1, Math.round(frameSizePx * scale))
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Could not create canvas context')
  }

  const radius = size / 2
  const borderWidth = BORDER_WIDTH_PX * scale

  context.save()
  context.beginPath()
  context.arc(radius, radius, radius, 0, Math.PI * 2)
  context.clip()
  context.drawImage(image, 0, 0, size, size)
  context.restore()

  context.beginPath()
  context.arc(radius, radius, radius - borderWidth / 2, 0, Math.PI * 2)
  context.strokeStyle = BORDER_COLOR
  context.lineWidth = borderWidth
  context.stroke()

  return canvas
}

function drawPhotoAtRect(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  rect: PhotoFrameRect,
  canvasScale: number,
): void {
  const x = rect.x * canvasScale
  const y = rect.y * canvasScale
  const size = rect.size * canvasScale
  const pad = 2 * canvasScale

  context.fillStyle = SIDEBAR_COLOR
  context.fillRect(x - pad, y - pad, size + pad * 2, size + pad * 2)

  const circular = renderCircularProfilePhoto(image, rect.size, canvasScale)
  context.drawImage(circular, x, y, size, size)
}

export async function drawProfilePhotoOnCanvas(
  canvas: HTMLCanvasElement,
  pageEl: HTMLElement,
  photoUrl: string,
): Promise<boolean> {
  const context = canvas.getContext('2d')
  if (!context) return false

  const frameRect = getPhotoFrameRectOnPage(pageEl)
  if (!frameRect) return false

  const image =
    getLoadedProfilePhotoImage(pageEl) ?? (await resolveLoadedPhotoImage(pageEl, photoUrl))
  if (!image) return false

  const pageWidthPx = getPageWidthPx(pageEl, canvas)
  const canvasScale = canvas.width / pageWidthPx
  drawPhotoAtRect(context, image, frameRect, canvasScale)

  return true
}

export async function createCircularProfilePhotoOverlay(
  pageEl: HTMLElement,
  photoUrl: string,
): Promise<{ dataUrl: string; placement: ReturnType<typeof photoRectToMm> } | null> {
  const frameRect = getPhotoFrameRectOnPage(pageEl)
  if (!frameRect) return null

  const image =
    getLoadedProfilePhotoImage(pageEl) ?? (await resolveLoadedPhotoImage(pageEl, photoUrl))
  if (!image) return null

  const pageWidthPx = pageEl.offsetWidth > 0 ? pageEl.offsetWidth : 794
  const circular = renderCircularProfilePhoto(image, frameRect.size)

  return {
    dataUrl: circular.toDataURL('image/png'),
    placement: photoRectToMm(frameRect, pageWidthPx),
  }
}
