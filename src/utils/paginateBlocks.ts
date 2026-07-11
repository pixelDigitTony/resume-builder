import type { ContentSegment, PageLayout } from '../types/pageLayout'
import { createContinuationPageLayout, createDefaultPageLayout } from '../types/pageLayout'

export interface MeasurableBlock {
  id: string
  type:
    | 'header'
    | 'summary'
    | 'highlights'
    | 'experience-heading'
    | 'experience-item-header'
    | 'experience-item-bullet'
    | 'projects-heading'
    | 'project-item-header'
    | 'project-item-bullet'
  height: number
  itemId?: string
  bulletIndex?: number
}

export function paginateBlocks(
  blocks: MeasurableBlock[],
  pageCapacity: number,
  allJobIds: string[],
  allProjectIds: string[] = [],
): PageLayout[] {
  if (pageCapacity <= 0 || blocks.length === 0) {
    return [createDefaultPageLayout(allJobIds, allProjectIds)]
  }

  const pages: PageLayout[] = []
  let usedHeight = 0
  let current = createDefaultPageLayout([])

  const pushPage = () => {
    if (
      current.showHeader ||
      current.showSummary ||
      current.showHighlights ||
      current.showExperienceHeading ||
      current.experienceSegments.length > 0 ||
      current.showProjectsHeading ||
      current.projectSegments.length > 0
    ) {
      pages.push(current)
    }
  }

  const appendSegment = (
    collection: ContentSegment[],
    itemId: string,
    bulletIndex?: number,
    continued = false,
  ) => {
    let segment = collection[collection.length - 1]
    if (!segment || segment.id !== itemId) {
      segment = { id: itemId, bulletIndexes: [], continued }
      collection.push(segment)
    }
    if (bulletIndex !== undefined && !segment.bulletIndexes?.includes(bulletIndex)) {
      segment.bulletIndexes?.push(bulletIndex)
    }
  }

  const headerHeights = new Map<string, number>()
  blocks.forEach((block) => {
    if (
      (block.type === 'experience-item-header' || block.type === 'project-item-header') &&
      block.itemId
    ) {
      headerHeights.set(`${block.type}:${block.itemId}`, block.height)
    }
  })

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index]
    if (block.height <= 0) continue

    const next = blocks[index + 1]
    const keepWithNext =
      (block.type === 'experience-heading' && next?.type === 'experience-item-header') ||
      (block.type === 'projects-heading' && next?.type === 'project-item-header') ||
      (block.type === 'experience-item-header' && next?.type === 'experience-item-bullet' && next.itemId === block.itemId) ||
      (block.type === 'project-item-header' && next?.type === 'project-item-bullet' && next.itemId === block.itemId)
    const requiredHeight = block.height + (keepWithNext ? next.height : 0)
    const isExperienceBullet = block.type === 'experience-item-bullet'
    const isProjectBullet = block.type === 'project-item-bullet'

    if (
      !isExperienceBullet &&
      !isProjectBullet &&
      usedHeight + requiredHeight > pageCapacity &&
      usedHeight > 0
    ) {
      pushPage()
      current = createContinuationPageLayout([])
      usedHeight = 0
    }

    if ((isExperienceBullet || isProjectBullet) && usedHeight + block.height > pageCapacity && usedHeight > 0 && block.itemId) {
      pushPage()
      current = createContinuationPageLayout([])
      usedHeight = 0
      const headerType = isExperienceBullet ? 'experience-item-header' : 'project-item-header'
      const headerHeight = headerHeights.get(`${headerType}:${block.itemId}`) ?? 0
      const target = isExperienceBullet ? current.experienceSegments : current.projectSegments
      appendSegment(target, block.itemId, undefined, true)
      usedHeight += headerHeight
    }

    switch (block.type) {
      case 'header':
        current.showHeader = true
        break
      case 'summary':
        current.showSummary = true
        break
      case 'highlights':
        current.showHighlights = true
        break
      case 'experience-heading':
        current.showExperienceHeading = true
        break
      case 'experience-item-header':
        if (block.itemId) appendSegment(current.experienceSegments, block.itemId)
        break
      case 'experience-item-bullet':
        if (block.itemId) appendSegment(current.experienceSegments, block.itemId, block.bulletIndex)
        break
      case 'projects-heading':
        current.showProjectsHeading = true
        break
      case 'project-item-header':
        if (block.itemId) appendSegment(current.projectSegments, block.itemId)
        break
      case 'project-item-bullet':
        if (block.itemId) appendSegment(current.projectSegments, block.itemId, block.bulletIndex)
        break
    }

    usedHeight += block.height
  }

  pushPage()
  return pages.length > 0 ? pages : [createDefaultPageLayout(allJobIds, allProjectIds)]
}
