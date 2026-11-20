'use client'

import Link from 'next/link'
import { useEffect, useId, useState, useTransition } from 'react'
import { searchAction } from '@/app/(frontend)/actions'
import { Icon } from '@/components/ui/Icon'
import { track } from '@/lib/analytics'
import type { SearchHit } from '@/server/services/search'

const TYPE_LABEL: Record<SearchHit['type'], string> = {
  'mata-kuliah': 'Mata kuliah',
  dosen: 'Dosen',
  artikel: 'Artikel',
}

export function SiteSearch({
  placeholder,
  dark = true,
}: {
  placeholder?: string | null
  dark?: boolean
}) {
  const id = useId()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchHit[] | null>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults(null)
      return
    }
    const timer = setTimeout(
      () => startTransition(async () => setResults(await searchAction(q))),
      300,
    )
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div role="search" className="w-full">
      <label htmlFor={id} className={dark ? 'font-semibold text-white' : 'font-semibold'}>
        Cari di situs
      </label>
      <div className="relative mt-2">
        <Icon
          name="search"
          size={20}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-600"
        />
        <input
          id={id}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder ?? 'Cari mata kuliah, dosen, atau artikel'}
          className="h-14 w-full rounded-full border-2 border-navy bg-white pr-5 pl-12 text-base text-navy placeholder:text-ink-500"
          aria-describedby={`${id}-status`}
        />
      </div>
      <p
        id={`${id}-status`}
        className={dark ? 'mt-2 text-sm text-white/70' : 'mt-2 text-sm text-ink-600'}
        aria-live="polite"
      >
        {pending
          ? 'Mencari…'
          : results
            ? results.length
              ? `${results.length} hasil ditemukan.`
              : `Tidak ada hasil untuk “${query.trim()}”. Coba kata lain.`
            : ''}
      </p>
      {results?.length ? (
        <ul className="mt-3 grid gap-2">
          {results.map((hit) => (
            <li key={hit.href}>
              <Link
                href={hit.href}
                className="flex min-h-14 items-center justify-between gap-4 rounded-2xl border-2 border-navy bg-white px-4 py-3 text-navy hover:bg-ink-50"
              >
                <span>
                  <span className="block font-semibold">{hit.title}</span>
                  <span className="label-mono text-ink-600">{hit.meta}</span>
                </span>
                <span className="label-mono shrink-0 rounded-full bg-ink-100 px-2.5 py-1">
                  {TYPE_LABEL[hit.type]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

/** Reports the missed URL so admins can add a redirect (Log 404). */
export function NotFoundLogger() {
  useEffect(() => {
    track('not_found')
  }, [])
  return null
}
