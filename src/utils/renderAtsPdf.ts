import type { jsPDF } from 'jspdf'
import type { Resume } from '../types/resume'

const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const MARGIN = 18
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const BOTTOM_LIMIT = PAGE_HEIGHT - MARGIN

export function renderAtsPdf(pdf: jsPDF, resume: Resume) {
  let y = MARGIN

  const ensureSpace = (height: number) => {
    if (y + height <= BOTTOM_LIMIT) return
    pdf.addPage()
    y = MARGIN
  }

  const writeLines = (
    value: string,
    options: { size?: number; bold?: boolean; indent?: number; gapAfter?: number } = {},
  ) => {
    const text = value.trim()
    if (!text) return
    const size = options.size ?? 10
    const indent = options.indent ?? 0
    const lineHeight = size * 0.42
    pdf.setFont('helvetica', options.bold ? 'bold' : 'normal')
    pdf.setFontSize(size)
    const lines = pdf.splitTextToSize(text, CONTENT_WIDTH - indent) as string[]
    ensureSpace(lines.length * lineHeight + (options.gapAfter ?? 0))
    pdf.text(lines, MARGIN + indent, y)
    y += lines.length * lineHeight + (options.gapAfter ?? 0)
  }

  const section = (label: string) => {
    ensureSpace(10)
    y += 2
    writeLines(label.toUpperCase(), { size: 11, bold: true, gapAfter: 2 })
    pdf.setDrawColor(180, 190, 195)
    pdf.line(MARGIN, y - 1, PAGE_WIDTH - MARGIN, y - 1)
    y += 2
  }

  const bullet = (value: string) => {
    const text = value.trim()
    if (!text) return
    const size = 9.5
    const indent = 5
    const lines = pdf.splitTextToSize(text, CONTENT_WIDTH - indent) as string[]
    const height = lines.length * 4 + 1
    ensureSpace(height)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(size)
    pdf.text('-', MARGIN, y)
    pdf.text(lines, MARGIN + indent, y)
    y += height
  }

  writeLines(resume.personal.fullName || 'Resume', { size: 20, bold: true, gapAfter: 1 })
  writeLines(resume.personal.title, { size: 12, bold: true, gapAfter: 2 })
  writeLines(
    [resume.personal.location, resume.personal.phone, resume.personal.email]
      .filter(Boolean)
      .join(' | '),
    { size: 9.5, gapAfter: 1 },
  )
  writeLines(
    [
      resume.personal.linkedin,
      resume.personal.github,
      resume.personal.portfolio,
      ...resume.customLinks.map((link) => link.url),
    ]
      .filter(Boolean)
      .join(' | '),
    { size: 9, gapAfter: 2 },
  )

  if (resume.summary.trim()) {
    section('Professional Summary')
    writeLines(resume.summary, { gapAfter: 1 })
  }

  if (resume.highlights.some((highlight) => highlight.trim())) {
    section('Career Highlights')
    resume.highlights.forEach(bullet)
  }

  if (resume.experience.length > 0) {
    section('Professional Experience')
    resume.experience.forEach((job) => {
      ensureSpace(15)
      writeLines(job.title, { size: 11, bold: true })
      writeLines(
        [job.company, job.location, [job.startDate, job.endDate].filter(Boolean).join(' - ')]
          .filter(Boolean)
          .join(' | '),
        { size: 9.5, gapAfter: 1 },
      )
      job.bullets.forEach(bullet)
      y += 2
    })
  }

  if (resume.projects.length > 0) {
    section('Selected Projects')
    resume.projects.forEach((project) => {
      ensureSpace(14)
      writeLines(project.name, { size: 11, bold: true })
      writeLines(project.description, { size: 9.5 })
      writeLines(project.technologies.filter(Boolean).join(', '), { size: 9, bold: true, gapAfter: 1 })
      project.bullets.forEach(bullet)
      y += 2
    })
  }

  if (resume.skillGroups.length > 0) {
    section('Technical Skills')
    resume.skillGroups.forEach((group) => {
      writeLines(`${group.label}: ${group.skills.filter(Boolean).join(', ')}`, { size: 9.5, gapAfter: 1 })
    })
  }

  section('Education')
  writeLines(resume.education.degree, { size: 10.5, bold: true })
  writeLines(
    [resume.education.institution, resume.education.location, resume.education.graduationYear]
      .filter(Boolean)
      .join(' | '),
    { size: 9.5 },
  )

  if (resume.languages.some(Boolean)) {
    section('Languages')
    writeLines(resume.languages.filter(Boolean).join(', '), { size: 9.5 })
  }

  return pdf
}
