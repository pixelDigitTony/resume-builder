import { Plus, Trash2 } from 'lucide-react'
import {
  ADDABLE_STANDARD_LINKS,
  STANDARD_LINK_DEFINITIONS,
} from '../../data/standardLinks'
import { SOCIAL_ICON_OPTIONS, SocialIcon } from '../../data/socialIcons'
import { useResume } from '../../context/ResumeContext'
import type { StandardLinkType } from '../../types/resume'
import { Field, TextInput } from './Field'
import { FormSection } from './FormSection'
import { addButton, dangerButton } from './buttonStyles'

const selectClassName =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'

export function SocialLinksForm() {
  const {
    resume,
    updatePersonal,
    addStandardLink,
    removeStandardLink,
    addCustomLink,
    removeCustomLink,
    updateCustomLink,
  } = useResume()

  const { personal, standardLinks, customLinks } = resume
  const availableStandardLinks = ADDABLE_STANDARD_LINKS.filter(
    (type) => !standardLinks.includes(type),
  )

  return (
    <FormSection
      title="Links & socials"
      eyebrow={`${standardLinks.length + customLinks.length} added`}
    >
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Profile links</p>
          {standardLinks.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm font-medium text-slate-700">No profile links.</p>
            </div>
          )}

          {standardLinks.map((type, index) => {
            const definition = STANDARD_LINK_DEFINITIONS[type]

            return (
              <div
                key={type}
                className={index === 0 ? '' : 'border-t border-slate-200 pt-4'}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <SocialIcon name={definition.icon} className="h-4 w-4" />
                    {definition.label}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeStandardLink(type)}
                    className={dangerButton}
                    aria-label={`Remove ${definition.label} input`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <Field label={`${definition.label} URL`}>
                  <TextInput
                    type="url"
                    value={personal[type]}
                    placeholder={definition.placeholder}
                    onChange={(event) => updatePersonal({ [type]: event.target.value })}
                  />
                </Field>
              </div>
            )
          })}

          {availableStandardLinks.length > 0 && (
            <Field label="Add profile link">
              <select
                className={selectClassName}
                value=""
                onChange={(event) =>
                  addStandardLink(event.target.value as StandardLinkType)
                }
              >
                <option value="" disabled>
                  Choose a link type
                </option>
                {availableStandardLinks.map((type) => (
                  <option key={type} value={type}>
                    {STANDARD_LINK_DEFINITIONS[type].label}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>

        <div className="space-y-3 border-t border-slate-200 pt-5">
          <p className="text-sm font-medium text-slate-700">Custom links</p>
          {customLinks.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm font-medium text-slate-700">No custom links.</p>
            </div>
          )}

          {customLinks.map((link, linkIndex) => (
            <div
              key={link.id}
              className={linkIndex === 0 ? '' : 'border-t border-slate-200 pt-4'}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <SocialIcon name={link.icon} className="h-4 w-4" />
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
                    placeholder="Instagram, Blog, etc."
                    onChange={(event) =>
                      updateCustomLink(link.id, { label: event.target.value })
                    }
                  />
                </Field>
                <Field label="Social icon">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                      <SocialIcon name={link.icon} className="h-5 w-5" />
                    </span>
                    <select
                      className={selectClassName}
                      value={link.icon || 'globe'}
                      onChange={(event) =>
                        updateCustomLink(link.id, { icon: event.target.value })
                      }
                    >
                      {SOCIAL_ICON_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </Field>
                <Field label="URL">
                  <TextInput
                    type="url"
                    value={link.url}
                    placeholder="https://..."
                    onChange={(event) =>
                      updateCustomLink(link.id, { url: event.target.value })
                    }
                  />
                </Field>
              </div>
            </div>
          ))}

          <button type="button" onClick={addCustomLink} className={addButton}>
            <Plus className="h-4 w-4" />
            Add custom link
          </button>
        </div>
      </div>
    </FormSection>
  )
}
