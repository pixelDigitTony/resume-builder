import { Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { Field, TextArea, TextInput } from './Field'
import { FormSection } from './FormSection'
import { addButton, dangerButton } from './buttonStyles'

export function ProjectsForm() {
  const {
    resume,
    addProject,
    removeProject,
    updateProject,
    addProjectBullet,
    updateProjectBullet,
    removeProjectBullet,
  } = useResume()

  return (
    <FormSection title="Selected projects" eyebrow={`${resume.projects.length} projects`}>
      <div className="space-y-6">
        {resume.projects.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">No projects added yet.</p>
          </div>
        )}

        {resume.projects.map((project, projectIndex) => (
          <div key={project.id} className={projectIndex === 0 ? '' : 'border-t border-slate-200 pt-6'}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                {project.name || 'New project'}
              </h3>
              <button
                type="button"
                onClick={() => removeProject(project.id)}
                className={dangerButton}
                aria-label={`Remove ${project.name || 'project'}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Project name">
                <TextInput
                  value={project.name}
                  onChange={(event) => updateProject(project.id, { name: event.target.value })}
                />
              </Field>

              <Field label="Short description">
                <TextArea
                  value={project.description}
                  className="min-h-20"
                  onChange={(event) =>
                    updateProject(project.id, { description: event.target.value })
                  }
                />
              </Field>

              <Field label="Technologies (comma-separated)">
                <TextInput
                  value={project.technologies.join(', ')}
                  onChange={(event) =>
                    updateProject(project.id, {
                      technologies: event.target.value
                        .split(',')
                        .map((technology) => technology.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </Field>

              <div className="space-y-3">
                <span className="text-sm font-medium text-slate-700">Project bullets</span>
                {project.bullets.map((bullet, index) => (
                  <div key={`${project.id}-bullet-${index}`} className="flex gap-2">
                    <TextArea
                      value={bullet}
                      className="min-h-16"
                      onChange={(event) =>
                        updateProjectBullet(project.id, index, event.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeProjectBullet(project.id, index)}
                      className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                      aria-label={`Remove bullet ${index + 1} from ${project.name || 'project'}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addProjectBullet(project.id)}
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-teal-700 transition hover:bg-teal-50 hover:text-teal-900"
                >
                  <Plus className="h-4 w-4" />
                  Add bullet
                </button>
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addProject} className={addButton}>
          <Plus className="h-4 w-4" />
          Add project
        </button>
      </div>
    </FormSection>
  )
}
