import { Upload } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { useResume } from '../../context/ResumeContext'
import { readResumeFromPdf } from '../../utils/portableResumePdf'
import { secondaryButton } from '../editor/buttonStyles'

export function ImportResumeButton() {
  const { importResume } = useResume()
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setIsImporting(true)
    setMessage('')
    try {
      const importedResume = await readResumeFromPdf(file)
      const label = importedResume.personal.fullName || 'the imported resume'
      if (!window.confirm(`Replace the current resume with ${label}?`)) return

      importResume(importedResume)
      setIsError(false)
      setMessage(`Imported ${label}.`)
    } catch (error) {
      setIsError(true)
      setMessage(error instanceof Error ? error.message : 'Resume import failed.')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        aria-label="Choose an app-generated resume PDF to import"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isImporting}
        aria-busy={isImporting}
        className={secondaryButton}
      >
        <Upload className="h-4 w-4" aria-hidden="true" />
        {isImporting ? 'Importing...' : 'Import PDF'}
      </button>
      {message && (
        <div
          role="status"
          className={`fixed bottom-4 left-4 right-4 z-50 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg sm:left-auto sm:max-w-md ${isError ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}
        >
          {message}
        </div>
      )}
    </>
  )
}
