import type { ReactNode } from 'react'

interface FormSectionProps {
  title: string
  eyebrow?: string
  children: ReactNode
}

export function FormSection({ title, eyebrow, children }: FormSectionProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 border-b border-slate-100 pb-4">
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase text-teal-700">{eyebrow}</p>}
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
  )
}
