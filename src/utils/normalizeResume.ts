import { defaultResume } from '../data/defaultResume'
import { DEFAULT_PHOTO_CROP, type Resume } from '../types/resume'

export function normalizeResume(data: Partial<Resume> | null | undefined): Resume {
  if (!data) return defaultResume

  const personal = { ...defaultResume.personal, ...data.personal }

  return {
    ...defaultResume,
    ...data,
    personal: {
      ...personal,
      photoOriginalUrl: personal.photoOriginalUrl || personal.photoUrl || '',
      photoCrop: personal.photoCrop ?? DEFAULT_PHOTO_CROP,
    },
    customLinks: data.customLinks ?? [],
    highlights: data.highlights ?? [],
    experience: data.experience ?? [],
    projects: data.projects ?? [],
    skillGroups: data.skillGroups ?? [],
    education: { ...defaultResume.education, ...data.education },
    languages: data.languages ?? [],
    summary: data.summary ?? '',
  }
}
