import type { ReactNode } from 'react'
import { getLinkLabel, normalizeUrl } from '../../utils/linkUtils'

interface ContactLinkProps {
  href: string
  label?: string
  fallbackLabel: string
  icon: ReactNode
}

export function ContactLink({ href, label, fallbackLabel, icon }: ContactLinkProps) {
  if (!href.trim()) return null

  const normalizedHref = normalizeUrl(href)
  const displayLabel = label?.trim() || getLinkLabel(href, fallbackLabel)

  return (
    <li className="resume-contact-item">
      <div className="resume-contact-row">
        <span className="resume-contact-icon" aria-hidden="true">
          {icon}
        </span>
        <a
          className="resume-link resume-contact-text"
          href={normalizedHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {displayLabel}
        </a>
      </div>
    </li>
  )
}
