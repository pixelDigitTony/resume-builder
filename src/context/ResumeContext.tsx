import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { defaultResume } from '../data/defaultResume'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { normalizeResume } from '../utils/normalizeResume'
import type {
  CustomLink,
  Experience,
  Project,
  Resume,
  ResumeTemplate,
  SkillGroup,
} from '../types/resume'

const STORAGE_KEY = 'resume-builder-data'
const TEMPLATES_STORAGE_KEY = 'resume-builder-templates'
const ACTIVE_TEMPLATE_STORAGE_KEY = 'resume-builder-active-template'

type ResumeAction =
  | { type: 'SET_RESUME'; payload: Resume }
  | { type: 'UPDATE_PERSONAL'; payload: Partial<Resume['personal']> }
  | { type: 'UPDATE_SUMMARY'; payload: string }
  | { type: 'ADD_HIGHLIGHT' }
  | { type: 'UPDATE_HIGHLIGHT'; payload: { index: number; value: string } }
  | { type: 'REMOVE_HIGHLIGHT'; payload: number }
  | { type: 'UPDATE_EDUCATION'; payload: Partial<Resume['education']> }
  | { type: 'SET_LANGUAGES'; payload: string[] }
  | { type: 'ADD_EXPERIENCE' }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; data: Partial<Experience> } }
  | { type: 'ADD_EXPERIENCE_BULLET'; payload: string }
  | { type: 'UPDATE_EXPERIENCE_BULLET'; payload: { id: string; index: number; value: string } }
  | { type: 'REMOVE_EXPERIENCE_BULLET'; payload: { id: string; index: number } }
  | { type: 'ADD_PROJECT' }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; data: Partial<Project> } }
  | { type: 'ADD_PROJECT_BULLET'; payload: string }
  | { type: 'UPDATE_PROJECT_BULLET'; payload: { id: string; index: number; value: string } }
  | { type: 'REMOVE_PROJECT_BULLET'; payload: { id: string; index: number } }
  | { type: 'ADD_SKILL_GROUP' }
  | { type: 'REMOVE_SKILL_GROUP'; payload: string }
  | { type: 'UPDATE_SKILL_GROUP'; payload: { id: string; data: Partial<SkillGroup> } }
  | { type: 'ADD_CUSTOM_LINK' }
  | { type: 'REMOVE_CUSTOM_LINK'; payload: string }
  | { type: 'UPDATE_CUSTOM_LINK'; payload: { id: string; data: Partial<CustomLink> } }
  | { type: 'RESET' }

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function resumeReducer(state: Resume, action: ResumeAction): Resume {
  switch (action.type) {
    case 'SET_RESUME':
      return action.payload
    case 'UPDATE_PERSONAL':
      return { ...state, personal: { ...state.personal, ...action.payload } }
    case 'UPDATE_SUMMARY':
      return { ...state, summary: action.payload }
    case 'ADD_HIGHLIGHT':
      return { ...state, highlights: [...state.highlights, ''] }
    case 'UPDATE_HIGHLIGHT':
      return {
        ...state,
        highlights: state.highlights.map((highlight, index) =>
          index === action.payload.index ? action.payload.value : highlight,
        ),
      }
    case 'REMOVE_HIGHLIGHT':
      return {
        ...state,
        highlights: state.highlights.filter((_, index) => index !== action.payload),
      }
    case 'UPDATE_EDUCATION':
      return { ...state, education: { ...state.education, ...action.payload } }
    case 'SET_LANGUAGES':
      return { ...state, languages: action.payload }
    case 'ADD_EXPERIENCE':
      return {
        ...state,
        experience: [
          ...state.experience,
          {
            id: createId('exp'),
            company: '',
            location: '',
            title: '',
            startDate: '',
            endDate: '',
            bullets: [''],
          },
        ],
      }
    case 'REMOVE_EXPERIENCE':
      return {
        ...state,
        experience: state.experience.filter((item) => item.id !== action.payload),
      }
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        experience: state.experience.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item,
        ),
      }
    case 'ADD_EXPERIENCE_BULLET':
      return {
        ...state,
        experience: state.experience.map((item) =>
          item.id === action.payload
            ? { ...item, bullets: [...item.bullets, ''] }
            : item,
        ),
      }
    case 'UPDATE_EXPERIENCE_BULLET':
      return {
        ...state,
        experience: state.experience.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                bullets: item.bullets.map((bullet, index) =>
                  index === action.payload.index ? action.payload.value : bullet,
                ),
              }
            : item,
        ),
      }
    case 'REMOVE_EXPERIENCE_BULLET':
      return {
        ...state,
        experience: state.experience.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                bullets: item.bullets.filter((_, index) => index !== action.payload.index),
              }
            : item,
        ),
      }
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [
          ...state.projects,
          {
            id: createId('project'),
            name: '',
            description: '',
            technologies: [],
            bullets: [''],
          },
        ],
      }
    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((project) => project.id !== action.payload),
      }
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id ? { ...project, ...action.payload.data } : project,
        ),
      }
    case 'ADD_PROJECT_BULLET':
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload
            ? { ...project, bullets: [...project.bullets, ''] }
            : project,
        ),
      }
    case 'UPDATE_PROJECT_BULLET':
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id
            ? {
                ...project,
                bullets: project.bullets.map((bullet, index) =>
                  index === action.payload.index ? action.payload.value : bullet,
                ),
              }
            : project,
        ),
      }
    case 'REMOVE_PROJECT_BULLET':
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id
            ? {
                ...project,
                bullets: project.bullets.filter((_, index) => index !== action.payload.index),
              }
            : project,
        ),
      }
    case 'ADD_SKILL_GROUP':
      return {
        ...state,
        skillGroups: [
          ...state.skillGroups,
          { id: createId('skills'), label: 'New Group', skills: [] },
        ],
      }
    case 'REMOVE_SKILL_GROUP':
      return {
        ...state,
        skillGroups: state.skillGroups.filter((group) => group.id !== action.payload),
      }
    case 'UPDATE_SKILL_GROUP':
      return {
        ...state,
        skillGroups: state.skillGroups.map((group) =>
          group.id === action.payload.id ? { ...group, ...action.payload.data } : group,
        ),
      }
    case 'ADD_CUSTOM_LINK':
      return {
        ...state,
        customLinks: [
          ...(state.customLinks ?? []),
          { id: createId('link'), label: '', url: '' },
        ],
      }
    case 'REMOVE_CUSTOM_LINK':
      return {
        ...state,
        customLinks: (state.customLinks ?? []).filter((link) => link.id !== action.payload),
      }
    case 'UPDATE_CUSTOM_LINK':
      return {
        ...state,
        customLinks: (state.customLinks ?? []).map((link) =>
          link.id === action.payload.id ? { ...link, ...action.payload.data } : link,
        ),
      }
    case 'RESET':
      return defaultResume
    default:
      return state
  }
}

