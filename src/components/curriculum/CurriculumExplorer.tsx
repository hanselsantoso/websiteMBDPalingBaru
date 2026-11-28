'use client'

import { CREW_CHARACTERS, CREW_NAME } from '@/lib/brand/crew'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { Fin, Star } from '@/components/patterns/Patterns'
import { useLocale } from '@/components/providers/LocaleProvider'
import { useMotionPreference } from '@/components/providers/MotionProvider'
import { Icon } from '@/components/ui/Icon'
import { PendingChip } from '@/components/ui/Isi'
import { getSiasatArtwork, SIASAT_GROUP_ART } from '@/lib/brand/artwork'
import { COURSE_TAGS, displayCourseCode, programTotals } from '@/lib/domain/curriculum'
import { isPlaceholder, placeholderHint } from '@/lib/domain/placeholders'
import { cn } from '@/lib/utils'
import { CourseDrawer } from './CourseDrawer'
import type { TrackCourse, TrackSemester } from './types'

const ALL = 'Semua'
const EN_TAGS: Record<string, string> = {
  Semua: 'All',
  Bisnis: 'Business',
  Teknologi: 'Technology',
  Kreatif: 'Creative',
  Umum: 'General',
}

const SEMESTER_MASCOTS: Partial<Record<number, { name: string; src: string; wide?: boolean }>> = {
  1: { name: CREW_CHARACTERS.siasat, src: getSiasatArtwork('greeting').url },
  2: { name: CREW_CHARACTERS.kiko, src: '/images/mascot/friends/kiko/curiga.webp' },
  3: { name: CREW_CHARACTERS.piko, src: '/images/mascot/friends/piko/antusias.webp' },
  4: { name: CREW_CHARACTERS.uli, src: '/images/mascot/friends/uli/dapat-ide.webp' },
  5: { name: CREW_CHARACTERS.siasat, src: getSiasatArtwork('tablet').url },
  6: { name: CREW_CHARACTERS.bimo, src: '/images/mascot/friends/bimo/menyapa.webp' },
  7: { name: CREW_CHARACTERS.rara, src: '/images/mascot/friends/rara/fokus.webp' },
  8: { name: CREW_NAME, src: SIASAT_GROUP_ART.src, wide: true },
}

