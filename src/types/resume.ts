export interface CustomLink {
  id: string
  label: string
  url: string
}

export interface PhotoCrop {
  offsetX: number
  offsetY: number
  scale: number
}

export const DEFAULT_PHOTO_CROP: PhotoCrop = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
}

export interface PersonalInfo {
  fullName: string
  title: string
  phone: string
  email: string
  location: string
  linkedin: string
  github: string
  portfolio: string
  photoUrl: string
  photoOriginalUrl: string
  photoCrop: PhotoCrop
}

export interface Experience {
  id: string
  company: string
  location: string
  title: string
  startDate: string
  endDate: string
  bullets: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  bullets: string[]
}

export interface SkillGroup {
  id: string
  label: string
  skills: string[]
}

export interface Education {
  institution: string
  location: string
  degree: string
  graduationYear: string
}

export interface Resume {
  personal: PersonalInfo
  customLinks: CustomLink[]
  summary: string
  highlights: string[]
  experience: Experience[]
  projects: Project[]
  skillGroups: SkillGroup[]
  education: Education
  languages: string[]
}

export interface ResumeTemplate {
  id: string
  name: string
  targetRole: string
  jobPosting: string
  createdAt: string
  updatedAt: string
  resume: Resume
}
