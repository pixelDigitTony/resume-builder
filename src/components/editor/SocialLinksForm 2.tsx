import { Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { Field, TextInput } from './Field'
import { FormSection } from './FormSection'
import { addButton, dangerButton } from './buttonStyles'

export function SocialLinksForm() {
  const {
    resume,
    updatePersonal,
    addCustomLink,
    removeCustomLink,
    updateCustomLink,
  } = useResume()

  const { personal, customLinks } = resume

  return (
    <FormSection title="Links & socials" eyebrow={`${customLinks.length} custom`}>
      <div className="space-y-4">
        <Field label="LinkedIn URL">
          <TextInput
            type="url"
            value={personal.linkedin}
            placeholder="https://linkedin.com/in/your-profile"
            onChange={(event) => updatePersonal({ linkedin: event.target.value })}
          />
        </Field>

        <Field label="GitHub URL">
          <TextInput
            type="url"
            value={personal.github}
            placeholder="https://github.com/your-username"
            onChange={(event) => updatePersonal({ github: event.target.value })}
          />
        </Field>

        <Field label="Portfolio URL">
          <TextInput
            type="url"
            value={personal.portfolio}
            placeholder="https://your-portfolio.com"
            onChange={(event) => updatePersonal({ portfolio: event.target.value })}
          />
        </Field>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Additional links</p>
          {customLinks.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm font-medium text-slate-700">No additional links.</p>
            </div>
          )}

          {customLinks.map((link, linkIndex) => (
            <div key={link.id} className={linkIndex === 0 ? '' : 'border-t border-slate-200 pt-4'}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  {link.label || 'Custom link'}
                </h3>
                <button
                  type="button"
                  onClick={() => removeCustomLink(link.id)}
                  className={dangerButton}
                  aria-label={`Remove ${link.label || 'custom'} link`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <Field label="Label">
                  <TextInput
                    value={link.label}
                    placeholder="Twitter, Blog, etc."
                    onChange={(event) =>
                      updateCustomLink(link.id, { label: event.target.value })
                    }
                  />
                </Field>
                <Field label="URL">
                  <TextInput
                    type="url"
                    value={link.url}
                    placeholder="https://..."
                    onChange={(event) => updateCustomLink(link.id, { url: event.target.value })}
                  />
                </Field>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCustomLink}
            className={addButton}
          >
            <Plus className="h-4 w-4" />
            Add link
          </button>
        </div>
      </div>
    </FormSection>
  )
}
