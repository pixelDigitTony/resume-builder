import { useMemo, useState, type ComponentType, type KeyboardEvent } from 'react'
import {
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Circle,
  Files,
  FileText,
  FolderKanban,
  GraduationCap,
  Link,
  Sparkles,
  Trophy,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { analyzeResume } from '../../utils/analyzeResume'
import { EducationForm } from './EducationForm'
import { ExperienceForm } from './ExperienceForm'
import { HighlightsForm } from './HighlightsForm'
import { PersonalInfoForm } from './PersonalInfoForm'
import { ProjectsForm } from './ProjectsForm'
import { ResumeReview } from './ResumeReview'
import { SkillsForm } from './SkillsForm'
import { SocialLinksForm } from './SocialLinksForm'
import { SummaryForm } from './SummaryForm'
import { TemplatesForm } from './TemplatesForm'
import { secondaryButton } from './buttonStyles'

type SectionId =
  | 'templates'
  | 'review'
  | 'personal'
  | 'links'
  | 'summary'
  | 'highlights'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'education'

interface EditorSection {
  id: SectionId
  label: string
  eyebrow: string
  icon: LucideIcon
  component: ComponentType
  complete: boolean
}

function hasText(value: string) {
  return value.trim().length > 0
}

export function EditorPanel() {
  const { resume, templates, activeTemplateId } = useResume()
  const [activeSectionId, setActiveSectionId] = useState<SectionId>('personal')

  const sections = useMemo<EditorSection[]>(() => {
    const activeTemplate = templates.find((template) => template.id === activeTemplateId)
    const reviewScore = analyzeResume(resume, activeTemplate?.jobPosting ?? '').score
    const completeExperience = resume.experience.some(
      (job) =>
        hasText(job.title) &&
        hasText(job.company) &&
        job.bullets.some((bullet) => hasText(bullet)),
    )

    const completeSkills = resume.skillGroups.some(
      (group) => hasText(group.label) && group.skills.some((skill) => hasText(skill)),
    )

    const completeProjects = resume.projects.some(
      (project) =>
        hasText(project.name) &&
        project.technologies.some((technology) => hasText(technology)) &&
        project.bullets.some((bullet) => hasText(bullet)),
    )

    const hasCustomLinks = resume.customLinks.some(
      (link) => hasText(link.label) && hasText(link.url),
    )

    return [
      {
        id: 'review',
        label: 'Review',
        eyebrow: `${reviewScore}/100`,
        icon: ClipboardCheck,
        component: ResumeReview,
        complete: reviewScore >= 80,
      },
      {
        id: 'templates',
        label: 'Templates',
        eyebrow: `${templates.length} saved`,
        icon: Files,
        component: TemplatesForm,
        complete: templates.length > 0,
      },
      {
        id: 'personal',
        label: 'Personal',
        eyebrow: 'Profile',
        icon: UserRound,
        component: PersonalInfoForm,
        complete:
          hasText(resume.personal.fullName) &&
          hasText(resume.personal.title) &&
          hasText(resume.personal.email),
      },
      {
        id: 'links',
        label: 'Links',
        eyebrow: 'Contact',
        icon: Link,
        component: SocialLinksForm,
        complete:
          hasText(resume.personal.linkedin) ||
          hasText(resume.personal.github) ||
          hasText(resume.personal.portfolio) ||
          hasCustomLinks,
      },
      {
        id: 'summary',
        label: 'Summary',
        eyebrow: 'Pitch',
        icon: FileText,
        component: SummaryForm,
        complete: resume.summary.trim().length >= 80,
      },
      {
        id: 'highlights',
        label: 'Highlights',
        eyebrow: `${resume.highlights.length} wins`,
        icon: Trophy,
        component: HighlightsForm,
        complete: resume.highlights.filter(hasText).length >= 3,
      },
      {
        id: 'experience',
        label: 'Experience',
        eyebrow: `${resume.experience.length} roles`,
        icon: BriefcaseBusiness,
        component: ExperienceForm,
        complete: completeExperience,
      },
      {
        id: 'projects',
        label: 'Projects',
        eyebrow: `${resume.projects.length} selected`,
        icon: FolderKanban,
        component: ProjectsForm,
        complete: completeProjects,
      },
      {
        id: 'skills',
        label: 'Skills',
        eyebrow: `${resume.skillGroups.length} groups`,
        icon: Sparkles,
        component: SkillsForm,
        complete: completeSkills && resume.languages.some(hasText),
      },
      {
        id: 'education',
        label: 'Education',
        eyebrow: 'School',
        icon: GraduationCap,
        component: EducationForm,
        complete: hasText(resume.education.degree) && hasText(resume.education.institution),
      },
    ]
  }, [activeTemplateId, resume, templates])

  const activeIndex = Math.max(
    sections.findIndex((section) => section.id === activeSectionId),
    0,
  )
  const activeSection = sections[activeIndex] ?? sections[0]
  const ActiveForm = activeSection.component
  const progressSections = sections.filter(
    (section) => section.id !== 'review' && section.id !== 'templates',
  )
  const completedCount = progressSections.filter((section) => section.complete).length
  const completionPercent = Math.round((completedCount / progressSections.length) * 100)

  const goToOffset = (offset: number) => {
    const nextSection = sections[activeIndex + offset]
    if (nextSection) setActiveSectionId(nextSection.id)
  }

  const selectSection = (index: number) => {
    const section = sections[index]
    if (!section) return
    setActiveSectionId(section.id)
    requestAnimationFrame(() => document.getElementById(`editor-tab-${section.id}`)?.focus())
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      selectSection((index + 1) % sections.length)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      selectSection((index - 1 + sections.length) % sections.length)
    } else if (event.key === 'Home') {
      event.preventDefault()
      selectSection(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      selectSection(sections.length - 1)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-teal-700">Editor</p>
            <h2 className="text-lg font-semibold text-slate-950">Resume sections</h2>
          </div>
          <div className="min-w-36">
            <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
              <span>{completedCount}/{progressSections.length} ready</span>
              <span>{completionPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-600 transition-all"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0" role="tablist" aria-label="Editor sections">
          {sections.map((section, index) => {
            const Icon = section.icon
            const StatusIcon = section.complete ? CheckCircle2 : Circle
            const isActive = section.id === activeSection.id

            return (
              <button
                key={section.id}
                id={`editor-tab-${section.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="editor-active-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveSectionId(section.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`flex min-h-14 min-w-40 snap-start items-center gap-3 rounded-lg border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-teal-300 sm:min-h-16 sm:min-w-0 ${
                  isActive
                    ? 'border-teal-500 bg-teal-50 text-teal-950'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{section.label}</span>
                  <span className="block truncate text-xs text-slate-500">{section.eyebrow}</span>
                </span>
                <StatusIcon
                  className={`h-4 w-4 shrink-0 ${section.complete ? 'text-teal-600' : 'text-slate-300'}`}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>
      </div>

      <div
        id="editor-active-panel"
        role="tabpanel"
        aria-labelledby={`editor-tab-${activeSection.id}`}
        tabIndex={0}
        className="focus:outline-none"
      >
        {activeSection.id === 'review' ? (
          <ResumeReview onOpenSection={(section) => setActiveSectionId(section)} />
        ) : (
          <ActiveForm />
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => goToOffset(-1)}
          disabled={activeIndex === 0}
          className={secondaryButton}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => goToOffset(1)}
          disabled={activeIndex === sections.length - 1}
          className={secondaryButton}
        >
          Next
        </button>
      </div>
    </div>
  )
}
