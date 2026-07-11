import { Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { Field, TextInput } from './Field'
import { FormSection } from './FormSection'
import { addButton, dangerButton } from './buttonStyles'

export function SkillsForm() {
  const { resume, addSkillGroup, removeSkillGroup, updateSkillGroup, setLanguages } =
    useResume()

  return (
    <>
      <FormSection title="Skills" eyebrow={`${resume.skillGroups.length} group${resume.skillGroups.length === 1 ? '' : 's'}`}>
        <div className="space-y-4">
          {resume.skillGroups.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
              <p className="text-sm font-medium text-slate-700">No skill groups added yet.</p>
            </div>
          )}

          {resume.skillGroups.map((group, groupIndex) => (
            <div key={group.id} className={groupIndex === 0 ? '' : 'border-t border-slate-200 pt-4'}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  {group.label || 'Skill group'}
                </h3>
                <button
                  type="button"
                  onClick={() => removeSkillGroup(group.id)}
                  className={dangerButton}
                  aria-label={`Remove ${group.label || 'skill'} group`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <Field label="Group label">
                  <TextInput
                    value={group.label}
                    onChange={(event) =>
                      updateSkillGroup(group.id, { label: event.target.value })
                    }
                  />
                </Field>
                <Field label="Skills (comma-separated)">
                  <TextInput
                    value={group.skills.join(', ')}
                    onChange={(event) =>
                      updateSkillGroup(group.id, {
                        skills: event.target.value
                          .split(',')
                          .map((skill) => skill.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </Field>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSkillGroup}
            className={addButton}
          >
            <Plus className="h-4 w-4" />
            Add skill group
          </button>
        </div>
      </FormSection>

      <FormSection title="Languages" eyebrow={`${resume.languages.length} listed`}>
        <Field label="Languages (comma-separated)">
          <TextInput
            value={resume.languages.join(', ')}
            onChange={(event) =>
              setLanguages(
                event.target.value
                  .split(',')
                  .map((language) => language.trim())
                  .filter(Boolean),
              )
            }
          />
        </Field>
      </FormSection>
    </>
  )
}
