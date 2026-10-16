import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { useResumeBank } from '../../context/ResumeBankContext'
import { primaryButton, secondaryButton } from '../editor/buttonStyles'
import { ExportDataDialog } from './ExportDataDialog'

export function BankExportButton({ format }: { format: 'ats' | 'designed' }) {
  const { resume } = useResume()
  const bank = useResumeBank()
  const [optionsOpen, setOptionsOpen] = useState(false)
  return <div className="grid gap-1">
    <button type="button" disabled={!bank.ready || bank.busy} aria-busy={bank.busy} onClick={() => { if (format === 'designed') void bank.exportResume(resume, format, false); else setOptionsOpen(true) }} className={format === 'designed' ? primaryButton : secondaryButton}>
      <FileDown className="h-4 w-4" aria-hidden="true" />{format === 'designed' ? 'Print PDF' : 'ATS PDF'}
    </button>
    {optionsOpen && <ExportDataDialog formatName={format === 'designed' ? 'PDF' : 'ATS PDF'} onCancel={() => setOptionsOpen(false)} onConfirm={editable => { setOptionsOpen(false); void bank.exportResume(resume, format, editable) }} />}
  </div>
}
