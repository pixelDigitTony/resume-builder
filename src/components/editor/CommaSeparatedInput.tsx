import { useEffect, useRef, useState } from 'react'
import { TextInput } from './Field'

interface CommaSeparatedInputProps {
  values: string[]
  onCommit: (values: string[]) => void
  placeholder?: string
}

function formatValues(values: string[]) {
  return values.filter(Boolean).join(', ')
}

function normalizeValues(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function CommaSeparatedInput({
  values,
  onCommit,
  placeholder,
}: CommaSeparatedInputProps) {
  const [draft, setDraft] = useState(() => formatValues(values))
  const focusedRef = useRef(false)

  useEffect(() => {
    if (!focusedRef.current) setDraft(formatValues(values))
  }, [values])

  const commit = () => {
    focusedRef.current = false
    const normalized = normalizeValues(draft)
    setDraft(formatValues(normalized))
    onCommit(normalized)
  }

  return (
    <TextInput
      value={draft}
      placeholder={placeholder}
      onFocus={() => {
        focusedRef.current = true
      }}
      onChange={(event) => setDraft(event.target.value.replace(/^\s+/, ''))}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur()
      }}
    />
  )
}
