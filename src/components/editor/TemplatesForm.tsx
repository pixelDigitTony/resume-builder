import { Copy, FolderOpen, Plus, Save, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { Field, TextArea, TextInput } from './Field'
import { FormSection } from './FormSection'
import { dangerButton, primaryButton, secondaryButton, subtleButton } from './buttonStyles'

const selectClassName =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'

function formatDate(value: string) {
  if (!value) return 'Not saved yet'

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function TemplatesForm() {
  const {
    templates,
    activeTemplateId,
    createTemplate,
    loadTemplate,
    saveActiveTemplate,
    duplicateTemplate,
    deleteTemplate,
    updateTemplateMeta,
  } = useResume()
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newPosting, setNewPosting] = useState('')

  const activeTemplate = useMemo(
    () => templates.find((template) => template.id === activeTemplateId),
    [activeTemplateId, templates],
  )

  const handleCreate = () => {
    createTemplate({
      name: newName,
      targetRole: newRole,
      jobPosting: newPosting,
    })
    setNewName('')
    setNewRole('')
    setNewPosting('')
  }

  const handleDelete = (id: string) => {
    const template = templates.find((item) => item.id === id)
    const label = template?.name || 'this variation'
    if (window.confirm(`Delete "${label}"? This only removes the saved variation.`)) {
      deleteTemplate(id)
    }
  }

  return (
    <div className="space-y-4">
      <FormSection title="Resume variations" eyebrow={`${templates.length} saved`}>
        <div className="space-y-4">
          {templates.length > 0 ? (
            <>
              <Field label="Saved variation">
                <select
                  className={selectClassName}
                  value={activeTemplateId}
                  onChange={(event) => loadTemplate(event.target.value)}
                >
                  <option value="" disabled>
                    Select a variation
                  </option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                      {template.targetRole ? ` - ${template.targetRole}` : ''}
                    </option>
                  ))}
                </select>
              </Field>

              {activeTemplate && (
                <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-950">
                        {activeTemplate.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Last saved {formatDate(activeTemplate.updatedAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={saveActiveTemplate}
                        className={primaryButton}
                      >
                        <Save className="h-4 w-4" aria-hidden="true" />
                        Save current
                      </button>
                      <button
                        type="button"
                        onClick={() => loadTemplate(activeTemplate.id)}
                        className={secondaryButton}
                      >
                        <FolderOpen className="h-4 w-4" aria-hidden="true" />
                        Load
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Variation name">
                      <TextInput
                        value={activeTemplate.name}
                        onChange={(event) =>
                          updateTemplateMeta(activeTemplate.id, { name: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Target role or company">
                      <TextInput
                        value={activeTemplate.targetRole}
                        onChange={(event) =>
                          updateTemplateMeta(activeTemplate.id, {
                            targetRole: event.target.value,
                          })
                        }
                      />
                    </Field>
                  </div>

                  <Field label="Job posting notes">
                    <TextArea
                      value={activeTemplate.jobPosting}
                      onChange={(event) =>
                        updateTemplateMeta(activeTemplate.id, {
                          jobPosting: event.target.value,
                        })
                      }
                    />
                  </Field>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => duplicateTemplate(activeTemplate.id)}
                      className={subtleButton}
                    >
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(activeTemplate.id)}
                      className={dangerButton}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
              <p className="text-sm font-medium text-slate-700">
                No saved variations yet.
              </p>
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title="Save current resume as variation" eyebrow="Tailor by job">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Variation name">
              <TextInput
                value={newName}
                placeholder="Backend-heavy version"
                onChange={(event) => setNewName(event.target.value)}
              />
            </Field>
            <Field label="Target role or company">
              <TextInput
                value={newRole}
                placeholder="Senior Full Stack Developer"
                onChange={(event) => setNewRole(event.target.value)}
              />
            </Field>
          </div>
          <Field label="Job posting notes">
            <TextArea
              value={newPosting}
              placeholder="Paste the role focus, keywords, or tailoring notes here."
              onChange={(event) => setNewPosting(event.target.value)}
            />
          </Field>
          <button type="button" onClick={handleCreate} className={primaryButton}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Save as variation
          </button>
        </div>
      </FormSection>
    </div>
  )
}
