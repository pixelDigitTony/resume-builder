import { createRoot } from 'react-dom/client'
import { ResumePreviewContent } from '../components/preview/ResumePreview'
import type { Resume } from '../types/resume'
import { getResumePdfMetadata } from './pdfMetadata'

export async function downloadAtsResume(resume: Resume, editable: boolean) {
  const [{ jsPDF }, { renderAtsPdf }, { savePdfFile }] = await Promise.all([import('jspdf'), import('./renderAtsPdf'), import('./portableResumePdf')])
  const pdf = renderAtsPdf(new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true }), resume)
  const name = resume.personal.fullName.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '') || 'resume'
  savePdfFile(pdf, `${name}-ATS.pdf`, editable ? resume : undefined)
}

// Print a frozen copy without picking up edits made during an API save.
export async function printSavedResume(resume: Resume) {
  const frame = document.createElement('iframe')
  frame.title = 'Resume print preview'
  frame.setAttribute('aria-hidden', 'true')
  Object.assign(frame.style, { position: 'fixed', left: '-10000px', top: '0', width: '900px', height: '1200px', border: '0' })
  document.body.appendChild(frame)
  const target = frame.contentDocument
  const targetWindow = frame.contentWindow
  if (!target || !targetWindow) { frame.remove(); throw new Error('Print preview could not open.') }
  target.open()
  target.write('<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div></body></html>')
  target.close()
  const stylesLoaded: Promise<void>[] = []
  for (const style of document.head.querySelectorAll('style,link[rel="stylesheet"]')) {
    const copy = style.cloneNode(true) as HTMLStyleElement | HTMLLinkElement
    if (copy instanceof HTMLLinkElement) {
      copy.href = (style as HTMLLinkElement).href
      stylesLoaded.push(new Promise((resolve, reject) => {
        const timeout = window.setTimeout(() => reject(new Error('Print styles did not load. Please retry.')), 10000)
        copy.onload = () => { window.clearTimeout(timeout); resolve() }
        copy.onerror = () => { window.clearTimeout(timeout); reject(new Error('Print styles did not load. Please retry.')) }
      }))
    }
    target.head.appendChild(copy)
  }
  target.title = getResumePdfMetadata(resume).title
  const root = createRoot(target.getElementById('root')!)
  try {
    await Promise.all(stylesLoaded)
    root.render(<ResumePreviewContent resume={resume} />)
    for (let attempt = 0, stable = 0, previous = ''; ; attempt += 1) {
      await new Promise(resolve => window.setTimeout(resolve, 50))
      const content = Array.from(target.querySelectorAll('.resume-page')).map(page => page.innerHTML).join('')
      stable = content && content === previous && Array.from(target.images).every(image => image.complete) ? stable + 1 : 0
      if (stable >= 5 && target.fonts.status === 'loaded') break
      if (attempt >= 200) throw new Error('The resume layout is still loading. Try printing again.')
      previous = content
    }
    target.body.classList.add('resume-printing')
    targetWindow.focus()
    targetWindow.print()
  } finally { root.unmount(); frame.remove() }
}
