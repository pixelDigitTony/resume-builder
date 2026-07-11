import { useRef } from 'react'
import { Eye } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import { useMainContentPagination } from '../../hooks/useMainContentPagination'
import { A4_HEIGHT_PX, A4_WIDTH_PX, usePreviewScale } from '../../hooks/usePreviewScale'
import { MainContentMeasurer } from './MainContentMeasurer'
import { ResumePage } from './ResumePage'
import './resume-preview.css'

const PAGE_GAP_PX = 24

export function ResumePreview() {
  const { resume } = useResume()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const scale = usePreviewScale(wrapperRef)
  const layouts = useMainContentPagination(measureRef, A4_HEIGHT_PX)
  const pageCount = layouts.length

  const fullWidth = A4_WIDTH_PX
  const fullHeight = pageCount * A4_HEIGHT_PX + (pageCount - 1) * PAGE_GAP_PX
  const scaledWidth = fullWidth * scale
  const scaledHeight = fullHeight * scale

  return (
    <div className="resume-preview-wrapper">
      <div className="resume-preview-header">
        <div className="resume-preview-heading">
          <span className="resume-preview-icon" aria-hidden="true">
            <Eye size={16} strokeWidth={2} />
          </span>
          <span>Preview</span>
        </div>
        <p className="resume-preview-label" aria-live="polite">
          {pageCount === 1 ? '1 page' : `${pageCount} pages`}
        </p>
      </div>

      <MainContentMeasurer resume={resume} measureRef={measureRef} />

      <div
        ref={wrapperRef}
        className="resume-preview-scroll"
        aria-label="Resume pages"
      >
        <div className="resume-preview-viewport">
          <div
            className="resume-preview-scaler"
            style={{
              width: scaledWidth,
              height: scaledHeight,
            }}
          >
            <div
              className="resume-pages-scaled"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: fullWidth,
                height: fullHeight,
              }}
            >
              <div id="resume-preview" className="resume-pages-stack">
                {layouts.map((layout, index) => (
                  <ResumePage
                    key={`page-${index + 1}`}
                    resume={resume}
                    layout={layout}
                    pageNumber={index + 1}
                    pageCount={pageCount}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
