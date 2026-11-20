import type { ReactNode } from 'react'
import {
  CareerPathsBlock,
  ContactInfoBlock,
  FacultyHighlightBlock,
  JobBoardBlock,
  LatestPostsBlock,
  ProgramsBlock,
  TestimonialsBlock,
} from './CollectionBlocks'
import {
  CardGridBlock,
  FaqBlock,
  ImageTextBlock,
  RichTextBlock,
  TimelineBlock,
  VideoBlock,
} from './ContentBlocks'
import { HeroBlock, PageHeaderBlock } from './HeroBlocks'
import {
  BlogIndexBlock,
  CurriculumExplorerBlock,
  CurriculumTrackBlock,
  FacultyDirectoryBlock,
  FormEmbedBlock,
  NotFoundHeroBlock,
  PmbInfoBlock,
  QuizBlock,
} from './InteractiveBlocks'
import { CtaBandBlock, MarqueeBlock, StatsBlock, WhyMbdBlock } from './SectionBlocks'
import type { AnyBlock, BlockProps } from './types'

type BlockComponent = (props: BlockProps) => ReactNode | Promise<ReactNode>

/** blockType (Payload block slug) → section component. */
const REGISTRY: Record<string, BlockComponent> = {
  hero: HeroBlock,
  pageHeader: PageHeaderBlock,
  stats: StatsBlock,
  whyMbd: WhyMbdBlock,
  curriculumTrack: CurriculumTrackBlock,
  curriculumExplorer: CurriculumExplorerBlock,
  facultyHighlight: FacultyHighlightBlock,
  facultyDirectory: FacultyDirectoryBlock,
  testimonials: TestimonialsBlock,
  latestPosts: LatestPostsBlock,
  blogIndex: BlogIndexBlock,
  ctaBand: CtaBandBlock,
  richText: RichTextBlock,
  imageText: ImageTextBlock,
  faq: FaqBlock,
  timeline: TimelineBlock,
  cardGrid: CardGridBlock,
  video: VideoBlock,
  marquee: MarqueeBlock,
  formEmbed: FormEmbedBlock,
  programs: ProgramsBlock,
  careerPaths: CareerPathsBlock,
  jobBoard: JobBoardBlock,
  pmbInfo: PmbInfoBlock,
  quiz: QuizBlock,
  contactInfo: ContactInfoBlock,
  notFoundHero: NotFoundHeroBlock,
}

export function RenderBlocks({
  blocks,
  pageSlug,
  showPlaceholders,
  showTotalSks,
}: {
  blocks: AnyBlock[] | null | undefined
  pageSlug: string
  showPlaceholders: boolean
  showTotalSks: boolean
}) {
  const visible = (blocks ?? []).filter(
    (block) => block && block.visible !== false && REGISTRY[block.blockType],
  )
  return (
    <>
      {visible.map((block, index) => {
        const Component = REGISTRY[block.blockType]
        return (
          <Component
            key={block.id ?? `${block.blockType}-${index}`}
            block={block}
            ctx={{
              showPlaceholders,
              showTotalSks,
              pageSlug,
              index,
              isFirst: index === 0,
              isLast: index === visible.length - 1,
            }}
          />
        )
      })}
    </>
  )
}
