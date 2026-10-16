import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Resume } from '../types/resume'
import { downloadAtsResume, printSavedResume } from '../utils/resumeDownloads'

type Format = 'ats' | 'designed'
type Operation = { id: string; resume: Resume; format: Format; includesEditableData: boolean; ready?: boolean }
type Session = { credential: string; companyName: string; captureVersion: number }
type CaptureContext = { enabled: boolean; busy: boolean; ready: boolean; companyName: string; error: string; message: string; exportResume: (resume: Resume, format: Format, editable: boolean) => Promise<void>; retry: () => void; downloadAgain: () => void }
const enabled = new URLSearchParams(window.location.search).get('capture') === '1'
const launchCode = new URLSearchParams(window.location.hash.slice(1)).get('resumeBankCode') || ''
if (enabled && launchCode) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
const api = (import.meta.env.VITE_RESUME_BANK_API_URL || '').replace(/\/$/, '')
const Context = createContext<CaptureContext | null>(null)
let sessionPromise: Promise<Session> | undefined

async function request(path: string, session?: Session, init: RequestInit = {}) {
  if (!api) throw new Error('Company resume capture is not configured. Reopen the builder from the company page.')
  const response = await fetch(`${api}/public/resume-bank/${path}`, { ...init, signal: AbortSignal.timeout(90000), headers: { ...(session && { Authorization: `Bearer ${session.credential}` }), ...init.headers } })
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.error?.message || 'We could not save your resume. Please retry.')
  return payload
}
async function startSession(): Promise<Session> {
  if (!launchCode) throw new Error('Reopen Resume Builder from the company page to restore your session. Your local draft is preserved.')
  const session = await request('session', undefined, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ launchCode }) })
  if (session.captureVersion !== 2) throw new Error('The company API needs the resume snapshot update. Contact the company and reopen the builder after deployment.')
  return session
}

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
        if (!personal.fullName.trim() || (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email) && personal.phone.replace(/\D/g, '').length < 7)) throw new Error('Enter your name and a valid email address or phone number in Personal information, then export again.')
        setMessage(`Saving to ${current.companyName}…`)
        const result = await request('exports', current, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': operation.id }, body: JSON.stringify({ resume: operation.resume, format: operation.format, includesEditableData: operation.includesEditableData }) })
        if (result.status !== 'ready' || result.storageType !== 'snapshot') throw new Error('The resume snapshot has not finished saving. Please retry.')
        operation.ready = true
      }
      if (operation.format === 'ats') {
        await downloadAtsResume(operation.resume, operation.includesEditableData)
        setMessage(`Saved to ${current.companyName}’s Resume Bank. Download started.`)
      } else {
        await printSavedResume(operation.resume)
        setMessage(`Saved to ${current.companyName}’s Resume Bank. Use Save as PDF in the print dialog.`)
      }
    } catch (failure) {
      setMessage(operation.ready ? 'Saved to Resume Bank. Choose Export again to generate another copy.' : '')
      setError(failure instanceof Error ? failure.message : 'We could not save your resume. Please retry.')
    } finally { inFlight.current = false; setBusy(false) }
  }
  async function exportResume(resume: Resume, format: Format, includesEditableData: boolean) {
    const key = JSON.stringify({ resume, format, includesEditableData })
    let operation = operations.current.get(key)
    if (!operation) { operation = { id: crypto.randomUUID(), resume: structuredClone(resume), format, includesEditableData }; operations.current.set(key, operation) }
    await run(operation)
  }
  return <Context.Provider value={{ enabled, busy, ready: !!session, companyName: session?.companyName || '', error, message, exportResume, retry: () => { if (latest.current) void run(latest.current) }, downloadAgain: () => { if (latest.current?.ready) void run(latest.current) } }}>{children}</Context.Provider>
}
export function useResumeBank() { const value = useContext(Context); if (!value) throw new Error('ResumeBankProvider is required'); return value }
export function ResumeBankNotice() {
  const bank = useResumeBank()
  if (!bank.enabled) return null
  return <section aria-label="Company resume storage" className="shrink-0 border-b border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
    <p>{bank.companyName ? `Exporting saves your resume details to ${bank.companyName}’s Resume Bank for recruitment.` : 'Connecting to the company Resume Bank…'}</p>
    <p>Draft edits stay in this browser. Exporting does not submit a job application. The editable-data choice applies only to the downloaded PDF.</p>
    {bank.message && <p role="status" className="mt-1 font-medium">{bank.message}</p>}
    {bank.error && <p role="alert" className="mt-1 text-red-800">{bank.error}</p>}
    {bank.error && bank.ready && <button type="button" disabled={bank.busy} onClick={bank.retry} className="mt-2 rounded border border-teal-800 px-3 py-1 font-semibold">Retry save and export</button>}
    {bank.message.startsWith('Saved to') && <button type="button" disabled={bank.busy} onClick={bank.downloadAgain} className="ml-2 mt-2 rounded border border-teal-800 px-3 py-1 font-semibold">Export again</button>}
  </section>
}
