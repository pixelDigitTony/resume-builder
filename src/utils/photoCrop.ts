import { DEFAULT_PHOTO_CROP, type PhotoCrop } from '../types/resume'

export const PHOTO_CROP_VIEWPORT = 200
export const PHOTO_OUTPUT_SIZE = 224

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    if (!src.startsWith('data:')) {
      image.crossOrigin = 'anonymous'
    }
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

export function waitForImage(image: HTMLImageElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (image.complete && image.naturalWidth > 0) {
      resolve()
      return
    }
    image.onload = () => resolve()
    image.onerror = () => reject(new Error('Failed to load image'))
  })
}

export function drawCroppedPhoto(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  crop: PhotoCrop,
  size: number,
  viewportSize = PHOTO_CROP_VIEWPORT,
) {
  const { offsetX, offsetY, scale } = crop
  const offsetScale = size / viewportSize
  const baseScale = size / Math.min(image.naturalWidth, image.naturalHeight)
  const drawScale = baseScale * scale
  const drawWidth = image.naturalWidth * drawScale
  const drawHeight = image.naturalHeight * drawScale
  const x = (size - drawWidth) / 2 + offsetX * offsetScale
  const y = (size - drawHeight) / 2 + offsetY * offsetScale

  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = '#0d9488'
  ctx.fillRect(0, 0, size, size)
  ctx.save()
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(image, x, y, drawWidth, drawHeight)
  ctx.restore()
}

export async function cropImageToDataUrl(
  sourceUrl: string,
  crop: PhotoCrop = DEFAULT_PHOTO_CROP,
  outputSize = PHOTO_OUTPUT_SIZE,
): Promise<string> {
  const image = await loadImage(sourceUrl)
  const canvas = document.createElement('canvas')
  canvas.width = outputSize
  canvas.height = outputSize
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not create canvas context')

  drawCroppedPhoto(context, image, crop, outputSize)
  return canvas.toDataURL('image/jpeg', 0.92)
}