interface ResumeContextValue {
  resume: Resume
  templates: ResumeTemplate[]
  activeTemplateId: string
  updatePersonal: (data: Partial<Resume['personal']>) => void
  updateSummary: (summary: string) => void
  addHighlight: () => void
  updateHighlight: (index: number, value: string) => void
  removeHighlight: (index: number) => void
  updateEducation: (data: Partial<Resume['education']>) => void
  setLanguages: (languages: string[]) => void
  addExperience: () => void
  removeExperience: (id: string) => void
  updateExperience: (id: string, data: Partial<Experience>) => void
  addExperienceBullet: (id: string) => void
  updateExperienceBullet: (id: string, index: number, value: string) => void
  removeExperienceBullet: (id: string, index: number) => void
  addProject: () => void
  removeProject: (id: string) => void
  updateProject: (id: string, data: Partial<Project>) => void
  addProjectBullet: (id: string) => void
  updateProjectBullet: (id: string, index: number, value: string) => void
  removeProjectBullet: (id: string, index: number) => void
  addSkillGroup: () => void
  removeSkillGroup: (id: string) => void
  updateSkillGroup: (id: string, data: Partial<SkillGroup>) => void
  addCustomLink: () => void
  removeCustomLink: (id: string) => void
  updateCustomLink: (id: string, data: Partial<CustomLink>) => void
  createTemplate: (data: { name: string; targetRole?: string; jobPosting?: string }) => void
  loadTemplate: (id: string) => void
  saveActiveTemplate: () => void
  duplicateTemplate: (id: string) => void
  deleteTemplate: (id: string) => void
  updateTemplateMeta: (
    id: string,
    data: Partial<Pick<ResumeTemplate, 'name' | 'targetRole' | 'jobPosting'>>,
  ) => void
  importResume: (resume: Resume) => void
  resetResume: () => void
}

