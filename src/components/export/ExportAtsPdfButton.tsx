import { FileDown } from 'lucide-react'
import { useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { renderAtsPdf } from '../../utils/renderAtsPdf'
import { savePdfFile } from '../../utils/portableResumePdf'
import { secondaryButton } from '../editor/buttonStyles'
import { ExportDataDialog } from './ExportDataDialog'
import { useResumeBank } from '../../context/ResumeBankContext'
import { BankExportButton } from './BankExportButton'

export function ExportAtsPdfButton() {
  const { resume } = useResume()
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState('')
  const [showDataDialog, setShowDataDialog] = useState(false)
  const bank = useResumeBank()

  const handleExport = async (includeEditableData: boolean) => {
    setShowDataDialog(false)
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
      savePdfFile(
        pdf,
        `${fileName || 'resume'}-ATS.pdf`,
        includeEditableData ? resume : undefined,
      )
    } catch {
      setError('ATS PDF export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  if (bank.enabled) return <BankExportButton format="ats" />
  return (
    <div className="grid gap-1">
      <button
        type="button"
        onClick={() => setShowDataDialog(true)}
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
      {showDataDialog && (
        <ExportDataDialog
          formatName="ATS PDF"
          onCancel={() => setShowDataDialog(false)}
          onConfirm={(includeEditableData) => void handleExport(includeEditableData)}
        />
      )}
    </div>
  )
}
