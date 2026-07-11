import { AlertCircle, CheckCircle2, SearchCheck } from 'lucide-react'
import { useMemo } from 'react'
import { useResume } from '../../context/ResumeContext'
import { analyzeResume, type ReviewSection } from '../../utils/analyzeResume'
import { FormSection } from './FormSection'

interface ResumeReviewProps {
  onOpenSection?: (section: ReviewSection) => void
}

export function ResumeReview({ onOpenSection }: ResumeReviewProps) {
  const { resume, templates, activeTemplateId } = useResume()
  const activeTemplate = templates.find((template) => template.id === activeTemplateId)
  const analysis = useMemo(
    () => analyzeResume(resume, activeTemplate?.jobPosting ?? ''),
    [activeTemplate?.jobPosting, resume],
  )

  return (
    <div className="space-y-4">
      <FormSection title="Recruiter readiness" eyebrow={`${analysis.score}/100`}>
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-700">Resume fundamentals</span>
              <span className="font-semibold text-slate-950">{analysis.score}%</span>
            </div>
            <div
              className="h-2.5 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label="Recruiter readiness score"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={analysis.score}
            >
              <div className="h-full rounded-full bg-teal-600" style={{ width: `${analysis.score}%` }} />
            </div>
          </div>

          {analysis.findings.length === 0 ? (
            <div className="flex gap-3 border-l-4 border-emerald-500 bg-emerald-50 p-4 text-emerald-950">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p className="text-sm">The core recruiter and ATS checks look strong.</p>
            </div>
          ) : (
            <ul className="space-y-3" aria-label="Resume recommendations">
              {analysis.findings.map((finding) => (
                <li key={finding.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className={`mt-0.5 h-5 w-5 shrink-0 ${finding.priority === 'high' ? 'text-amber-600' : 'text-slate-400'}`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{finding.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{finding.detail}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenSection?.(finding.section)}
                      className="shrink-0 rounded-lg px-2 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-300"
                      aria-label={`Open ${finding.section} section for: ${finding.title}`}
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </FormSection>

      <FormSection title="Job keyword match" eyebrow={analysis.keywordScore === null ? 'No job posting' : `${analysis.keywordScore}% match`}>
        {analysis.keywordScore === null ? (
          <div className="flex gap-3 border-l-4 border-slate-300 bg-slate-50 p-4">
            <SearchCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
            <p className="text-sm leading-6 text-slate-600">
              Save a resume variation with the target job posting to compare its recurring terms with this resume.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm leading-6 text-slate-600">
              This is a language check, not a hiring prediction. Add a missing term only when it truthfully describes your work.
            </p>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-800">Missing recurring terms</p>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.length > 0 ? analysis.missingKeywords.map((keyword) => (
                  <span key={keyword} className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900">
                    {keyword}
                  </span>
                )) : <span className="text-sm text-emerald-700">No major recurring terms are missing.</span>}
              </div>
            </div>
            {analysis.matchedKeywords.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-slate-800">Already represented</p>
                <p className="text-sm leading-6 text-slate-600">{analysis.matchedKeywords.join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </FormSection>
    </div>
  )
}
