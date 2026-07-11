import { useEffect, useState } from 'react'
import { createStorageEnvelope, readMigratedStorage } from '../utils/storageMigrations'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue
      return readMigratedStorage(key, JSON.parse(item), initialValue)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(createStorageEnvelope(storedValue)))
    } catch {
      // Ignore quota or serialization errors.
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
}
