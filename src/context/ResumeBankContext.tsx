import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Resume } from '../types/resume'
import { preparePdfBytes } from '../utils/portableResumePdf'

type Format = 'ats' | 'designed'
type Operation = { id: string; resume: Resume; format: Format; includesEditableData: boolean; pdf?: Uint8Array; ready?: boolean }
type Session = { credential: string; companyName: string }
type CaptureContext = { enabled: boolean; busy: boolean; ready: boolean; companyName: string; error: string; message: string; exportResume: (resume: Resume, format: Format, editable: boolean) => Promise<void>; retry: () => void; downloadAgain: () => void }
const enabled = new URLSearchParams(window.location.search).get('capture') === '1'
const fragment = new URLSearchParams(window.location.hash.slice(1))
const launchCode = fragment.get('resumeBankCode') || ''
if (enabled && launchCode) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
const api = (import.meta.env.VITE_RESUME_BANK_API_URL || '').replace(/\/$/, '')
const Context = createContext<CaptureContext | null>(null)
let sessionPromise: Promise<Session> | undefined

async function request(path: string, session?: Session, init: RequestInit = {}) {
  if (!api) throw new Error('Company resume capture is not configured. Reopen the builder from the company page or contact the company.')
  const response = await fetch(`${api}/public/resume-bank/${path}`, { ...init, signal: AbortSignal.timeout(90000), headers: { ...(session && { Authorization: `Bearer ${session.credential}` }), ...init.headers } })
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.error?.message || 'We could not save your resume. Retry to save and download.')
  return payload
}
async function startSession(): Promise<Session> {
  if (!launchCode) throw new Error('Reopen Resume Builder from the company page to restore your session. Your local draft is preserved.')
  return request('session', undefined, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ launchCode }) })
}
const wait = (ms: number) => new Promise(resolve => window.setTimeout(resolve, ms))

export function ResumeBankProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const operations = useRef(new Map<string, Operation>())
  const latest = useRef<Operation | undefined>(undefined)
  const inFlight = useRef(false)
  useEffect(() => {
    if (!enabled) return
    let disposed = false
    sessionPromise ||= startSession()
    sessionPromise.then(value => { if (!disposed) setSession(value) }, failure => { if (!disposed) setError(failure.message) })
    return () => { disposed = true }
  }, [])

  async function deliver(operation: Operation, current: Session) {
    const file = await request(`exports/${operation.id}/file`, current)
    // The signed URL returns Content-Disposition: attachment. No local PDF is
    // released until the backend has confirmed the durable bank entry.
    const anchor = document.createElement('a')
    anchor.href = file.url
    anchor.rel = 'noopener noreferrer'
    anchor.download = file.fileName
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    setMessage(`Saved to ${current.companyName}’s Resume Bank. Download started. If it did not start, choose Download again.`)
  }
  async function run(operation: Operation) {
    if (inFlight.current) return
    inFlight.current = true
    setBusy(true)
    setError('')
    latest.current = operation
    try {
      const current = session || await (sessionPromise ||= startSession())
      if (!operation.ready) {
        const { personal } = operation.resume
        if (!personal.fullName.trim() || (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email) && personal.phone.replace(/\D/g, '').length < 7)) throw new Error('Enter your name and a valid email address or phone number in Personal information, then download again.')
        setMessage('Preparing resume…')
        if (operation.format === 'ats' && !operation.pdf) {
          const [{ jsPDF }, { renderAtsPdf }] = await Promise.all([import('jspdf'), import('../utils/renderAtsPdf')])
          const document = renderAtsPdf(new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true }), operation.resume)
          operation.pdf = preparePdfBytes(new Uint8Array(document.output('arraybuffer')), operation.includesEditableData ? operation.resume : undefined)
        }
        const body = new FormData()
        body.append('payload', JSON.stringify({ resume: operation.resume, format: operation.format, includesEditableData: operation.includesEditableData }))
        if (operation.pdf) body.append('file', new Blob([new Uint8Array(operation.pdf)], { type: 'application/pdf' }), 'resume-ATS.pdf')
        setMessage(`Saving to ${current.companyName}…`)
        let result = await request('exports', current, { method: 'POST', headers: { 'Idempotency-Key': operation.id }, body })
        for (let attempt = 0; result.status === 'pending' && attempt < 40; attempt += 1) {
          await wait(1500)
          result = await request(`exports/${operation.id}`, current)
        }
        if (result.status !== 'ready') throw new Error('Your resume has not finished saving. Retry to check or complete this same export.')
        operation.ready = true
      }
      await deliver(operation, current)
    } catch (failure) {
      setMessage(operation.ready ? 'Saved to Resume Bank. Choose Download again to retrieve your saved copy.' : '')
      setError(failure instanceof Error ? failure.message : 'We could not save your resume. Retry to save and download.')
    } finally { inFlight.current = false; setBusy(false) }
  }
  async function exportResume(resume: Resume, format: Format, includesEditableData: boolean) {
    const key = JSON.stringify({ resume, format, includesEditableData })
    let operation = operations.current.get(key)
    if (!operation) {
      operation = { id: crypto.randomUUID(), resume: structuredClone(resume), format, includesEditableData }
      operations.current.set(key, operation)
    }
    await run(operation)
  }
  return <Context.Provider value={{ enabled, busy, ready: !!session, companyName: session?.companyName || '', error, message, exportResume, retry: () => { if (latest.current) void run(latest.current) }, downloadAgain: () => { if (latest.current?.ready) void run(latest.current) } }}>{children}</Context.Provider>
}
export function useResumeBank() { const value = useContext(Context); if (!value) throw new Error('ResumeBankProvider is required'); return value }

export function ResumeBankNotice() {
  const bank = useResumeBank()
  if (!bank.enabled) return null
  return <section aria-label="Company resume storage" className="shrink-0 border-b border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
    <p>{bank.companyName ? `Downloading saves a copy of your resume to ${bank.companyName}’s Resume Bank for recruitment.` : 'Connecting to the company Resume Bank…'}</p>
    <p>Draft edits stay in this browser. Downloading does not submit a job application.</p>
    {bank.message && <p role="status" className="mt-1 font-medium">{bank.message}</p>}
    {bank.error && <p role="alert" className="mt-1 text-red-800">{bank.error}</p>}
    {bank.error && bank.ready && <button type="button" disabled={bank.busy} onClick={bank.retry} className="mt-2 rounded border border-teal-800 px-3 py-1 font-semibold">Retry save and download</button>}
    {bank.message.startsWith('Saved to') && <button type="button" disabled={bank.busy} onClick={bank.downloadAgain} className="ml-2 mt-2 rounded border border-teal-800 px-3 py-1 font-semibold">Download again</button>}
  </section>
}
