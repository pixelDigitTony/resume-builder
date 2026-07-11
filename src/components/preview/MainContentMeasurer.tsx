import type { RefObject } from 'react'
import type { Resume } from '../../types/resume'
import { MainSection } from './MainSection'
import { createDefaultPageLayout, createFullSidebarLayout } from '../../types/pageLayout'
import { SidebarSection } from './SidebarSection'

interface MainContentMeasurerProps {
  resume: Resume
  measureRef: RefObject<HTMLDivElement | null>
}

export function MainContentMeasurer({ resume, measureRef }: MainContentMeasurerProps) {
  const allJobIds = resume.experience.map((job) => job.id)
  const allProjectIds = resume.projects.map((project) => project.id)
  const allSkillGroupIds = resume.skillGroups.map((group) => group.id)
  const fullLayout = createDefaultPageLayout(allJobIds, allProjectIds)
  const fullSidebarLayout = createFullSidebarLayout(allSkillGroupIds)

  return (
    <div ref={measureRef} className="resume-measure" aria-hidden="true">
      <div className="resume-measure-sidebar">
        <SidebarSection resume={resume} layout={fullSidebarLayout} />
      </div>
      <div className="resume-measure-main">
        <MainSection resume={resume} layout={fullLayout} />
      </div>
    </div>
  )
}
