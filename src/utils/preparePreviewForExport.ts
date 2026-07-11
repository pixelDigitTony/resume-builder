import { A4_HEIGHT_PX, A4_WIDTH_PX } from '../hooks/usePreviewScale'

const PAGE_GAP_PX = 24

interface StyleSnapshot {
  element: HTMLElement
  width: string
  height: string
}

function applyExportLayout(pageCount: number) {
  const scaler = document.querySelector<HTMLElement>('.resume-preview-scaler')
  const scroll = document.querySelector<HTMLElement>('.resume-preview-scroll')
  const scaledWrapper = document.querySelector<HTMLElement>('.resume-pages-scaled')
  const fullHeight = pageCount * A4_HEIGHT_PX + (pageCount - 1) * PAGE_GAP_PX

  scroll?.classList.add('resume-preview-scroll--export')
  scaledWrapper?.classList.add('resume-pages-scaled--export')

  if (scaler) {
    scaler.style.width = `${A4_WIDTH_PX}px`
    scaler.style.height = `${fullHeight}px`
  }
}

export function preparePreviewForExport(pageCount: number): () => void {
  const snapshots: StyleSnapshot[] = []
  const scaler = document.querySelector<HTMLElement>('.resume-preview-scaler')

  if (scaler) {
    snapshots.push({
      element: scaler,
      width: scaler.style.width,
      height: scaler.style.height,
    })
  }

  applyExportLayout(pageCount)

  return () => {
    document.querySelector('.resume-preview-scroll')?.classList.remove('resume-preview-scroll--export')
    document.querySelector('.resume-pages-scaled')?.classList.remove('resume-pages-scaled--export')

    snapshots.forEach(({ element, width, height }) => {
      element.style.width = width
      element.style.height = height
    })
  }
}

export function reapplyPreviewForExport(pageCount: number): void {
  applyExportLayout(pageCount)
}

export async function flushLayout(pages: NodeListOf<HTMLElement>): Promise<void> {
  pages.forEach((page) => {
    void page.offsetWidth
    void page.getBoundingClientRect()
  })

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}
