import { createRoot } from 'react-dom/client'
import { ResumeProvider } from '../context/ResumeContext'
import { ResumePreview } from '../components/preview/ResumePreview'
import type { Resume } from '../types/resume'
import '../index.css'

export async function render(resume: Resume) {
  document.title = `${resume.personal.fullName} - Resume`
  createRoot(document.getElementById('root')!).render(<ResumeProvider initialResume={resume}><ResumePreview /></ResumeProvider>)
  await document.fonts.ready
  for (let attempt = 0, stable = 0, previous = ''; attempt < 200; attempt += 1) {
    await new Promise(resolve => window.setTimeout(resolve, 50))
    const current = [...document.querySelectorAll('.resume-page')].map(page => page.innerHTML).join('')
    const imagesLoaded = [...document.images].every(image => image.complete)
    stable = current && current === previous && imagesLoaded ? stable + 1 : 0
    if (stable >= 5) return
    previous = current
  }
  throw new Error('Resume pagination did not finish')
}
