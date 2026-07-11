import { A4_WIDTH_MM } from '../constants/a4'

export const PHOTO_FRAME_SIZE_PX = 112
export const SIDEBAR_PADDING_TOP_PX = 32
export const SIDEBAR_WIDTH_RATIO = 0.32

export interface ProfilePhotoPlacement {
  x: number
  y: number
  size: number
}

export function getProfilePhotoPlacementMm(pageWidthPx: number): ProfilePhotoPlacement {
  const pxToMm = pageWidthPx > 0 ? A4_WIDTH_MM / pageWidthPx : A4_WIDTH_MM / 794
  const sidebarWidthPx = pageWidthPx * SIDEBAR_WIDTH_RATIO
  const xPx = (sidebarWidthPx - PHOTO_FRAME_SIZE_PX) / 2
  const yPx = SIDEBAR_PADDING_TOP_PX

  return {
    x: xPx * pxToMm,
    y: yPx * pxToMm,
    size: PHOTO_FRAME_SIZE_PX * pxToMm,
  }
}
