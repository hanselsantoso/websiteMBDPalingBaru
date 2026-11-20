'use client'

import { useEffect, useRef, useState } from 'react'
import type { BlogPage } from '@/lib/blog-pagination'
import { PostCard } from '@/components/cards/Cards'
import { SelectField } from '@/components/forms/fields'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

export function BlogIndex({
  initialPage,
  categories,
  tags,
  pageSize = 9,
}: {
  initialPage: BlogPage
  categories: { name: string; slug: string }[]
  tags: { name: string; slug: string }[]
  pageSize?: number
}) {
  const [category, setCategory] = useState('')
  const [tag, setTag] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(initialPage)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const requestRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setCategory(params.get('kategori') ?? '')
    setTag(params.get('tag') ?? '')
    setQuery(params.get('q') ?? '')
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    requestRef.current?.abort()
    const params = new URLSearchParams()
    if (category) params.set('kategori', category)
    if (tag) params.set('tag', tag)
    if (query) params.set('q', query)
    const search = params.toString()
    window.history.replaceState(null, '', search ? `?${search}` : window.location.pathname)
    setError('')
    if (!category && !tag && !query) { setPage(initialPage); setLoading(false); return }
    const controller = new AbortController()
    requestRef.current = controller
    setLoading(true)
    params.set('page', '1')
    params.set('limit', String(pageSize))
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/blog/data?${params}`, { signal: controller.signal })
        if (!response.ok) throw new Error('request_failed')
        const result = await response.json() as BlogPage
        if (!controller.signal.aborted) setPage(result)
      } catch {
        if (!controller.signal.aborted) setError('Artikel belum dapat dimuat. Ubah filter atau coba lagi.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 300)
    return () => { clearTimeout(timer); controller.abort() }
  }, [category, tag, query, pageSize, ready, initialPage])

  useEffect(() => () => requestRef.current?.abort(), [])

  const loadMore = async () => {
    if (loading || !page.hasNextPage) return
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    setLoading(true)
    setError('')
    const params = new URLSearchParams({ page: String(page.page + 1), limit: String(pageSize), kategori: category, tag, q: query })
    try {
      const response = await fetch(`/blog/data?${params}`, { signal: controller.signal })
      if (!response.ok) throw new Error('request_failed')
      const next = await response.json() as BlogPage
      if (!controller.signal.aborted) setPage((previous) => ({ ...next, docs: [...previous.docs, ...next.docs.filter((post) => !previous.docs.some((existing) => existing.id === post.id))] }))
    } catch {
      if (!controller.signal.aborted) setError('Artikel berikutnya belum dapat dimuat. Coba lagi.')
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }

  const tagOptions = tags.map((tag) => ({ value: tag.slug, label: tag.name }))
  const filtering = Boolean(category || tag || query.trim())
  const results = page.docs
  const featured = !filtering ? (results.find((post) => post.featured) ?? results[0]) : null
  const list = results.filter((post) => post !== featured)
  const visible = list

  return (
    <div className="container-arus" aria-busy={loading}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div role="group" aria-label="Kategori artikel" className="flex flex-wrap gap-2">
          {[{ name: 'Semua', slug: '' }, ...categories].map((item) => (
            <button
              key={item.slug || 'semua'}
              type="button"
              aria-pressed={category === item.slug}
              onClick={() => setCategory(item.slug)}
              className={cn(
                'label-mono min-h-10 rounded-full border-2 border-navy px-4 transition-colors duration-150',
                category === item.slug
                  ? 'bg-navy text-white'
                  : 'bg-white text-navy hover:bg-ink-100',
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:w-[34rem]">
          <div className="grid gap-1.5">
            <label htmlFor="cari-artikel" className="font-semibold">
              Cari artikel
            </label>
            <div className="relative">
              <Icon
                name="search"
                size={20}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-600"
              />
              <input
                id="cari-artikel"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Judul atau topik"
                className="h-12 w-full rounded-xl border-2 border-navy bg-white pr-4 pl-12 text-base placeholder:text-ink-500"
              />
            </div>
          </div>
          <SelectField
            id="filter-tag"
            label="Tag"
            options={tagOptions}
            placeholder="Semua tag"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
          />
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {loading ? 'Memuat artikel…' : filtering ? `${page.totalDocs} artikel ditemukan.` : ''}
      </p>
      {error ? <p role="alert" className="mt-4 text-danger">{error}</p> : null}

      {featured ? (
        <div className="mt-10">
          <PostCard post={featured} featured priority />
        </div>
      ) : null}

      {visible.length ? (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      ) : null}

      {!loading && !results.length ? (
        <div className="mt-10 rounded-[28px] border-2 border-dashed border-navy p-10 text-center">
          <p className="text-lg font-semibold">
            {initialPage.docs.length
              ? `Belum ada artikel untuk “${query || category || tag}”.`
              : 'Artikel pertama segera terbit.'}
          </p>
          {filtering ? (
            <button
              type="button"
              onClick={() => {
                setCategory('')
                setTag('')
                setQuery('')
              }}
              className="pill mt-4 border-2 border-navy bg-white text-navy"
            >
              Hapus filter
            </button>
          ) : null}
        </div>
      ) : null}

      {page.hasNextPage ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="pill border-2 border-navy bg-white text-navy hover:bg-ink-50"
          >
            {loading ? 'Memuat…' : 'Muat lebih banyak'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
