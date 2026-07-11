export const PDF_MAX_FILE_BYTES = 4.85 * 1024 * 1024
export const PDF_PHOTO_BUDGET_BYTES = 96 * 1024

const JPEG_QUALITIES = [0.92, 0.88, 0.84, 0.8, 0.76, 0.72, 0.68, 0.64, 0.6, 0.55, 0.5]

export function getDataUrlByteSize(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? ''
  return Math.ceil(base64.length * 0.75)
}

export interface CompressedCanvasImage {
  dataUrl: string
  format: 'JPEG'
  quality: number
  bytes: number
}

function downscaleCanvas(canvas: HTMLCanvasElement, factor: number): HTMLCanvasElement {
  const scaled = document.createElement('canvas')
  scaled.width = Math.max(1, Math.round(canvas.width * factor))
  scaled.height = Math.max(1, Math.round(canvas.height * factor))

  const context = scaled.getContext('2d')
  if (!context) {
    throw new Error('Could not create canvas context')
  }

  context.drawImage(canvas, 0, 0, scaled.width, scaled.height)
  return scaled
}

export function compressCanvasForPdf(
  canvas: HTMLCanvasElement,
  maxBytes: number,
): CompressedCanvasImage {
  let workingCanvas = canvas
  let scaleFactor = 1

  while (scaleFactor >= 0.65) {
    for (const quality of JPEG_QUALITIES) {
      const dataUrl = workingCanvas.toDataURL('image/jpeg', quality)
      const bytes = getDataUrlByteSize(dataUrl)

      if (bytes <= maxBytes) {
        return { dataUrl, format: 'JPEG', quality, bytes }
      }
    }

    scaleFactor *= 0.9
    workingCanvas = downscaleCanvas(canvas, scaleFactor)
  }

  const dataUrl = workingCanvas.toDataURL('image/jpeg', 0.5)
  return {
    dataUrl,
    format: 'JPEG',
    quality: 0.5,
    bytes: getDataUrlByteSize(dataUrl),
  }
}

export function getPageImageBudget(pageCount: number, includePhoto: boolean): number {
  const reserved = includePhoto ? PDF_PHOTO_BUDGET_BYTES : 0
  const available = Math.max(PDF_MAX_FILE_BYTES - reserved, 256 * 1024)
  return Math.floor(available / Math.max(pageCount, 1))
}
