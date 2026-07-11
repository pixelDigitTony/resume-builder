export const PDF_CAPTURE_SCALE = 2

type Html2CanvasFn = (
  element: HTMLElement,
  options?: Record<string, unknown>,
) => Promise<HTMLCanvasElement>

export async function captureResumePage(
  pageEl: HTMLElement,
  css: string,
  html2canvas: Html2CanvasFn,
): Promise<HTMLCanvasElement> {
  return html2canvas(pageEl, {
    scale: PDF_CAPTURE_SCALE,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    scrollX: 0,
    scrollY: 0,
    ignoreElements: (element: Element) =>
      element.classList.contains('resume-page-number') ||
      element.classList.contains('resume-photo'),
    onclone: (clonedDoc: Document) => {
      clonedDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach((node: Element) => {
        node.remove()
      })

      const style = clonedDoc.createElement('style')
      style.textContent = css
      clonedDoc.head.appendChild(style)
    },
  })
}
