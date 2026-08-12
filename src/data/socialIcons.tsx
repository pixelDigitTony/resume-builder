import { Icon, type IconifyIcon } from '@iconify/react'
import behance from '@iconify-icons/simple-icons/behance'
import bitbucket from '@iconify-icons/simple-icons/bitbucket'
import codepen from '@iconify-icons/simple-icons/codepen'
import devdotto from '@iconify-icons/simple-icons/devdotto'
import dribbble from '@iconify-icons/simple-icons/dribbble'
import facebook from '@iconify-icons/simple-icons/facebook'
import github from '@iconify-icons/simple-icons/github'
import gitlab from '@iconify-icons/simple-icons/gitlab'
import instagram from '@iconify-icons/simple-icons/instagram'
import linkedin from '@iconify-icons/simple-icons/linkedin'
import mastodon from '@iconify-icons/simple-icons/mastodon'
import medium from '@iconify-icons/simple-icons/medium'
import stackoverflow from '@iconify-icons/simple-icons/stackoverflow'
import substack from '@iconify-icons/simple-icons/substack'
import telegram from '@iconify-icons/simple-icons/telegram'
import threads from '@iconify-icons/simple-icons/threads'
import tiktok from '@iconify-icons/simple-icons/tiktok'
import whatsapp from '@iconify-icons/simple-icons/whatsapp'
import x from '@iconify-icons/simple-icons/x'
import youtube from '@iconify-icons/simple-icons/youtube'
import { GlobeIcon } from '../components/preview/SidebarIcons'

export const SOCIAL_ICON_OPTIONS = [
  { value: 'globe', label: 'Website / other' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'threads', label: 'Threads' },
  { value: 'mastodon', label: 'Mastodon' },
  { value: 'medium', label: 'Medium' },
  { value: 'devdotto', label: 'DEV Community' },
  { value: 'behance', label: 'Behance' },
  { value: 'dribbble', label: 'Dribbble' },
  { value: 'stackoverflow', label: 'Stack Overflow' },
  { value: 'gitlab', label: 'GitLab' },
  { value: 'bitbucket', label: 'Bitbucket' },
  { value: 'codepen', label: 'CodePen' },
  { value: 'substack', label: 'Substack' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
] as const

const ICONS: Record<string, IconifyIcon> = {
  behance,
  bitbucket,
  codepen,
  devdotto,
  dribbble,
  facebook,
  github,
  gitlab,
  instagram,
  linkedin,
  mastodon,
  medium,
  stackoverflow,
  substack,
  telegram,
  threads,
  tiktok,
  whatsapp,
  x,
  youtube,
}

export function SocialIcon({ name, className }: { name?: string; className?: string }) {
  const icon = name ? ICONS[name] : undefined
  if (!icon) return <GlobeIcon className={className} />

  return <Icon icon={icon} className={className} aria-hidden="true" />
}
