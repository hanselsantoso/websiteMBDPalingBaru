import { RichText as LexicalRichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import Image from '@/components/ui/CmsImage'
import { PendingChip } from '@/components/ui/Isi'
import { VideoEmbed } from '@/components/motion/Interactive'
import { placeholderHint } from '@/lib/domain/placeholders'
import { articleTextStyle } from '@/lib/article-text-state'
import { headingId, nodeText } from '@/lib/lexical'
import { cn } from '@/lib/utils'

type AnyNode = Record<string, any>

function makeConverters(showPlaceholders: boolean): JSXConvertersFunction {
  return ({ defaultConverters }) => ({
    ...defaultConverters,
    text: (args: AnyNode) => {
      const renderDefault = (defaultConverters as AnyNode).text
      const text = typeof renderDefault === 'function' ? renderDefault(args) : args.node.text
      const style = articleTextStyle(args.node.$)
      return Object.keys(style).length ? <span style={style}>{text}</span> : text
    },
    paragraph: (args: AnyNode) => {
      const text = nodeText(args.node).trim()
      if (/^\[ISI[^\]]*\]$/.test(text)) {
        return showPlaceholders ? (
          <p>
            <PendingChip hint={placeholderHint(text)} />
          </p>
        ) : null
      }
      const fallback = (defaultConverters as AnyNode).paragraph
      return typeof fallback === 'function' ? fallback(args) : <p>{args.nodesToJSX({ nodes: args.node.children })}</p>
    },
    heading: ({ node, nodesToJSX }: AnyNode) => {
      const Tag = (node.tag ?? 'h2') as 'h2' | 'h3' | 'h4'
      return (
        <Tag id={headingId(nodeText(node))} className="scroll-mt-28">
          {nodesToJSX({ nodes: node.children })}
        </Tag>
      )
    },
    upload: ({ node }: AnyNode) => {
      const media = node.value
      if (!media || typeof media !== 'object' || !media.url) return null
      if (!String(media.mimeType ?? '').startsWith('image/')) {
        return (
          <p>
            <a href={media.url}>{media.filename ?? 'Unduh berkas'}</a>
          </p>
        )
      }
      return (
        <figure>
          <Image
            src={media.url}
            alt={media.alt ?? ''}
            width={media.width ?? 1200}
            height={media.height ?? 800}
            sizes="(min-width: 768px) 720px, 100vw"
            className="h-auto w-full"
          />
          {media.caption ? <figcaption className="mt-2 text-sm text-ink-600">{media.caption}</figcaption> : null}
        </figure>
      )
    },
    blocks: {
      callout: ({ node }: AnyNode) => {
        const fields = node.fields ?? {}
        const tone = { info: 'border-blue', tip: 'border-navy bg-lime/40', warning: 'border-danger' }[fields.tone as string] ?? 'border-blue'
        return (
          <aside className={cn('rounded-2xl border-2 bg-ink-50 p-5 not-italic', tone)}>
            {fields.title ? <p className="font-display text-lg font-bold">{fields.title}</p> : null}
            <p className="mt-1 whitespace-pre-line">{fields.body}</p>
          </aside>
        )
      },
      videoEmbed: ({ node }: AnyNode) => <VideoEmbed url={node.fields?.url} caption={node.fields?.caption} />,
      codeBlock: ({ node }: AnyNode) => (
        <pre>
          <code data-language={node.fields?.language ?? 'text'}>{node.fields?.code}</code>
        </pre>
      ),
    },
  })
}

export function RichText({
  data,
  showPlaceholders = true,
  className,
}: {
  data: unknown
  showPlaceholders?: boolean
  className?: string
}) {
  if (!data || typeof data !== 'object') return null
  return <LexicalRichText data={data as never} converters={makeConverters(showPlaceholders)} className={cn('prose-arus', className)} disableContainer={false} />
}
