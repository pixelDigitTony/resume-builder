import type { Resume, ResumeTemplate } from '../types/resume'
import { normalizeResume } from './normalizeResume'

export const STORAGE_SCHEMA_VERSION = 2

interface StorageEnvelope<T> {
  schemaVersion: number
  data: T
}

function isStorageEnvelope(value: unknown): value is StorageEnvelope<unknown> {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'schemaVersion' in value &&
      'data' in value &&
      typeof (value as StorageEnvelope<unknown>).schemaVersion === 'number',
  )
}

function migrateResume(value: unknown, fromVersion: number): Resume {
  let migrated = value as Partial<Resume>

  // Version 1 introduced recruiter highlights and selected projects.
  if (fromVersion < 1) {
    migrated = {
      ...migrated,
      highlights: migrated.highlights,
      projects: migrated.projects,
    }
  }

  // Version 2 consolidated photo crop, custom links, and current skill defaults.
  return normalizeResume(migrated)
}

function migrateTemplates(value: unknown, fromVersion: number): ResumeTemplate[] {
  if (!Array.isArray(value)) return []

  return value.map((template) => {
    const candidate = template as Partial<ResumeTemplate>
    return {
      id: candidate.id ?? crypto.randomUUID(),
      name: candidate.name ?? 'Resume variation',
      targetRole: candidate.targetRole ?? '',
      jobPosting: candidate.jobPosting ?? '',
      createdAt: candidate.createdAt ?? new Date().toISOString(),
      updatedAt: candidate.updatedAt ?? new Date().toISOString(),
      resume: migrateResume(candidate.resume, fromVersion),
    }
  })
}

export function readMigratedStorage<T>(key: string, rawValue: unknown, fallback: T): T {
  const envelope = isStorageEnvelope(rawValue) ? rawValue : null
  const version = envelope?.schemaVersion ?? 0
  const data = envelope?.data ?? rawValue

  if (key === 'resume-builder-data') {
    return migrateResume(data, version) as T
  }

  if (key === 'resume-builder-templates') {
    return migrateTemplates(data, version) as T
  }

  return (data ?? fallback) as T
}

export function createStorageEnvelope<T>(data: T): StorageEnvelope<T> {
  return { schemaVersion: STORAGE_SCHEMA_VERSION, data }
}
