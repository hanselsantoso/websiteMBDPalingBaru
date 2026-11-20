'use client'

import { useEffect, useMemo, useState } from 'react'
import { PostCard } from '@/components/cards/Cards'
import { SelectField } from '@/components/forms/fields'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

type Doc = Record<string, any>

export function BlogIndex({
  posts,
  categories,
  pageSize = 9,
}: {
  posts: Doc[]
  categories: { name: string; slug: string }[]
  pageSize?: number
}) {
  const [category, setCategory] = useState('')
  const [tag, setTag] = useState('')
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(pageSize)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setCategory(params.get('kategori') ?? '')
    setTag(params.get('tag') ?? '')
    setQuery(params.get('q') ?? '')
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (category) params.set('kategori', category)
    if (tag) params.set('tag', tag)
    if (query) params.set('q', query)
    const search = params.toString()
    window.history.replaceState(null, '', search ? `?${search}` : window.location.pathname)
    setLimit(pageSize)
  }, [category, tag, query, pageSize])

  const tagOptions = useMemo(() => {
    const map = new Map<string, string>()
    posts.forEach((post) =>
      ((post.tags as Doc[]) ?? []).forEach((item) => item?.slug && map.set(item.slug, item.name)),
    )
    return [...map.entries()].map(([value, label]) => ({ value, label }))
  }, [posts])

  const q = query.trim().toLowerCase()
  const filtering = Boolean(category || tag || q)
  const results = posts.filter(
    (post) =>
      (!category || post.category?.slug === category) &&
      (!tag || ((post.tags as Doc[]) ?? []).some((item) => item?.slug === tag)) &&
      (!q ||
        String(post.title).toLowerCase().includes(q) ||
        String(post.excerpt ?? '')
          .toLowerCase()
          .includes(q)),
  )
  const featured = !filtering ? (results.find((post) => post.featured) ?? results[0]) : null
  const list = results.filter((post) => post !== featured)
  const visible = list.slice(0, limit)

  return (
    <div className="container-arus">
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
        {filtering ? `${results.length} artikel ditemukan.` : ''}
      </p>

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

      {!results.length ? (
        <div className="mt-10 rounded-[28px] border-2 border-dashed border-navy p-10 text-center">
          <p className="text-lg font-semibold">
            {posts.length
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

      {list.length > limit ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((value) => value + pageSize)}
            className="pill border-2 border-navy bg-white text-navy hover:bg-ink-50"
          >
            Muat lebih banyak
          </button>
        </div>
      ) : null}
    </div>
  )
}
