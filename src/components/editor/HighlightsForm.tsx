import { Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { TextArea } from './Field'
import { FormSection } from './FormSection'
import { addButton } from './buttonStyles'

export function HighlightsForm() {
  const { resume, addHighlight, updateHighlight, removeHighlight } = useResume()

  return (
    <FormSection title="Career highlights" eyebrow={`${resume.highlights.length} points`}>
      <div className="space-y-3">
        {resume.highlights.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">No highlights added yet.</p>
          </div>
        )}

        {resume.highlights.map((highlight, index) => (
          <div key={`highlight-${index}`} className="flex gap-2">
            <TextArea
              value={highlight}
              className="min-h-16"
              placeholder="Built production payroll workflows that reduced manual HR processing."
              onChange={(event) => updateHighlight(index, event.target.value)}
            />
            <button
              type="button"
              onClick={() => removeHighlight(index)}
              className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
              aria-label={`Remove highlight ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button type="button" onClick={addHighlight} className={addButton}>
          <Plus className="h-4 w-4" />
          Add highlight
        </button>
      </div>
    </FormSection>
  )
}
