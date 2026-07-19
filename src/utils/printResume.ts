import type { Resume } from '../types/resume'
import { getResumePdfMetadata } from './pdfMetadata'

interface RestorableMeta {
  element: HTMLMetaElement
  previousContent: string | null
  created: boolean
}

function setMeta(name: string, content: string): RestorableMeta {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  const created = !element

  if (!element) {
    element = document.createElement('meta')
    element.name = name
    document.head.appendChild(element)
  }

  const previousContent = element.getAttribute('content')
  element.content = content
  return { element, previousContent, created }
}

function restoreMeta(meta: RestorableMeta) {
  if (meta.created) {
    meta.element.remove()
  } else if (meta.previousContent === null) {
    meta.element.removeAttribute('content')
  } else {
    meta.element.content = meta.previousContent
  }
}

export function printResume(resume: Resume) {
  const pages = document.querySelectorAll('.resume-page')
  if (pages.length === 0) return

  const metadata = getResumePdfMetadata(resume)
  const previousTitle = document.title
  const metas = [
    setMeta('author', metadata.author),
    setMeta('description', metadata.subject),
    setMeta('subject', metadata.subject),
    setMeta('keywords', metadata.keywords),
  ]

  document.title = metadata.title
  document.body.classList.add('resume-printing')

  try {
    window.print()
  } finally {
    document.body.classList.remove('resume-printing')
    document.title = previousTitle
    metas.forEach(restoreMeta)
  }
}