export function CurriculumExplorer({
  semesters,
  courses,
  heading,
  intro,
  showSearch = true,
  showPathMap = true,
  showPlaceholders,
  showTotalSks,
  versionName,
}: {
  semesters: TrackSemester[]
  courses: TrackCourse[]
  heading?: string | null
  intro?: string | null
  showSearch?: boolean
  showPathMap?: boolean
  showPlaceholders: boolean
  showTotalSks: boolean
  versionName?: string | null
}) {
  const en = useLocale() === 'en'
  const tagLabel = (value: string) => en ? EN_TAGS[value] ?? value : value
  const creditUnit = en ? 'credits' : 'SKS'
  const countLabel = (count: number) => `${count} ${en ? (count === 1 ? 'course' : 'courses') : 'mata kuliah'}`
  const { reduced } = useMotionPreference()
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState<string>(ALL)
  const [active, setActive] = useState(1)
  const [drawer, setDrawer] = useState<string | null>(null)

  const normalized = query.trim().toLowerCase()
  const matches = (course: TrackCourse) =>
    (tag === ALL || course.tags.includes(tag)) &&
    (!normalized ||
      course.name.toLowerCase().includes(normalized) ||
      (course.code ?? '').toLowerCase().includes(normalized) ||
      (course.nameSource ?? '').toLowerCase().includes(normalized))

  const filtered = useMemo(() => courses.filter(matches), [courses, tag, normalized]) // eslint-disable-line react-hooks/exhaustive-deps
  const filtering = tag !== ALL || normalized.length > 0
  const totals = programTotals(courses)
  const usedTags = COURSE_TAGS.filter((item) =>
    courses.some((course) => course.tags.includes(item)),
  )

  useEffect(() => {
    const sections = semesters
      .map((semester) => document.getElementById(`semester-${semester.number}`))
      .filter(Boolean) as HTMLElement[]
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(Number(visible[0].target.getAttribute('data-semester')))
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [semesters, filtered.length])

  const jump = (number: number) => {
    document
      .getElementById(`semester-${number}`)
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    setActive(number)
  }

  return (
    <div>
      <div className="container-arus grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          {heading ? <h2 className="text-section font-bold">{heading}</h2> : null}
          {intro ? <p className="mt-3 max-w-2xl text-lead text-ink-600">{intro}</p> : null}
          <p className="label-mono mt-4 text-ink-600">
            {versionName ? `${versionName} · ` : ''}
            {countLabel(totals.count)}{showTotalSks ? ` · ${totals.credits} ${creditUnit}` : ''}
          </p>
        </div>
        {showSearch ? (
          <div className="lg:col-span-5">
            <label htmlFor="cari-matkul" className="font-semibold">
              {en ? 'Search courses' : 'Cari mata kuliah'}
            </label>
            <div className="relative mt-2">
              <Icon
                name="search"
                size={20}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-600"
              />
              <input
                id="cari-matkul"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={en ? "Code or name, e.g. BD401 or data" : "Kode atau nama, mis. BD401 atau data"}
                className="h-12 w-full rounded-full border-2 border-navy bg-white pr-4 pl-12 text-base placeholder:text-ink-500"
              />
            </div>
          </div>
        ) : null}
      </div>

      {showSearch ? (
        <div className="container-arus mt-6">
          <div role="group" aria-label={en ? "Filter by pathway" : "Saring berdasarkan jalur"} className="flex flex-wrap gap-2">
            {[ALL, ...usedTags].map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={tag === item}
                onClick={() => setTag(item)}
                className={cn(
                  'label-mono min-h-10 rounded-full border-2 border-navy px-4 transition-colors duration-150',
                  tag === item ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-ink-100',
                )}
              >
                {tagLabel(item)}
              </button>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {filtering ? (en ? `${countLabel(filtered.length)} found.` : `${countLabel(filtered.length)} ditemukan.`) : ''}
          </p>
        </div>
      ) : null}

      {showPathMap && tag !== ALL ? (
        <div className="container-arus mt-8">
          <div className="overflow-x-auto rounded-[28px] border-2 border-navy bg-navy p-6 text-white">
            <p className="label-mono text-lime">{en ? 'Pathway map' : 'Peta jalur'} · {tagLabel(tag)}</p>
            <ol className="relative mt-6 grid min-w-[44rem] grid-cols-8 gap-3">
              <li
                aria-hidden="true"
                className="absolute top-3 right-[6%] left-[6%] h-0.5 bg-white/25"
              />
              {semesters.map((semester) => {
                const list = courses.filter(
                  (course) => course.semester === semester.number && course.tags.includes(tag),
                )
                return (
                  <li
                    key={semester.number}
                    className="relative grid justify-items-center gap-3 text-center"
                  >
                    <span
                      className={cn(
                        'relative grid size-6 place-items-center rounded-full border-2',
                        list.length ? 'border-lime bg-lime text-navy' : 'border-white/40 bg-navy',
                      )}
                    >
                      {list.length ? <Star className="size-3" /> : null}
                    </span>
                    <span className="label-mono text-white/70">Sem {semester.number}</span>
                    <ul className="grid gap-1.5">
                      {list.map((course) => (
                        <li key={course.id}>
                          <button
                            type="button"
                            onClick={() => setDrawer(course.slug)}
                            className="rounded-lg bg-white/10 px-2 py-1 text-xs leading-snug font-semibold hover:bg-white/20"
                          >
                            {course.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      ) : null}

      <nav
        aria-label={en ? "Semester navigation" : "Navigasi semester"}
        className="sticky top-[var(--header-h)] z-30 mt-10 border-y-2 border-navy bg-white"
      >
        <div className="container-arus">
          <ol className="-mx-1 flex gap-1 overflow-x-auto py-2">
            {semesters.map((semester) => (
              <li key={semester.number} className="shrink-0">
                <a
                  href={`#semester-${semester.number}`}
                  onClick={(event) => {
                    event.preventDefault()
                    jump(semester.number)
                  }}
                  aria-current={active === semester.number ? 'true' : undefined}
                  className={cn(
                    'relative inline-flex min-h-11 items-center rounded-full px-4 font-mono text-sm font-medium transition-colors duration-150',
                    active === semester.number
                      ? 'bg-navy text-white'
                      : 'text-navy hover:bg-ink-100',
                  )}
                >
                  SEM {semester.number}
                  {active === semester.number ? (
                    <Fin className="absolute -bottom-2 left-1/2 size-3.5 -translate-x-1/2 text-blue" />
                  ) : null}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <div className="container-arus grid gap-14 py-12">
        {filtering && filtered.length === 0 ? (
          <div className="rounded-[28px] border-2 border-dashed border-navy p-10 text-center">
            <p className="text-lg font-semibold">{en ? `No courses found for “${query || tagLabel(tag)}”.` : `Tidak ada mata kuliah untuk “${query || tag}”.`}</p>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setTag(ALL)
              }}
              className="pill mt-4 border-2 border-navy bg-white text-navy"
            >
              {en ? 'Clear filters' : 'Hapus filter'}
            </button>
          </div>
        ) : null}
        {semesters.map((semester) => {
          const list = courses.filter((course) => course.semester === semester.number)
          const shown = list.filter(matches)
          if (filtering && !shown.length) return null
          const total = list.reduce((sum, course) => sum + course.credits, 0)
          const enrichment = semester.number === 6
          const mascot = SEMESTER_MASCOTS[semester.number]
          return (
            <section
              key={semester.number}
              id={`semester-${semester.number}`}
              data-semester={semester.number}
              aria-labelledby={`semester-${semester.number}-judul`}
              className="min-w-0 scroll-mt-40"
            >
              <div className="flex items-end gap-3 border-b-2 border-navy pb-4 sm:gap-6">
                <div className="flex min-w-0 flex-1 flex-wrap items-end justify-between gap-x-4 gap-y-2">
                  <div>
                    <p className="font-mono text-sm text-blue">SEM {semester.number}</p>
                    <h3
                      id={`semester-${semester.number}-judul`}
                      className="mt-1 text-title font-bold"
                    >
                      {semester.title}
                    </h3>
                  </div>
                  <p className="label-mono rounded-full bg-navy px-3 py-1.5 text-white">
                    {countLabel(list.length)} · {total} {creditUnit}
                  </p>
                </div>
                {mascot ? (
                  <figure className={cn('shrink-0 text-center', mascot.wide ? 'w-28 sm:w-44' : 'w-20 sm:w-28')}>
                    <div className={cn('relative', mascot.wide ? 'aspect-[3/2]' : 'aspect-square')}>
                      <Image
                        src={mascot.src}
                        alt=""
                        fill
                        sizes={mascot.wide ? '(min-width: 640px) 176px, 112px' : '(min-width: 640px) 112px, 80px'}
                        className="object-contain"
                      />
                    </div>
                    <figcaption className="mt-1 text-xs font-semibold text-ink-700">{mascot.name}</figcaption>
                  </figure>
                ) : null}
              </div>
              {semester.description && !enrichment ? (
                <p className="mt-3 max-w-3xl text-ink-600">{semester.description}</p>
              ) : null}
              {enrichment ? (
                <aside className="mt-4 rounded-[24px] border-2 border-navy bg-lime/40 p-5">
                  <p className="label-mono text-navy">{en ? 'Enrichment program' : 'Program Enrichment'}</p>
                  <p className="mt-2 max-w-3xl">
                    {semester.description && isPlaceholder(semester.description) ? (
                      showPlaceholders ? (
                        <PendingChip hint={en ? undefined : placeholderHint(semester.description)} />
                      ) : (
                        (en ? "Enrichment program details are coming soon." : 'Penjelasan program enrichment segera tersedia.')
                      )
                    ) : (
                      semester.description
                    )}
                  </p>
                </aside>
              ) : null}
              <DataTable
                label={en ? `Semester ${semester.number} courses` : `Mata kuliah semester ${semester.number}`}
                className="mt-4"
                columns={[
                  { label: (en ? "Code" : 'Kode'), className: 'w-24' },
                  { label: (en ? "Course" : 'Mata kuliah') },
                  { label: (en ? "Credits" : 'SKS'), className: 'w-16' },
                  { label: (en ? "Pathway" : 'Jalur') },
                ]}
                rows={shown.map(course => ({
                  id: course.id,
                  values: [course.code ?? '', [course.name, course.nameSource].filter(Boolean).join(' '), course.credits, course.tags.map(tagLabel).join(' ')],
                  cells: [
                    <span className="font-mono text-blue">{course.code ? displayCourseCode(course.code) : showPlaceholders ? <PendingChip hint={en ? "Course code" : "kode"} /> : '—'}</span>,
                    <>
                      <button
                        type="button"
                        onClick={() => setDrawer(course.slug)}
                        className="text-left font-semibold underline decoration-navy/20 underline-offset-4 hover:text-blue hover:decoration-blue"
                      >
                        {course.name}
                      </button>
                      {course.nameSource && course.nameSource !== course.name ? <span className="block text-sm text-ink-600">{course.nameSource}</span> : null}
                    </>,
                    <span className="font-mono tabular-nums">{course.credits}</span>,
                    <span className="flex flex-wrap gap-1">
                      {course.tags.map(item => <span key={item} className="label-mono rounded-full bg-ink-100 px-2 py-0.5 text-[0.6875rem]">{tagLabel(item)}</span>)}
                    </span>,
                  ],
                }))}
              />
            </section>
          )
        })}
        {showTotalSks ? (
          <p className="label-mono text-right text-ink-600">
            {en ? 'Program total' : 'Total program'}: {countLabel(totals.count)} · {totals.credits} {creditUnit}
          </p>
        ) : null}
      </div>
      <CourseDrawer
        slug={drawer}
        onClose={() => setDrawer(null)}
        showPlaceholders={showPlaceholders}
      />
    </div>
  )
}
