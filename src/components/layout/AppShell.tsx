import { Eye, FilePenLine, FileText, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { EditorPanel } from '../editor/EditorPanel'
import { secondaryButton } from '../editor/buttonStyles'
import { ExportAtsPdfButton } from '../export/ExportAtsPdfButton'
import { ExportPdfButton } from '../export/ExportPdfButton'
import { ImportResumeButton } from '../import/ImportResumeButton'
import { ResumePreview } from '../preview/ResumePreview'

export function AppShell() {
  const { resume, templates, activeTemplateId, resetResume } = useResume()
  const activeTemplate = templates.find((template) => template.id === activeTemplateId)
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')

  const handleReset = () => {
    if (window.confirm('Reset all fields to the default resume content?')) {
      resetResume()
    }
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#eef2f1]">
      <a
        href="#main-content"
        className="fixed left-3 top-3 z-50 -translate-y-20 rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white transition focus:translate-y-0"
      >
        Skip to resume workspace
      </a>
      <header className="relative z-20 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-white shadow-sm">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-slate-950">Resume Builder</h1>
              <p className="truncate text-sm text-slate-600">
                {activeTemplate
                  ? `${activeTemplate.name} - ${resume.personal.fullName || 'Untitled resume'}`
                  : resume.personal.fullName || 'Untitled resume'}
              </p>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={handleReset}
              className={secondaryButton}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </button>
            <ImportResumeButton />
            <ExportAtsPdfButton />
            <ExportPdfButton />
          </div>
        </div>
      </header>

      <div className="z-10 shrink-0 border-b border-slate-200 bg-white p-2 lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 rounded-lg bg-slate-100 p-1" role="group" aria-label="Mobile workspace view">
          <button
            type="button"
            onClick={() => setMobileView('edit')}
            aria-pressed={mobileView === 'edit'}
            className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 ${mobileView === 'edit' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600'}`}
          >
            <FilePenLine className="h-4 w-4" aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            aria-pressed={mobileView === 'preview'}
            className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 ${mobileView === 'preview' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600'}`}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Preview
          </button>
        </div>
      </div>

      <main id="main-content" className="mx-auto grid min-h-0 w-full max-w-[1440px] flex-1 grid-rows-[minmax(0,1fr)] gap-6 overflow-hidden px-4 py-4 lg:grid-cols-[minmax(390px,0.9fr)_minmax(460px,1.1fr)] lg:px-6 lg:py-6">
        <section aria-label="Resume editor" className={`h-full min-h-0 min-w-0 overflow-y-auto overscroll-contain pr-1 ${mobileView === 'edit' ? 'block' : 'hidden'} lg:block`}>
          <EditorPanel />
        </section>
        <section aria-label="Resume preview" className={`h-full min-h-0 min-w-0 overflow-hidden ${mobileView === 'preview' ? 'block' : 'hidden'} lg:block`}>
          <ResumePreview />
        </section>
      </main>
    </div>
  )
}
