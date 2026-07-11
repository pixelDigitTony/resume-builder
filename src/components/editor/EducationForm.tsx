import { useResume } from '../../context/ResumeContext'
import { Field, TextInput } from './Field'
import { FormSection } from './FormSection'

export function EducationForm() {
  const { resume, updateEducation } = useResume()
  const { education } = resume

  return (
    <FormSection title="Education" eyebrow="Credentials">
      <div className="space-y-4">
        <Field label="Degree">
          <TextInput
            value={education.degree}
            onChange={(event) => updateEducation({ degree: event.target.value })}
          />
        </Field>

        <Field label="Institution">
          <TextInput
            value={education.institution}
            onChange={(event) => updateEducation({ institution: event.target.value })}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Location">
            <TextInput
              value={education.location}
              onChange={(event) => updateEducation({ location: event.target.value })}
            />
          </Field>
          <Field label="Graduation year">
            <TextInput
              inputMode="numeric"
              value={education.graduationYear}
              placeholder="YYYY"
              onChange={(event) => updateEducation({ graduationYear: event.target.value })}
            />
          </Field>
        </div>
      </div>
    </FormSection>
  )
}
