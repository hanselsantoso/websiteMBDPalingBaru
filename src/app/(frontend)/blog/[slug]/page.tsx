import type { Metadata } from 'next'
import Link from 'next/link'
import { PostCard, PostCover, PostMeta } from '@/components/cards/Cards'
import { siteFlags } from '@/components/pages/CmsPage'
import { DetailCta } from '@/components/pages/DetailCta'
import { StarField } from '@/components/patterns/Patterns'
import { RichText } from '@/components/richtext/RichText'
import { JsonLd } from '@/components/seo/JsonLd'
import { Icon } from '@/components/ui/Icon'
import {
  getBranding,
  getPost,
  getPostSlugs,
  getRelatedPosts,
  getSiteSettings,
  isDraftMode,
} from '@/lib/data'
import { notFoundOrRedirect } from '@/lib/routing'
import { absoluteUrl, breadcrumbLd, docMetadata } from '@/lib/seo'
import { asMedia, relationId } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> }
type Doc = Record<string, any>

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

async function loadPost(slug: string) {
  return getPost(slug, await isDraftMode())
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [post, settings] = await Promise.all([loadPost(slug), getSiteSettings()])
  if (!post) return { title: 'Halaman tidak ditemukan' }
  return docMetadata({
    doc: post,
    path: `/blog/${post.slug}`,
    fallbackTitle: post.title,
    fallbackDescription: post.excerpt,
    fallbackImage: post.cover ?? settings.defaultOgImage,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  })
}

function shareLinks(url: string, title: string) {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  return [
    { label: 'WhatsApp', icon: 'whatsapp' as const, href: `https://wa.me/?text=${t}%20${u}` },
    {
      label: 'LinkedIn',
      icon: 'external' as const,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    },
    {
      label: 'X',
      icon: 'external' as const,
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    },
  ]
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const [post, settings, branding] = await Promise.all([
    loadPost(slug),
    getSiteSettings(),
    getBranding(),
  ])
  if (!post) return notFoundOrRedirect(`/blog/${slug}`)

  const { showPlaceholders } = siteFlags(settings)
  const path = `/blog/${post.slug}`
  const category =
    post.category && typeof post.category === 'object' ? (post.category as Doc) : null
  const tags = ((post.tags as unknown[] | null) ?? []).filter(
    (tag): tag is Doc => Boolean(tag) && typeof tag === 'object',
  )
  const manualIds = ((post.relatedPosts as unknown[] | null) ?? [])
    .map(relationId)
    .filter((id): id is string => Boolean(id))
  const related = await getRelatedPosts(String(post.id), relationId(post.category), manualIds)
  const cover = asMedia(post.cover)
  const author =
    typeof post.authorName === 'string' && post.authorName.trim()
      ? post.authorName.trim()
      : 'Tim MBD ISTTS'
  const logo = asMedia(branding.symbol) ?? asMedia(branding.wordmarkDark)
  const meta = (post.meta ?? {}) as Doc

  return (
    <article>
      {meta.jsonLd !== false ? (
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              ...(post.excerpt ? { description: post.excerpt } : {}),
              ...(cover?.url ? { image: [absoluteUrl(cover.url)] } : {}),
              ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
              ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
              inLanguage: 'id',
              author: { '@type': post.authorName ? 'Person' : 'Organization', name: author },
              publisher: {
                '@type': 'Organization',
                name: `${settings.programName ?? 'S1 Manajemen Bisnis Digital'} · ${settings.institutionName ?? 'ISTTS'}`,
                ...(logo?.url
                  ? { logo: { '@type': 'ImageObject', url: absoluteUrl(logo.url) } }
                  : {}),
              },
              mainEntityOfPage: absoluteUrl(path),
            },
            breadcrumbLd([
              { name: 'Beranda', path: '/' },
              { name: 'Blog', path: '/blog' },
              { name: String(post.title ?? ''), path },
            ]),
          ]}
        />
      ) : null}

      <header
        data-tone="dark"
        className="relative isolate overflow-hidden bg-navy pt-12 pb-32 text-white lg:pt-16 lg:pb-40"
      >
        <StarField tone="lime" count={4} />
        <div className="container-arus relative max-w-4xl">
          <nav aria-label="Breadcrumb">
            <ol className="label-mono flex flex-wrap items-center gap-2 text-white/70">
              <li>
                <Link href="/" className="hover:text-lime">
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-lime">
                  Blog
                </Link>
              </li>
              {category ? (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={`/blog?kategori=${category.slug}`}
                      className="text-lime hover:underline"
                    >
                      {category.name}
                    </Link>
                  </li>
                </>
              ) : null}
            </ol>
          </nav>
          <h1 className="mt-6 font-display text-[clamp(2.25rem,1.5rem+3.2vw,4rem)] leading-[1.03] font-extrabold tracking-[-0.03em]">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-5 max-w-2xl text-lead text-white/80">{post.excerpt}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-semibold">{author}</span>
            <PostMeta post={post} dark />
          </div>
        </div>
      </header>

      <div className="container-arus relative -mt-24 max-w-5xl lg:-mt-28">
        <PostCover
          post={post}
          sizes="(min-width: 1024px) 1024px, 100vw"
          priority
          className="aspect-[16/9] rounded-[28px] border-2 border-navy shadow-hard-lg"
        />
      </div>

      <div className="container-arus max-w-[46rem] py-14 lg:py-20">
        <RichText data={post.content} showPlaceholders={showPlaceholders} className="prose-arus" />
        {tags.length ? (
          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tag artikel">
            {tags.map((tag) => (
              <li key={tag.id} className="label-mono rounded-full bg-ink-100 px-3 py-1.5">
                #{tag.name}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-10 flex flex-wrap items-center gap-3 border-t-2 border-navy pt-6">
          <span className="font-semibold">Bagikan:</span>
          {shareLinks(absoluteUrl(path), String(post.title ?? '')).map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-navy px-4 font-semibold hover:bg-ink-50"
            >
              <Icon name={link.icon} size={16} /> {link.label}
              <span className="sr-only">(membuka tab baru)</span>
            </a>
          ))}
        </div>
      </div>

      {related.length ? (
        <section aria-labelledby="artikel-terkait" className="bg-ink-50 py-16 lg:py-20">
          <div className="container-arus">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="artikel-terkait" className="text-section font-bold">
                Baca juga
              </h2>
              <Link
                href="/blog"
                className="inline-flex min-h-11 items-center gap-2 font-semibold text-blue hover:underline"
              >
                Semua artikel <Icon name="arrow-right" size={16} strokeWidth={2.5} />
              </Link>
            </div>
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <PostCard post={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <DetailCta
        id="post-detail"
        title="Siap jadi strategis bisnis digital?"
        body="Daftar ke S1 Manajemen Bisnis Digital ISTTS, atau coba kuis jurusan dulu."
      />
    </article>
  )
}
