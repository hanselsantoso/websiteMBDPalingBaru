import type { Locale } from '@/lib/i18n'

export type BlockCtx = {
  showPlaceholders: boolean
  showTotalSks: boolean
  pageSlug: string
  locale: Locale
  translate: (text: string) => string
  index: number
  isFirst: boolean
  isLast: boolean
}

export type AnyBlock = Record<string, any> & { blockType: string; id?: string; visible?: boolean | null; anchorId?: string | null }

export type BlockProps<T = AnyBlock> = { block: T; ctx: BlockCtx }

export const anchor = (block: AnyBlock) => (block.anchorId ? String(block.anchorId).replace(/^#/, '') : undefined)
