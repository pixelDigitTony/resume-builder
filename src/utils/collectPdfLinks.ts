import { A4_HEIGHT_MM, A4_WIDTH_MM } from '../constants/a4'

export interface PdfLinkRect {
  url: string
  x: number
  y: number
  width: number
  height: number
}

export function collectPdfLinks(pageEl: HTMLElement): PdfLinkRect[] {
  const pageRect = pageEl.getBoundingClientRect()
  if (pageRect.width <= 0 || pageRect.height <= 0) return []

  const links: PdfLinkRect[] = []

  pageEl.querySelectorAll<HTMLAnchorElement>('a.resume-link[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href')
    if (!href) return

    const rect = anchor.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return

    links.push({
      url: href,
      x: ((rect.left - pageRect.left) / pageRect.width) * A4_WIDTH_MM,
      y: ((rect.top - pageRect.top) / pageRect.height) * A4_HEIGHT_MM,
      width: (rect.width / pageRect.width) * A4_WIDTH_MM,
      height: (rect.height / pageRect.height) * A4_HEIGHT_MM,
    })
  })

  return links
}
