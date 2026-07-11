import type { PhotoCrop } from '../types/resume'
import { cropImageToDataUrl } from './photoCrop'
import { getLoadedProfilePhotoImage, imageElementToDataUrl } from './photoExport'

async function fetchAsDataUrl(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch photo: ${response.status}`)
  }

  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read photo blob'))
    reader.readAsDataURL(blob)
  })
}

export async function resolvePhotoForExport(
  photoUrl: string,
  photoOriginalUrl: string,
  photoCrop: PhotoCrop,
  pageEl?: HTMLElement | null,
): Promise<string> {
  const domImage = pageEl
    ? getLoadedProfilePhotoImage(pageEl)
    : document.querySelector<HTMLImageElement>('.resume-page .resume-photo')

  if (domImage) {
    if (domImage.src.startsWith('data:') || domImage.src.startsWith('blob:')) {
      return domImage.src
    }

    try {
      return await imageElementToDataUrl(domImage)
    } catch {
      // Fall through to stored URLs.
    }
  }

  if (!photoUrl.trim()) return ''

  if (photoUrl.startsWith('data:') || photoUrl.startsWith('blob:')) {
    return photoUrl
  }

  try {
    return await cropImageToDataUrl(photoOriginalUrl || photoUrl, photoCrop)
  } catch {
    try {
      return await fetchAsDataUrl(photoUrl)
    } catch {
      return ''
    }
  }
}
