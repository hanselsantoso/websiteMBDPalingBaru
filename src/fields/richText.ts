import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
  TextStateFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'
import { ARTICLE_EDITOR_TEXT_STATE } from '@/lib/article-text-state'

export const CalloutBlock: Block = {
  slug: 'callout',
  interfaceName: 'CalloutBlock',
  labels: { singular: 'Callout', plural: 'Callout' },
  fields: [
    {
      name: 'tone',
      label: 'Nada',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Tips', value: 'tip' },
        { label: 'Penting', value: 'warning' },
      ],
    },
    { name: 'title', label: 'Judul', type: 'text' },
    { name: 'body', label: 'Isi', type: 'textarea', required: true },
  ],
}

export const VideoEmbedBlock: Block = {
  slug: 'videoEmbed',
  interfaceName: 'VideoEmbedBlock',
  labels: { singular: 'Video', plural: 'Video' },
  fields: [
    { name: 'url', label: 'URL YouTube atau Vimeo', type: 'text', required: true },
    { name: 'caption', label: 'Keterangan', type: 'text' },
  ],
}

export const CodeBlock: Block = {
  slug: 'codeBlock',
  interfaceName: 'CodeBlock',
  labels: { singular: 'Blok kode', plural: 'Blok kode' },
  fields: [
    { name: 'language', label: 'Bahasa', type: 'text', defaultValue: 'text' },
    { name: 'code', label: 'Kode', type: 'code', required: true },
  ],
}

/** Full editor for blog articles: headings, lists, quotes, links, images, tables, video, code, callouts. */
export const articleEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((feature) => !['heading', 'upload', 'relationship'].includes(feature.key)),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    UploadFeature({ enabledCollections: ['media'] }),
    TextStateFeature({ state: ARTICLE_EDITOR_TEXT_STATE }),
    BlocksFeature({ blocks: [CalloutBlock, VideoEmbedBlock, CodeBlock] }),
    FixedToolbarFeature(),
  ],
})

/** Compact editor for page sections and legal pages. */
export const sectionEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((feature) => !['heading', 'upload', 'relationship'].includes(feature.key)),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
    FixedToolbarFeature(),
  ],
})
