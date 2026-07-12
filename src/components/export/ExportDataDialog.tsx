import { Database, ShieldCheck, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { primaryButton, secondaryButton, subtleButton } from '../editor/buttonStyles'

interface ExportDataDialogProps {
  formatName: string
  onCancel: () => void
  onConfirm: (includeEditableData: boolean) => void
}

export function ExportDataDialog({
  formatName,
  onCancel,
  onConfirm,
}: ExportDataDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const privateExportRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    privateExportRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])'),
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onCancel])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-data-title"
      aria-describedby="export-data-description"
    >
      <div ref={dialogRef} className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-teal-700">{formatName}</p>
            <h2 id="export-data-title" className="text-lg font-semibold text-slate-950">
              Include editable resume data?
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-300"
            aria-label="Cancel export"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p id="export-data-description" className="mt-3 text-sm leading-6 text-slate-600">
          Editable data lets this app restore the resume from the PDF later. Leave it out when sharing a PDF that should not be importable into the builder.
        </p>

        <div className="mt-5 grid gap-3">
          <button
            ref={privateExportRef}
            type="button"
            onClick={() => onConfirm(false)}
            className={`${primaryButton} min-h-11`}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Export without editable data
          </button>
          <button
            type="button"
            onClick={() => onConfirm(true)}
            className={`${secondaryButton} min-h-11`}
          >
            <Database className="h-4 w-4" aria-hidden="true" />
            Include editable data
          </button>
          <button type="button" onClick={onCancel} className={subtleButton}>
            Cancel
          </button>
        </div>

        <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
          This choice controls hidden app data only. Visible PDF content can still be read or copied, and ATS PDF text remains machine-readable.
        </p>
      </div>
    </div>,
    document.body,
  )
}
