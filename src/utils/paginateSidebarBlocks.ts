import type { SidebarLayout } from '../types/pageLayout'
import { createEmptySidebarLayout } from '../types/pageLayout'

export interface MeasurableSidebarBlock {
  id: string
  type: 'photo' | 'contact' | 'skills-heading' | 'skill-group' | 'languages' | 'education'
  height: number
  skillGroupId?: string
}

function hasSidebarContent(layout: SidebarLayout) {
  return (
    layout.showPhoto ||
    layout.showContact ||
    layout.skillGroupIds.length > 0 ||
    layout.showLanguages ||
    layout.showEducation
  )
}

export function paginateSidebarBlocks(
  blocks: MeasurableSidebarBlock[],
  pageCapacity: number,
): SidebarLayout[] {
  if (pageCapacity <= 0 || blocks.length === 0) return [createEmptySidebarLayout()]

  const pages: SidebarLayout[] = []
  const skillsHeadingHeight =
    blocks.find((block) => block.type === 'skills-heading')?.height ?? 0
  let usedHeight = 0
  let current = createEmptySidebarLayout()
  let hasPlacedSkillsHeading = false

  const pushPage = () => {
    if (hasSidebarContent(current)) {
      pages.push(current)
    }
  }

  const ensureRoom = (height: number) => {
    if (usedHeight + height <= pageCapacity || usedHeight === 0) return
    pushPage()
    current = createEmptySidebarLayout()
    usedHeight = 0
  }

  for (const block of blocks) {
    if (block.height <= 0 || block.type === 'skills-heading') continue

    if (block.type === 'skill-group') {
      const shouldPlaceHeading = !hasPlacedSkillsHeading
      const headingHeight = shouldPlaceHeading ? skillsHeadingHeight : 0
      ensureRoom(headingHeight + block.height)

      if (block.skillGroupId) {
        if (shouldPlaceHeading) {
          current.showSkillsHeading = true
          hasPlacedSkillsHeading = true
          usedHeight += skillsHeadingHeight
        }
        current.skillGroupIds.push(block.skillGroupId)
      }
      usedHeight += block.height
      continue
    }

    ensureRoom(block.height)

    switch (block.type) {
      case 'photo':
        current.showPhoto = true
        break
      case 'contact':
        current.showContact = true
        break
      case 'languages':
        current.showLanguages = true
        break
      case 'education':
        current.showEducation = true
        break
      default:
        break
    }

    usedHeight += block.height
  }

  pushPage()
  return pages.length > 0 ? pages : [createEmptySidebarLayout()]
}
