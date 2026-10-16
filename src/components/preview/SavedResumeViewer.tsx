import { useEffect, useState } from 'react'
import type { Resume } from '../../types/resume'
import { downloadAtsResume, printSavedResume } from '../../utils/resumeDownloads'
import { ResumePreviewContent } from './ResumePreview'

type SavedResume = { fullName: string; companyName: string; version: number; canDownload: boolean; snapshot: { schemaVersion: number; resume: Resume; includesEditableData: boolean } }
const viewCode = new URLSearchParams(window.location.hash.slice(1)).get('resumeBankViewCode') || ''
if (new URLSearchParams(window.location.search).get('view') === '1' && viewCode) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
let viewPromise: Promise<SavedResume> | undefined
async function loadView(): Promise<SavedResume> {
  const api = (import.meta.env.VITE_RESUME_BANK_API_URL || '').replace(/\/$/, '')
  if (!api || !viewCode) throw new Error('Reopen this saved resume from Resume Bank.')
  const response = await fetch(`${api}/public/resume-bank/view-session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ launchCode: viewCode }), signal: AbortSignal.timeout(90000) })
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.error?.message || 'The saved resume could not load.')
  if (payload.snapshot?.schemaVersion !== 1 || !payload.snapshot.resume?.personal) throw new Error('This saved resume version is not supported.')
  return payload
}

export function SavedResumeViewer() {
  const [saved, setSaved] = useState<SavedResume>()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    let disposed = false
    viewPromise ||= loadView()
    viewPromise.then(value => { if (!disposed) setSaved(value) }, failure => { if (!disposed) setError(failure instanceof Error ? failure.message : 'The saved resume could not load.') })
    return () => { disposed = true }
  }, [])
  async function exportResume(format: 'ats' | 'designed') {
    if (!saved?.canDownload || busy) return
    setBusy(true)
    setError('')
    try {
      if (format === 'ats') await downloadAtsResume(saved.snapshot.resume, saved.snapshot.includesEditableData)
      else await printSavedResume(saved.snapshot.resume)
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Export failed. Try again.') }
    finally { setBusy(false) }
  }
  return <div data-app-shell className="flex h-dvh min-h-0 flex-col bg-slate-100 text-slate-950">
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
      <div><h1 className="font-semibold">{saved?.fullName || 'Saved resume'}</h1><p className="text-xs text-slate-600">{saved ? `${saved.companyName} · Version ${saved.version} · Read only` : 'Loading saved resume…'}</p></div>
      {saved?.canDownload && <div className="flex flex-wrap gap-2"><button disabled={busy} onClick={() => void exportResume('ats')} className="rounded border border-teal-700 px-3 py-2 text-sm font-semibold disabled:opacity-50">Download ATS PDF</button><button disabled={busy} onClick={() => void exportResume('designed')} className="rounded bg-teal-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Print / Save PDF</button></div>}
    </header>
    {error && <p role="alert" className="border-b border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    {saved ? <main className="min-h-0 flex-1 p-3"><ResumePreviewContent resume={saved.snapshot.resume} /></main> : !error && <p role="status" className="p-4">Loading saved resume…</p>}
  </div>
}
