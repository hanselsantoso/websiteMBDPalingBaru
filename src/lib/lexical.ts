import { slugify } from './domain/curriculum'

type LexicalNode = {
  type?: string
  text?: string
  tag?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

const rootChildren = (state: unknown): LexicalNode[] => {
  const root = (state as { root?: LexicalNode } | null)?.root
  return Array.isArray(root?.children) ? root.children : []
}

export function nodeText(node: LexicalNode | undefined): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(nodeText).join('')
}

export function lexicalText(state: unknown): string {
  return rootChildren(state).map(nodeText).join('\n').trim()
}

export function readingMinutes(state: unknown, wordsPerMinute = 200): number {
  const words = lexicalText(state).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / wordsPerMinute))
}

export function headingId(text: string): string {
  return slugify(text) || 'bagian'
}

export type TocItem = { id: string; text: string; level: 2 | 3 }

export function extractHeadings(state: unknown): TocItem[] {
  return rootChildren(state)
    .filter((node) => node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3'))
    .map((node) => {
      const text = nodeText(node).trim()
      return { id: headingId(text), text, level: node.tag === 'h2' ? 2 : 3 } as TocItem
    })
    .filter((item) => item.text.length > 0)
}
