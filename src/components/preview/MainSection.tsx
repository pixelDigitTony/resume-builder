import type { ContentSegment, PageLayout } from '../../types/pageLayout'
import type { Resume } from '../../types/resume'

interface MainSectionProps {
  resume: Resume
  layout: PageLayout
}

function selectBullets(bullets: string[], segment: ContentSegment) {
  return bullets
    .map((bullet, index) => ({ bullet, index }))
    .filter(
      ({ bullet, index }) =>
        Boolean(bullet) &&
        (segment.bulletIndexes === undefined || segment.bulletIndexes.includes(index)),
    )
}

function isFinalSegment(bullets: string[], segment: ContentSegment) {
  if (segment.bulletIndexes === undefined) return true
  const lastIndex = bullets.reduce((last, bullet, index) => (bullet ? index : last), -1)
  return segment.bulletIndexes.includes(lastIndex)
}

export function MainSection({ resume, layout }: MainSectionProps) {
  const { personal, summary, highlights, experience, projects } = resume
  const jobs = layout.experienceSegments.flatMap((segment) => {
    const item = experience.find((job) => job.id === segment.id)
    return item ? [{ item, segment }] : []
  })
  const selectedProjects = layout.projectSegments.flatMap((segment) => {
    const item = projects.find((project) => project.id === segment.id)
    return item ? [{ item, segment }] : []
  })
  const visibleHighlights = highlights.filter(Boolean)

  return (
    <div className="resume-main">
      {layout.showHeader && (
        <header className="resume-main-heading" data-block="header" data-block-type="header">
          <h1 className="resume-name">{personal.fullName || 'Your Name'}</h1>
          {personal.title && <p className="resume-title">{personal.title}</p>}
        </header>
      )}

      {layout.showSummary && summary && (
        <section className="resume-main-block" data-block="summary" data-block-type="summary">
          <h2 className="resume-section-label">Summary</h2>
          <p className="resume-body-text">{summary}</p>
        </section>
      )}

      {layout.showHighlights && visibleHighlights.length > 0 && (
        <section className="resume-main-block" data-block="highlights" data-block-type="highlights">
          <h2 className="resume-section-label">Career Highlights</h2>
          <ul className="resume-bullet-list resume-bullet-list--compact">
            {visibleHighlights.map((highlight, index) => (
              <li key={`highlight-${index}`} className="resume-bullet-item">
                <span className="resume-block-anchor">
                  <span className="resume-bullet-marker" aria-hidden="true">&bull;</span>
                  <span className="resume-bullet-text">{highlight}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {jobs.length > 0 && (
        <section className="resume-main-block resume-main-block--segmented">
          {layout.showExperienceHeading && (
            <h2
              className="resume-section-label resume-experience-heading"
              data-block="experience-heading"
              data-block-type="experience-heading"
            >
              Experience
            </h2>
          )}
          <div className="resume-jobs">
            {jobs.map(({ item: job, segment }) => {
              const bullets = selectBullets(job.bullets, segment)
              const finalSegment = isFinalSegment(job.bullets, segment)
              return (
                <article
                  key={job.id}
                  className={`resume-job ${bullets.length === 0 ? 'resume-job--no-bullets' : ''} ${finalSegment ? '' : 'resume-job--continued-after'}`.trim()}
                >
                  <div
                    className="resume-job-header"
                    data-block={`job-${job.id}-header`}
                    data-block-type="experience-item-header"
                    data-item-id={job.id}
                  >
                    <div className="resume-job-title-row">
                      <h3 className="resume-job-title">
                        {job.title}{segment.continued ? ' (continued)' : ''}
                      </h3>
                      {(job.startDate || job.endDate) && (
                        <p className="resume-job-date">
                          {job.startDate}{job.startDate && job.endDate ? ' - ' : ''}{job.endDate}
                        </p>
                      )}
                    </div>
                    <p className="resume-job-company">
                      {job.company}{job.location ? ` | ${job.location}` : ''}
                    </p>
                  </div>
                  {bullets.length > 0 && (
                    <ul className="resume-bullet-list">
                      {bullets.map(({ bullet, index }) => (
                        <li
                          key={`${job.id}-bullet-${index}`}
                          className="resume-bullet-item"
                          data-block={`${job.id}-bullet-${index}`}
                          data-block-type="experience-item-bullet"
                          data-item-id={job.id}
                          data-bullet-index={index}
                        >
                          <span className="resume-block-anchor">
                            <span className="resume-bullet-marker" aria-hidden="true">&bull;</span>
                            <span className="resume-bullet-text">{bullet}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      )}

      {selectedProjects.length > 0 && (
        <section className="resume-main-block resume-main-block--segmented">
          {layout.showProjectsHeading && (
            <h2
              className="resume-section-label resume-experience-heading"
              data-block="projects-heading"
              data-block-type="projects-heading"
            >
              Selected Projects
            </h2>
          )}
          <div className="resume-jobs">
            {selectedProjects.map(({ item: project, segment }) => {
              const bullets = selectBullets(project.bullets, segment)
              const finalSegment = isFinalSegment(project.bullets, segment)
              return (
                <article
                  key={project.id}
                  className={`resume-job ${bullets.length === 0 ? 'resume-job--no-bullets' : ''} ${finalSegment ? '' : 'resume-job--continued-after'}`.trim()}
                >
                  <div
                    className="resume-job-header"
                    data-block={`project-${project.id}-header`}
                    data-block-type="project-item-header"
                    data-item-id={project.id}
                  >
                    <h3 className="resume-job-title resume-job-title--full">
                      {project.name}{segment.continued ? ' (continued)' : ''}
                    </h3>
                    {project.description && <p className="resume-job-company">{project.description}</p>}
                    {project.technologies.filter(Boolean).length > 0 && (
                      <p className="resume-project-tech">{project.technologies.filter(Boolean).join(', ')}</p>
                    )}
                  </div>
                  {bullets.length > 0 && (
                    <ul className="resume-bullet-list">
                      {bullets.map(({ bullet, index }) => (
                        <li
                          key={`${project.id}-bullet-${index}`}
                          className="resume-bullet-item"
                          data-block={`${project.id}-bullet-${index}`}
                          data-block-type="project-item-bullet"
                          data-item-id={project.id}
                          data-bullet-index={index}
                        >
                          <span className="resume-block-anchor">
                            <span className="resume-bullet-marker" aria-hidden="true">&bull;</span>
                            <span className="resume-bullet-text">{bullet}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
