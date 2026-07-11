import { FileDown } from 'lucide-react'
import { useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { renderAtsPdf } from '../../utils/renderAtsPdf'
import { savePdfWithResumeData } from '../../utils/portableResumePdf'
import { secondaryButton } from '../editor/buttonStyles'

export function ExportAtsPdfButton() {
  const { resume } = useResume()
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState('')

  const handleExport = async () => {
    setIsExporting(true)
    setError('')
    try {
      const { jsPDF } = await import('jspdf')
      const pdf = renderAtsPdf(
        new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true }),
        resume,
      )
      const fileName = (resume.personal.fullName || 'resume')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
      savePdfWithResumeData(pdf, resume, `${fileName || 'resume'}-ATS.pdf`)
    } catch {
      setError('ATS PDF export failed. Please try again.')
    } finally {
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
        className={secondaryButton}
      >
        <FileDown className="h-4 w-4" aria-hidden="true" />
        {isExporting ? 'Exporting...' : 'ATS PDF'}
      </button>
      <span className="sr-only" aria-live="polite">
        {isExporting ? 'ATS PDF export in progress' : error}
      </span>
    </div>
  )
}
