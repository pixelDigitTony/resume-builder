import type { Resume } from '../types/resume'

export interface ResumePdfMetadata {
  title: string
  author: string
  subject: string
  keywords: string
  creator: string
}

function uniqueValues(values: string[]) {
  const seen = new Set<string>()

  return values.flatMap((value) => {
    const trimmed = value.trim()
    const key = trimmed.toLocaleLowerCase()
    if (!trimmed || seen.has(key)) return []
    seen.add(key)
    return [trimmed]
  })
}

export function getResumePdfMetadata(resume: Resume): ResumePdfMetadata {
  const author = resume.personal.fullName.trim()
  const role = resume.personal.title.trim()
  const keywordRole = role.replace(
    /^(?:senior|sr\.?|lead|principal|staff|junior|jr\.?|mid-level)\s+/i,
    '',
  )
  const title = [author, role].filter(Boolean).join(' - ') || 'Resume'
  const subject = role ? `${role} Resume` : 'Professional Resume'
  const keywords = uniqueValues([
    keywordRole,
    ...resume.skillGroups.flatMap((group) => group.skills),
    ...resume.projects.flatMap((project) => project.technologies),
  ]).join(', ')

  return {
    title,
    author,
    subject,
    keywords,
    creator: 'Resume Builder',
  }
}
