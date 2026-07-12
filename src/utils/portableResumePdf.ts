import type { jsPDF } from 'jspdf'
import { defaultResume } from '../data/defaultResume'
import type { Resume } from '../types/resume'
import { normalizeResume } from './normalizeResume'
import { STORAGE_SCHEMA_VERSION, readMigratedStorage } from './storageMigrations'

const DATA_MARKER = '%RESUME_BUILDER_DATA_V1:'
const END_MARKER = '%END_RESUME_BUILDER_DATA'
const MAX_IMPORT_SIZE = 25 * 1024 * 1024
const MAX_ORIGINAL_PHOTO_SIZE = 750_000

interface PortableResumePayload {
  schemaVersion: number
  resume: Resume
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ''
  const chunkSize = 32_768
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize))
  }
  return btoa(binary)
}

function base64ToBytes(value: string) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

function createPortableResume(resume: Resume): Resume {
  const photoOriginalUrl =
    resume.personal.photoOriginalUrl.length > MAX_ORIGINAL_PHOTO_SIZE
      ? resume.personal.photoUrl
      : resume.personal.photoOriginalUrl

  return normalizeResume({
    ...resume,
    personal: { ...resume.personal, photoOriginalUrl },
  })
}

function createPayload(resume: Resume) {
  const payload: PortableResumePayload = {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    resume: createPortableResume(resume),
  }
  const bytes = new TextEncoder().encode(JSON.stringify(payload))
  return `\n${DATA_MARKER}${bytesToBase64(bytes)}\n${END_MARKER}\n`
}

export function embedResumeData(pdfBytes: Uint8Array, resume: Resume) {
  const resumeBytes = new TextEncoder().encode(createPayload(resume))
  const output = new Uint8Array(pdfBytes.length + resumeBytes.length)
  output.set(pdfBytes)
  output.set(resumeBytes, pdfBytes.length)
  return output
}

export function preparePdfBytes(pdfBytes: Uint8Array, resume?: Resume) {
  return resume ? embedResumeData(pdfBytes, resume) : pdfBytes
}

export function savePdfFile(pdf: jsPDF, fileName: string, resume?: Resume) {
  const pdfBytes = new Uint8Array(pdf.output('arraybuffer'))
  const outputBytes = preparePdfBytes(pdfBytes, resume)
  const blob = new Blob([outputBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}

export function readResumeFromPdfBytes(bytes: Uint8Array): Resume {
  const searchableTail = new TextDecoder('latin1').decode(bytes.subarray(Math.max(0, bytes.length - 6_000_000)))
  const markerIndex = searchableTail.lastIndexOf(DATA_MARKER)
  const endIndex = searchableTail.indexOf(END_MARKER, markerIndex)

  if (markerIndex < 0 || endIndex < 0) {
    throw new Error('No editable resume data was found. Export a new PDF from this version of the app first.')
  }

  const encoded = searchableTail.slice(markerIndex + DATA_MARKER.length, endIndex).trim()
  try {
    const json = new TextDecoder().decode(base64ToBytes(encoded))
    const payload = JSON.parse(json) as Partial<PortableResumePayload>
    if (!payload.resume || typeof payload.schemaVersion !== 'number') throw new Error('Invalid payload')

    return readMigratedStorage(
      'resume-builder-data',
      { schemaVersion: payload.schemaVersion, data: payload.resume },
      defaultResume,
    )
  } catch {
    throw new Error('The embedded resume data is damaged or unsupported.')
  }
}

export async function readResumeFromPdf(file: File): Promise<Resume> {
  if (file.size > MAX_IMPORT_SIZE) {
    throw new Error('This PDF is larger than the 25 MB import limit.')
  }

  return readResumeFromPdfBytes(new Uint8Array(await file.arrayBuffer()))
}
