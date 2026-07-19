import type { Resume } from '../../types/resume'
import type { PageLayout } from '../../types/pageLayout'
import { MainSection } from './MainSection'
import { SidebarSection } from './SidebarSection'

interface ResumePageProps {
  resume: Resume
  layout: PageLayout
  pageNumber: number
  pageCount: number
}

export function ResumePage({ resume, layout, pageNumber, pageCount }: ResumePageProps) {
  return (
    <div className="resume-page" data-page={pageNumber}>
      <div className="resume-page-grid">
        <MainSection resume={resume} layout={layout} />
        <SidebarSection resume={resume} layout={layout.sidebar} />
      </div>
      <span className="resume-page-number" aria-hidden="true">
        Page {pageNumber} of {pageCount}
      </span>
    </div>
  )
}
