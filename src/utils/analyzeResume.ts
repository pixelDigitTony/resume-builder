import type { Resume } from '../types/resume'

export type ReviewSection =
  | 'personal'
  | 'links'
  | 'summary'
  | 'highlights'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'education'

export interface ResumeFinding {
  id: string
  section: ReviewSection
  title: string
  detail: string
  priority: 'high' | 'medium' | 'low'
}

export interface ResumeAnalysis {
  score: number
  findings: ResumeFinding[]
  matchedKeywords: string[]
  missingKeywords: string[]
  keywordScore: number | null
}

const ACTION_VERBS = [
  'achieved', 'automated', 'built', 'created', 'delivered', 'designed', 'developed',
  'drove', 'implemented', 'improved', 'increased', 'launched', 'led', 'maintained',
  'managed', 'migrated', 'optimized', 'owned', 'reduced', 'resolved', 'shipped',
  'streamlined', 'supported',
]

const STOP_WORDS = new Set([
  'about', 'after', 'also', 'and', 'are', 'been', 'being', 'but', 'can', 'company',
  'experience', 'for', 'from', 'have', 'into', 'its', 'job', 'more', 'our', 'role',
  'that', 'the', 'their', 'this', 'using', 'we', 'will', 'with', 'you', 'your',
])

function cleanWords(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-/\s]/g, ' ')
    .split(/\s+/)
    .map((word) => word.replace(/^[./-]+|[./-]+$/g, ''))
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word))
}

function resumeAsText(resume: Resume) {
  return [
    resume.personal.title,
    resume.summary,
    ...resume.highlights,
    ...resume.experience.flatMap((job) => [job.title, job.company, ...job.bullets]),
    ...resume.projects.flatMap((project) => [
      project.name,
      project.description,
      ...project.technologies,
      ...project.bullets,
    ]),
    ...resume.skillGroups.flatMap((group) => [group.label, ...group.skills]),
    resume.education.degree,
  ].join(' ')
}

function extractJobKeywords(jobPosting: string) {
  const frequency = new Map<string, number>()
  cleanWords(jobPosting).forEach((word) => frequency.set(word, (frequency.get(word) ?? 0) + 1))

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 18)
    .map(([word]) => word)
}

export function analyzeResume(resume: Resume, jobPosting = ''): ResumeAnalysis {
  const findings: ResumeFinding[] = []
  const add = (finding: ResumeFinding) => findings.push(finding)
  const bullets = resume.experience.flatMap((job) => job.bullets).filter((bullet) => bullet.trim())
  const quantified = bullets.filter((bullet) => /\b\d+(?:[.,]\d+)?%?|\$\s?\d+/i.test(bullet))
  const actionLed = bullets.filter((bullet) => {
    const firstWord = cleanWords(bullet)[0]
    return firstWord ? ACTION_VERBS.includes(firstWord) : false
  })

  if (!resume.personal.email.trim() || !resume.personal.phone.trim()) {
    add({ id: 'contact', section: 'personal', title: 'Complete direct contact details', detail: 'Include both a professional email and a reachable phone number.', priority: 'high' })
  }
  if (!resume.personal.linkedin.trim() && !resume.personal.github.trim() && !resume.personal.portfolio.trim()) {
    add({ id: 'links', section: 'links', title: 'Add proof-of-work links', detail: 'For a developer role, LinkedIn plus GitHub or a portfolio makes verification easier.', priority: 'medium' })
  }
  if (resume.summary.trim().length < 80) {
    add({ id: 'summary-short', section: 'summary', title: 'Strengthen the opening summary', detail: 'Aim for 2-4 concise lines covering experience level, core stack, domain strength, and value.', priority: 'high' })
  } else if (resume.summary.length > 520) {
    add({ id: 'summary-long', section: 'summary', title: 'Tighten the opening summary', detail: 'Keep it scannable and move supporting detail into experience bullets.', priority: 'medium' })
  }
  if (resume.highlights.filter((item) => item.trim()).length < 3) {
    add({ id: 'highlights', section: 'highlights', title: 'Add three career highlights', detail: 'Surface the strongest outcomes a recruiter should understand in the first scan.', priority: 'medium' })
  }
  if (bullets.length < 6) {
    add({ id: 'bullet-count', section: 'experience', title: 'Add more evidence to recent roles', detail: 'Use 3-5 focused bullets for recent roles and fewer for older positions.', priority: 'high' })
  }
  if (bullets.length > 0 && actionLed.length / bullets.length < 0.7) {
    add({ id: 'action-verbs', section: 'experience', title: 'Lead bullets with decisive verbs', detail: 'Start most bullets with words such as Built, Led, Improved, Automated, or Delivered.', priority: 'medium' })
  }
  if (bullets.length > 0 && quantified.length / bullets.length < 0.25) {
    add({ id: 'metrics', section: 'experience', title: 'Add verified outcomes where possible', detail: 'Add truthful scale, time saved, reliability, adoption, revenue, or performance figures. Do not estimate numbers you cannot defend.', priority: 'high' })
  }
  if (bullets.some((bullet) => bullet.length > 280)) {
    add({ id: 'long-bullets', section: 'experience', title: 'Split dense experience bullets', detail: 'Keep each bullet to one focused achievement so recruiters can scan it and page breaks stay clean.', priority: 'medium' })
  }
  if (!resume.projects.some((project) => project.name.trim() && project.bullets.some((item) => item.trim()))) {
    add({ id: 'projects', section: 'projects', title: 'Show at least one relevant project', detail: 'Include the problem, your ownership, the technology, and the result.', priority: 'medium' })
  }
  if (resume.skillGroups.flatMap((group) => group.skills).filter(Boolean).length < 10) {
    add({ id: 'skills', section: 'skills', title: 'Expand searchable technical skills', detail: 'Include only tools you can discuss, grouped by language, framework, data, cloud, and testing.', priority: 'medium' })
  }

  const jobKeywords = extractJobKeywords(jobPosting)
  const resumeWords = new Set(cleanWords(resumeAsText(resume)))
  const matchedKeywords = jobKeywords.filter((word) => resumeWords.has(word))
  const missingKeywords = jobKeywords.filter((word) => !resumeWords.has(word))
  const keywordScore = jobKeywords.length
    ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
    : null

  if (keywordScore !== null && keywordScore < 55) {
    add({ id: 'keywords', section: 'skills', title: 'Tailor language to the target role', detail: 'Review the missing terms below and add only those that accurately reflect your experience.', priority: 'high' })
  }

  const deductions = findings.reduce(
    (total, finding) => total + (finding.priority === 'high' ? 10 : finding.priority === 'medium' ? 6 : 3),
    0,
  )

  return {
    score: Math.max(25, 100 - deductions),
    findings,
    matchedKeywords,
    missingKeywords,
    keywordScore,
  }
}
