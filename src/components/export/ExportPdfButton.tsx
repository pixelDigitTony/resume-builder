import { Printer } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { printResume } from '../../utils/printResume'
import { primaryButton } from '../editor/buttonStyles'

export function ExportPdfButton() {
  const { resume } = useResume()

  return (
    <div className="grid gap-1">
      <button
        type="button"
        onClick={() => printResume(resume)}
        className={primaryButton}
      >
        <Printer className="h-4 w-4" aria-hidden="true" />
        Print PDF
      </button>
      <span className="sr-only">
        Opens the browser print dialog. Choose Save as PDF to export selectable resume text.
      </span>
    </div>
  )
}
