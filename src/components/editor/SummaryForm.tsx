import { useResume } from '../../context/ResumeContext'
import { Field, TextArea } from './Field'
import { FormSection } from './FormSection'

export function SummaryForm() {
  const { resume, updateSummary } = useResume()

  return (
    <FormSection title="Summary" eyebrow={`${resume.summary.trim().length} characters`}>
      <Field label="Professional summary">
        <TextArea
          value={resume.summary}
          onChange={(event) => updateSummary(event.target.value)}
          placeholder="Write a concise summary of your experience and strengths."
        />
      </Field>
    </FormSection>
  )
}
