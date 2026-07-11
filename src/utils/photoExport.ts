import { A4_WIDTH_MM } from '../constants/a4'
import { PDF_CAPTURE_SCALE } from './captureResumePage'
import { loadImage, waitForImage } from './photoCrop'

export interface PhotoFrameRect {
  x: number
  y: number
  size: number
}

export function getPhotoFrameRectOnPage(pageEl: HTMLElement): PhotoFrameRect | null {
  const frame = pageEl.querySelector<HTMLElement>('.resume-photo-frame')
  if (!frame) return null

  const pageRect = pageEl.getBoundingClientRect()
  const frameRect = frame.getBoundingClientRect()

  return {
    x: frameRect.left - pageRect.left,
    y: frameRect.top - pageRect.top,
    size: frameRect.width,
  }
}

export function photoRectToMm(rect: PhotoFrameRect, pageWidthPx: number) {
  const pxToMm = pageWidthPx > 0 ? A4_WIDTH_MM / pageWidthPx : A4_WIDTH_MM / 794

  return {
    x: rect.x * pxToMm,
    y: rect.y * pxToMm,
    size: rect.size * pxToMm,
  }
}

export function getLoadedProfilePhotoImage(pageEl: HTMLElement): HTMLImageElement | null {
  const image = pageEl.querySelector<HTMLImageElement>('.resume-photo')
  if (!image?.complete || image.naturalWidth <= 0) return null
  return image
}

export async function imageElementToDataUrl(image: HTMLImageElement): Promise<string> {
  await waitForImage(image)

  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not create canvas context')

  context.drawImage(image, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.92)
}

export function getImageFormat(dataUrl: string): 'JPEG' | 'PNG' {
  return dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG'
}

export async function resolveLoadedPhotoImage(
  pageEl: HTMLElement,
  photoUrl: string,
): Promise<HTMLImageElement | null> {
  const domImage = getLoadedProfilePhotoImage(pageEl)
  if (domImage) return domImage

  if (!photoUrl.trim()) return null

  try {
    return await loadImage(photoUrl)
  } catch {
    return null
  }
}

export function getPageWidthPx(pageEl: HTMLElement, canvas: HTMLCanvasElement): number {
  return pageEl.offsetWidth > 0 ? pageEl.offsetWidth : canvas.width / PDF_CAPTURE_SCALE
}
