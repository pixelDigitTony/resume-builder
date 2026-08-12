import type { PersonalInfo, StandardLinkType } from '../types/resume'

export interface StandardLinkDefinition {
  type: StandardLinkType
  label: string
  placeholder: string
  icon: string
}

export const STANDARD_LINK_DEFINITIONS: Record<StandardLinkType, StandardLinkDefinition> = {
  linkedin: {
    type: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/your-profile',
    icon: 'linkedin',
  },
  facebook: {
    type: 'facebook',
    label: 'Facebook',
    placeholder: 'https://facebook.com/your-profile',
    icon: 'facebook',
  },
  portfolio: {
    type: 'portfolio',
    label: 'Portfolio',
    placeholder: 'https://your-portfolio.com',
    icon: 'globe',
  },
  github: {
    type: 'github',
    label: 'GitHub',
    placeholder: 'https://github.com/your-username',
    icon: 'github',
  },
}

export const ADDABLE_STANDARD_LINKS: StandardLinkType[] = [
  'linkedin',
  'facebook',
  'portfolio',
]

export function getStandardLinkUrl(
  personal: PersonalInfo,
  type: StandardLinkType,
): string {
  return personal[type]
}
