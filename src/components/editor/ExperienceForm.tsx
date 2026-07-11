import { Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { Field, TextArea, TextInput } from './Field'
import { FormSection } from './FormSection'
import { addButton, dangerButton } from './buttonStyles'

export function ExperienceForm() {
  const {
    resume,
    addExperience,
    removeExperience,
    updateExperience,
    addExperienceBullet,
    updateExperienceBullet,
    removeExperienceBullet,
  } = useResume()

  return (
    <FormSection title="Experience" eyebrow={`${resume.experience.length} role${resume.experience.length === 1 ? '' : 's'}`}>
      <div className="space-y-6">
        {resume.experience.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">No roles added yet.</p>
          </div>
        )}

        {resume.experience.map((job, jobIndex) => (
          <div key={job.id} className={jobIndex === 0 ? '' : 'border-t border-slate-200 pt-6'}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                {job.title || job.company || 'New position'}
              </h3>
              <button
                type="button"
                onClick={() => removeExperience(job.id)}
                className={dangerButton}
                aria-label={`Remove ${job.title || job.company || 'experience'}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Job title">
                <TextInput
                  value={job.title}
                  onChange={(event) =>
                    updateExperience(job.id, { title: event.target.value })
                  }
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company">
                  <TextInput
                    value={job.company}
                    onChange={(event) =>
                      updateExperience(job.id, { company: event.target.value })
                    }
                  />
                </Field>
                <Field label="Location">
                  <TextInput
                    value={job.location}
                    onChange={(event) =>
                      updateExperience(job.id, { location: event.target.value })
                    }
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Start date">
                  <TextInput
                    value={job.startDate}
                    placeholder="MM/YYYY"
                    onChange={(event) =>
                      updateExperience(job.id, { startDate: event.target.value })
                    }
                  />
                </Field>
                <Field label="End date">
                  <TextInput
                    value={job.endDate}
                    placeholder="Present"
                    onChange={(event) =>
                      updateExperience(job.id, { endDate: event.target.value })
                    }
                  />
                </Field>
              </div>

              <div className="space-y-3">
                <span className="text-sm font-medium text-slate-700">Bullet points</span>
                {job.bullets.map((bullet, index) => (
                  <div key={`${job.id}-edit-${index}`} className="flex gap-2">
                    <TextArea
                      value={bullet}
                      className="min-h-16"
                      onChange={(event) =>
                        updateExperienceBullet(job.id, index, event.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeExperienceBullet(job.id, index)}
                      className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                      aria-label={`Remove bullet ${index + 1} from ${job.title || 'experience'}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addExperienceBullet(job.id)}
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-teal-700 transition hover:bg-teal-50 hover:text-teal-900"
                >
                  <Plus className="h-4 w-4" />
                  Add bullet
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addExperience}
          className={addButton}
        >
          <Plus className="h-4 w-4" />
          Add experience
        </button>
      </div>
    </FormSection>
  )
}
