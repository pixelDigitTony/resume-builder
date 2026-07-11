import { useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { A4_HEIGHT_PX } from './usePreviewScale'
import { useResume } from '../context/ResumeContext'
import type { PageLayout } from '../types/pageLayout'
import {
  createContinuationPageLayout,
  createDefaultPageLayout,
  createEmptySidebarLayout,
} from '../types/pageLayout'
import { paginateBlocks, type MeasurableBlock } from '../utils/paginateBlocks'
import {
  paginateSidebarBlocks,
  type MeasurableSidebarBlock,
} from '../utils/paginateSidebarBlocks'

const MAIN_VERTICAL_PADDING = 64
const SIDEBAR_VERTICAL_PADDING = 64

function getBlockHeight(element: Element): number {
  const rect = element.getBoundingClientRect()
  const style = window.getComputedStyle(element)
  const marginTop = Number.parseFloat(style.marginTop) || 0
  const marginBottom = Number.parseFloat(style.marginBottom) || 0
  return Math.ceil(rect.height + marginTop + marginBottom)
}

function serializeLayouts(layouts: PageLayout[]): string {
  return JSON.stringify(layouts)
}

export function useMainContentPagination(
  measureRef: RefObject<HTMLDivElement | null>,
  pageHeightPx = A4_HEIGHT_PX,
) {
  const { resume } = useResume()
  const allJobIds = useMemo(
    () => resume.experience.map((job) => job.id),
    [resume.experience],
  )
  const allProjectIds = useMemo(
    () => resume.projects.map((project) => project.id),
    [resume.projects],
  )
  const allSkillGroupIds = useMemo(
    () => resume.skillGroups.map((group) => group.id),
    [resume.skillGroups],
  )

  const contentKey = useMemo(
    () =>
      [
        resume.summary,
        resume.highlights.join('\n'),
        resume.personal.fullName,
        resume.personal.title,
        resume.personal.phone,
        resume.personal.email,
        resume.personal.location,
        resume.personal.linkedin,
        resume.personal.github,
        resume.personal.portfolio,
        ...(resume.customLinks ?? []).map((link) => `${link.id}|${link.label}|${link.url}`),
        ...resume.skillGroups.map(
          (group) => `${group.id}|${group.label}|${group.skills.join(',')}`,
        ),
        resume.languages.join(','),
        `${resume.education.degree}|${resume.education.institution}|${resume.education.location}|${resume.education.graduationYear}`,
        ...resume.experience.map(
          (job) =>
            `${job.id}|${job.title}|${job.company}|${job.location}|${job.startDate}|${job.endDate}|${job.bullets.join('\n')}`,
        ),
        ...resume.projects.map(
          (project) =>
            `${project.id}|${project.name}|${project.description}|${project.technologies.join(',')}|${project.bullets.join('\n')}`,
        ),
      ].join('::'),
    [resume],
  )

  const [layouts, setLayouts] = useState<PageLayout[]>(() => [
    createDefaultPageLayout(allJobIds, allProjectIds, allSkillGroupIds),
  ])

  const layoutsRef = useRef(serializeLayouts(layouts))

  useLayoutEffect(() => {
    const measureEl = measureRef.current
    if (!measureEl) return

    const mainPageCapacity = pageHeightPx - MAIN_VERTICAL_PADDING
    const sidebarPageCapacity = pageHeightPx - SIDEBAR_VERTICAL_PADDING
    const blockElements = measureEl.querySelectorAll<HTMLElement>('[data-block]')

    const blocks: MeasurableBlock[] = Array.from(blockElements).map((element) => ({
      id: element.dataset.block ?? '',
      type: element.dataset.blockType as MeasurableBlock['type'],
      height: getBlockHeight(element),
      itemId: element.dataset.itemId,
      bulletIndex: element.dataset.bulletIndex
        ? Number.parseInt(element.dataset.bulletIndex, 10)
        : undefined,
    }))

    const sidebarBlockElements =
      measureEl.querySelectorAll<HTMLElement>('[data-sidebar-block]')
    const sidebarBlocks: MeasurableSidebarBlock[] = Array.from(sidebarBlockElements).map(
      (element) => ({
        id: element.dataset.sidebarBlock ?? '',
        type: element.dataset.sidebarBlockType as MeasurableSidebarBlock['type'],
        height: getBlockHeight(element),
        skillGroupId: element.dataset.skillGroupId,
      }),
    )

    const mainLayouts = paginateBlocks(blocks, mainPageCapacity, allJobIds, allProjectIds)
    const sidebarLayouts = paginateSidebarBlocks(sidebarBlocks, sidebarPageCapacity)
    const pageCount = Math.max(mainLayouts.length, sidebarLayouts.length)
    const nextLayouts = Array.from({ length: pageCount }, (_, index) => ({
      ...(mainLayouts[index] ?? createContinuationPageLayout([])),
      sidebar: sidebarLayouts[index] ?? createEmptySidebarLayout(),
    }))
    const nextSerialized = serializeLayouts(nextLayouts)

    if (nextSerialized !== layoutsRef.current) {
      layoutsRef.current = nextSerialized
      setLayouts(nextLayouts)
    }
  }, [allJobIds, allProjectIds, allSkillGroupIds, contentKey, measureRef, pageHeightPx])

  return layouts
}