const ResumeContext = createContext<ResumeContextValue | null>(null)

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [persistedResume, setPersistedResume] = useLocalStorage<Resume>(
    STORAGE_KEY,
    defaultResume,
  )
  const [templates, setTemplates] = useLocalStorage<ResumeTemplate[]>(
    TEMPLATES_STORAGE_KEY,
    [],
  )
  const [activeTemplateId, setActiveTemplateId] = useLocalStorage<string>(
    ACTIVE_TEMPLATE_STORAGE_KEY,
    '',
  )
  const [resume, dispatch] = useReducer(resumeReducer, persistedResume)

  const persist = useCallback(
    (nextResume: Resume) => {
      dispatch({ type: 'SET_RESUME', payload: nextResume })
      setPersistedResume(nextResume)
    },
    [setPersistedResume],
  )

  const dispatchAndPersist = useCallback(
    (action: ResumeAction) => {
      const nextResume = resumeReducer(resume, action)
      persist(nextResume)
    },
    [resume, persist],
  )

  const createTemplate = useCallback(
    ({
      name,
      targetRole = '',
      jobPosting = '',
    }: {
      name: string
      targetRole?: string
      jobPosting?: string
    }) => {
      const now = new Date().toISOString()
      const id = createId('template')
      const template: ResumeTemplate = {
        id,
        name: name.trim() || 'Untitled variation',
        targetRole: targetRole.trim(),
        jobPosting: jobPosting.trim(),
        createdAt: now,
        updatedAt: now,
        resume,
      }

      setTemplates([...templates, template])
      setActiveTemplateId(id)
    },
    [resume, setActiveTemplateId, setTemplates, templates],
  )

  const loadTemplate = useCallback(
    (id: string) => {
      const template = templates.find((item) => item.id === id)
      if (!template) return

      persist(template.resume)
      setActiveTemplateId(template.id)
    },
    [persist, setActiveTemplateId, templates],
  )

  const saveActiveTemplate = useCallback(() => {
    if (!activeTemplateId) return

    const now = new Date().toISOString()
    setTemplates(
      templates.map((template) =>
        template.id === activeTemplateId
          ? { ...template, resume, updatedAt: now }
          : template,
      ),
    )
  }, [activeTemplateId, resume, setTemplates, templates])

  const duplicateTemplate = useCallback(
    (id: string) => {
      const template = templates.find((item) => item.id === id)
      if (!template) return

      const now = new Date().toISOString()
      const duplicate: ResumeTemplate = {
        ...template,
        id: createId('template'),
        name: `${template.name} Copy`,
        createdAt: now,
        updatedAt: now,
      }

      setTemplates([...templates, duplicate])
      setActiveTemplateId(duplicate.id)
      persist(duplicate.resume)
    },
    [persist, setActiveTemplateId, setTemplates, templates],
  )

  const deleteTemplate = useCallback(
    (id: string) => {
      setTemplates(templates.filter((template) => template.id !== id))
      if (activeTemplateId === id) {
        setActiveTemplateId('')
      }
    },
    [activeTemplateId, setActiveTemplateId, setTemplates, templates],
  )

  const updateTemplateMeta = useCallback(
    (
      id: string,
      data: Partial<Pick<ResumeTemplate, 'name' | 'targetRole' | 'jobPosting'>>,
    ) => {
      const now = new Date().toISOString()
      setTemplates(
        templates.map((template) =>
          template.id === id
            ? {
                ...template,
                ...data,
                name: data.name === undefined ? template.name : data.name,
                targetRole:
                  data.targetRole === undefined ? template.targetRole : data.targetRole,
                jobPosting:
                  data.jobPosting === undefined ? template.jobPosting : data.jobPosting,
                updatedAt: now,
              }
            : template,
        ),
      )
    },
    [setTemplates, templates],
  )

  const value = useMemo<ResumeContextValue>(
    () => ({
      resume,
      templates,
      activeTemplateId,
      updatePersonal: (data) => dispatchAndPersist({ type: 'UPDATE_PERSONAL', payload: data }),
      updateSummary: (summary) => dispatchAndPersist({ type: 'UPDATE_SUMMARY', payload: summary }),
      addHighlight: () => dispatchAndPersist({ type: 'ADD_HIGHLIGHT' }),
      updateHighlight: (index, value) =>
        dispatchAndPersist({ type: 'UPDATE_HIGHLIGHT', payload: { index, value } }),
      removeHighlight: (index) =>
        dispatchAndPersist({ type: 'REMOVE_HIGHLIGHT', payload: index }),
      updateEducation: (data) =>
        dispatchAndPersist({ type: 'UPDATE_EDUCATION', payload: data }),
      setLanguages: (languages) =>
        dispatchAndPersist({ type: 'SET_LANGUAGES', payload: languages }),
      addExperience: () => dispatchAndPersist({ type: 'ADD_EXPERIENCE' }),
      removeExperience: (id) => dispatchAndPersist({ type: 'REMOVE_EXPERIENCE', payload: id }),
      updateExperience: (id, data) =>
        dispatchAndPersist({ type: 'UPDATE_EXPERIENCE', payload: { id, data } }),
      addExperienceBullet: (id) =>
        dispatchAndPersist({ type: 'ADD_EXPERIENCE_BULLET', payload: id }),
      updateExperienceBullet: (id, index, value) =>
        dispatchAndPersist({
          type: 'UPDATE_EXPERIENCE_BULLET',
          payload: { id, index, value },
        }),
      removeExperienceBullet: (id, index) =>
        dispatchAndPersist({ type: 'REMOVE_EXPERIENCE_BULLET', payload: { id, index } }),
      addProject: () => dispatchAndPersist({ type: 'ADD_PROJECT' }),
      removeProject: (id) => dispatchAndPersist({ type: 'REMOVE_PROJECT', payload: id }),
      updateProject: (id, data) =>
        dispatchAndPersist({ type: 'UPDATE_PROJECT', payload: { id, data } }),
      addProjectBullet: (id) =>
        dispatchAndPersist({ type: 'ADD_PROJECT_BULLET', payload: id }),
      updateProjectBullet: (id, index, value) =>
        dispatchAndPersist({
          type: 'UPDATE_PROJECT_BULLET',
          payload: { id, index, value },
        }),
      removeProjectBullet: (id, index) =>
        dispatchAndPersist({ type: 'REMOVE_PROJECT_BULLET', payload: { id, index } }),
      addSkillGroup: () => dispatchAndPersist({ type: 'ADD_SKILL_GROUP' }),
      removeSkillGroup: (id) => dispatchAndPersist({ type: 'REMOVE_SKILL_GROUP', payload: id }),
      updateSkillGroup: (id, data) =>
        dispatchAndPersist({ type: 'UPDATE_SKILL_GROUP', payload: { id, data } }),
      addCustomLink: () => dispatchAndPersist({ type: 'ADD_CUSTOM_LINK' }),
      removeCustomLink: (id) => dispatchAndPersist({ type: 'REMOVE_CUSTOM_LINK', payload: id }),
      updateCustomLink: (id, data) =>
        dispatchAndPersist({ type: 'UPDATE_CUSTOM_LINK', payload: { id, data } }),
      createTemplate,
      loadTemplate,
      saveActiveTemplate,
      duplicateTemplate,
      deleteTemplate,
      updateTemplateMeta,
      importResume: (importedResume) => {
        setActiveTemplateId('')
        persist(normalizeResume(importedResume))
      },
      resetResume: () => {
        setActiveTemplateId('')
        persist(defaultResume)
      },
    }),
    [
      activeTemplateId,
      createTemplate,
      deleteTemplate,
      dispatchAndPersist,
      duplicateTemplate,
      loadTemplate,
      persist,
      resume,
      saveActiveTemplate,
      setActiveTemplateId,
      templates,
      updateTemplateMeta,
    ],
  )

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within ResumeProvider')
  }
  return context
}
