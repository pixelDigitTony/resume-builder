import { Download } from 'lucide-react'
import { useState } from 'react'
import { A4_HEIGHT_MM, A4_WIDTH_MM } from '../../constants/a4'
import { useResume } from '../../context/ResumeContext'
import { captureResumePage } from '../../utils/captureResumePage'
import { compressCanvasForPdf, getPageImageBudget } from '../../utils/compressPdfImage'
import { createCircularProfilePhotoOverlay } from '../../utils/compositeProfilePhoto'
import { collectPdfLinks } from '../../utils/collectPdfLinks'
import {
  flushLayout,
  preparePreviewForExport,
  reapplyPreviewForExport,
} from '../../utils/preparePreviewForExport'
import { resolvePhotoForExport } from '../../utils/resolvePhotoForExport'
import { savePdfWithResumeData } from '../../utils/portableResumePdf'
import resumePreviewCss from '../preview/resume-preview.css?inline'
import { primaryButton } from '../editor/buttonStyles'

export function ExportPdfButton() {
  const { resume } = useResume()
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState('')

  const handleExport = async () => {
    const pages = document.querySelectorAll<HTMLElement>('.resume-page')
    if (pages.length === 0) return

    setExportError('')
    const restorePreviewLayout = preparePreviewForExport(pages.length)
    setIsExporting(true)

    pages.forEach((page) => page.classList.add('resume-page--export'))

    try {
      await flushLayout(pages)
      reapplyPreviewForExport(pages.length)
      await flushLayout(pages)

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      })

      const firstPage = pages[0]!
      const photoUrl = await resolvePhotoForExport(
        resume.personal.photoUrl,
        resume.personal.photoOriginalUrl,
        resume.personal.photoCrop,
        firstPage,
      )

      const photoOverlay =
        photoUrl ? await createCircularProfilePhotoOverlay(firstPage, photoUrl) : null
      const pageImageBudget = getPageImageBudget(pages.length, Boolean(photoOverlay))

      for (let index = 0; index < pages.length; index += 1) {
        const page = pages[index]!
        const linkRects = collectPdfLinks(page)

        const canvas = await captureResumePage(page, resumePreviewCss, html2canvas)
        const compressedPage = compressCanvasForPdf(canvas, pageImageBudget)

        if (index > 0) {
          pdf.addPage()
        }

        pdf.addImage(
          compressedPage.dataUrl,
          compressedPage.format,
          0,
          0,
          A4_WIDTH_MM,
          A4_HEIGHT_MM,
          undefined,
          'FAST',
        )

        if (index === 0 && photoOverlay) {
          pdf.addImage(
            photoOverlay.dataUrl,
            'PNG',
            photoOverlay.placement.x,
            photoOverlay.placement.y,
            photoOverlay.placement.size,
            photoOverlay.placement.size,
          )
        }

        for (const link of linkRects) {
          pdf.link(link.x, link.y, link.width, link.height, { url: link.url })
        }
      }

      const fileName = `${resume.personal.fullName || 'resume'}`
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
      savePdfWithResumeData(pdf, resume, `${fileName || 'resume'}.pdf`)
    } catch {
      setExportError('PDF export failed. Please try again after the preview finishes updating.')
    } finally {
      pages.forEach((page) => page.classList.remove('resume-page--export'))
      restorePreviewLayout()
      setIsExporting(false)
    }
  }

  return (
    <div className="grid gap-1">
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        aria-busy={isExporting}
        className={primaryButton}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {isExporting ? 'Exporting...' : 'Export PDF'}
      </button>
      <span className="sr-only" aria-live="polite">
        {isExporting ? 'PDF export in progress' : exportError}
      </span>
    </div>
  )
}
