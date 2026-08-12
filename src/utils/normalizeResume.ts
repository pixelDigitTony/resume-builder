import { defaultResume } from '../data/defaultResume'
import {
  DEFAULT_PHOTO_CROP,
  type Resume,
  type StandardLinkType,
} from '../types/resume'

const VALID_STANDARD_LINKS = new Set<StandardLinkType>([
  'linkedin',
  'facebook',
  'portfolio',
  'github',
])

export function normalizeResume(data: Partial<Resume> | null | undefined): Resume {
  if (!data) return defaultResume

  const personal = { ...defaultResume.personal, ...data.personal }
  const standardLinks = Array.isArray(data.standardLinks)
    ? data.standardLinks.filter((type): type is StandardLinkType =>
        VALID_STANDARD_LINKS.has(type as StandardLinkType),
      )
    : [
        'linkedin' as const,
        ...(personal.facebook ? (['facebook'] as const) : []),
        ...(personal.github ? (['github'] as const) : []),
        ...(!personal.facebook && !personal.github ? (['facebook'] as const) : []),
        'portfolio' as const,
      ]

  return {
    ...defaultResume,
    ...data,
    personal: {
      ...personal,
      photoOriginalUrl: personal.photoOriginalUrl || personal.photoUrl || '',
      photoCrop: personal.photoCrop ?? DEFAULT_PHOTO_CROP,
    },
    standardLinks,
    customLinks: (data.customLinks ?? []).map((link) => ({
      ...link,
      icon: link.icon || 'globe',
    })),
    highlights: data.highlights ?? [],
    experience: data.experience ?? [],
    projects: data.projects ?? [],
    skillGroups: data.skillGroups ?? [],
    education: { ...defaultResume.education, ...data.education },
    languages: data.languages ?? [],
    summary: data.summary ?? '',
  }
}
