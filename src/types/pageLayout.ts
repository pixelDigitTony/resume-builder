export interface SidebarLayout {
  showPhoto: boolean
  showContact: boolean
  skillGroupIds: string[]
  showLanguages: boolean
  showEducation: boolean
}

export interface ContentSegment {
  id: string
  bulletIndexes?: number[]
  continued?: boolean
}

export interface PageLayout {
  showHeader: boolean
  showSummary: boolean
  showHighlights: boolean
  showExperienceHeading: boolean
  experienceSegments: ContentSegment[]
  showProjectsHeading: boolean
  projectSegments: ContentSegment[]
  sidebar: SidebarLayout
}

export function createFullSidebarLayout(skillGroupIds: string[] = []): SidebarLayout {
  return {
    showPhoto: true,
    showContact: true,
    skillGroupIds,
    showLanguages: true,
    showEducation: true,
  }
}

export function createEmptySidebarLayout(): SidebarLayout {
  return {
    showPhoto: false,
    showContact: false,
    skillGroupIds: [],
    showLanguages: false,
    showEducation: false,
  }
}

export function createDefaultPageLayout(
  experienceIds: string[],
  projectIds: string[] = [],
  skillGroupIds: string[] = [],
): PageLayout {
  return {
    showHeader: true,
    showSummary: true,
    showHighlights: true,
    showExperienceHeading: true,
    experienceSegments: experienceIds.map((id) => ({ id })),
    showProjectsHeading: true,
    projectSegments: projectIds.map((id) => ({ id })),
    sidebar: createFullSidebarLayout(skillGroupIds),
  }
}

export function createContinuationPageLayout(
  experienceIds: string[],
  projectIds: string[] = [],
): PageLayout {
  return {
    showHeader: false,
    showSummary: false,
    showHighlights: false,
    showExperienceHeading: false,
    experienceSegments: experienceIds.map((id) => ({ id })),
    showProjectsHeading: false,
    projectSegments: projectIds.map((id) => ({ id })),
    sidebar: createEmptySidebarLayout(),
  }
}
