import type { Resume } from '../types/resume'
import { DEFAULT_PHOTO_CROP } from '../types/resume'

export const defaultResume: Resume = {
  customLinks: [],
  personal: {
    fullName: '',
    title: '',
    phone: '',
    email: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    photoUrl: '',
    photoOriginalUrl: '',
    photoCrop: DEFAULT_PHOTO_CROP,
  },
  summary: '',
  highlights: [],
  experience: [],
  projects: [],
  skillGroups: [],
  education: {
    institution: '',
    location: '',
    degree: '',
    graduationYear: '',
  },
  languages: [],
}
