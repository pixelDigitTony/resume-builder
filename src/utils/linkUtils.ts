export function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^(https?|mailto|tel):/i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function normalizeEmail(email: string): string {
  const trimmed = email.trim()
  if (!trimmed) return ''
  return trimmed.startsWith('mailto:') ? trimmed : `mailto:${trimmed}`
}

export function normalizePhone(phone: string): string {
  const trimmed = phone.trim()
  if (!trimmed) return ''
  const digits = trimmed.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : ''
}

export function getLinkLabel(url: string, fallback: string): string {
  if (!url.trim()) return fallback

  try {
    const parsed = new URL(normalizeUrl(url))
    const host = parsed.hostname.replace(/^www\./, '')

    if (host.includes('linkedin.com')) return 'LinkedIn'
    if (host.includes('github.com')) return 'GitHub'

    const path = parsed.pathname === '/' ? '' : parsed.pathname
    return `${host}${path}`.replace(/\/$/, '')
  } catch {
    return fallback
  }
}
