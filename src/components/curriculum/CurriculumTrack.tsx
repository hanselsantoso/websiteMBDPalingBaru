'use client'

import { m, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Siasat } from '@/components/mascot/Siasat'
import { useMotionPreference } from '@/components/providers/MotionProvider'
import { StarField, Wave } from '@/components/patterns/Patterns'
import { Icon } from '@/components/ui/Icon'
import { PendingChip } from '@/components/ui/Isi'
import { Eyebrow } from '@/components/ui/Section'
import { CURRICULUM_ART } from '@/lib/brand/artwork'
import { displayCourseCode } from '@/lib/domain/curriculum'
import { isPlaceholder, placeholderHint } from '@/lib/domain/placeholders'
import { cn } from '@/lib/utils'
import type { TrackCourse, TrackSemester } from './types'

function SemesterCard({
  semester,
  courses,
  showPlaceholders,
}: {
  semester: TrackSemester
  courses: TrackCourse[]
  showPlaceholders: boolean
}) {
  const total = courses.reduce((sum, course) => sum + course.credits, 0)
  return (
    <article
      className="relative flex h-full flex-col rounded-[28px] border-2 border-navy bg-white p-6 text-navy shadow-hard-lime"
      aria-labelledby={`sem-${semester.number}-title`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[3.75rem] leading-[0.85] font-bold tracking-[-0.06em] text-navy">
          <span className="sr-only">Semester </span>
          <span aria-hidden="true" className="block text-sm tracking-[0.08em] text-blue">
            SEM
          </span>
          {semester.number}
        </p>
        <span className="label-mono rounded-full bg-navy px-3 py-1.5 text-white">{total} SKS</span>
      </div>
      <h3 id={`sem-${semester.number}-title`} className="mt-4 text-2xl leading-tight font-bold">
        {semester.title}
      </h3>
      {semester.description ? (
        <p className="mt-2 line-clamp-2 text-sm text-ink-600">
          {isPlaceholder(semester.description) ? (
            showPlaceholders ? (
              <PendingChip hint={placeholderHint(semester.description)} />
            ) : null
          ) : (
            semester.description
          )}
        </p>
      ) : null}
      <ul className="mt-5 grid gap-1 border-t-2 border-navy pt-3">
        {courses.map((course) => (
          <li key={course.id}>
            <Link
              href={`/kurikulum/${course.slug}`}
              prefetch={false}
              className="group grid min-h-11 grid-cols-[4.25rem_1fr_auto] items-center gap-2 rounded-lg py-1 hover:bg-ink-50"
            >
              <span className="font-mono text-xs font-medium text-blue">
                {course.code ? (
                  displayCourseCode(course.code)
                ) : showPlaceholders ? (
                  <PendingChip />
                ) : (
                  '—'
                )}
              </span>
              <span className="text-[0.9375rem] leading-snug font-semibold group-hover:text-blue">
                {course.name}
              </span>
              <span className="label-mono rounded-md border border-navy px-1.5 py-0.5 text-[0.6875rem]">
                {course.credits}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  )
}

export function CurriculumTrack({
  semesters,
  courses,
  eyebrow,
  heading,
  intro,
  finalCardTitle,
  finalCardBody,
  showPlaceholders,
  anchorId,
}: {
  semesters: TrackSemester[]
  courses: TrackCourse[]
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  finalCardTitle?: string | null
  finalCardBody?: string | null
  showPlaceholders: boolean
  anchorId?: string
}) {
  const { reduced } = useMotionPreference()
  const sectionRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const [desktop, setDesktop] = useState(false)
  const [distance, setDistance] = useState(0)
  const [lineWidth, setLineWidth] = useState(0)
  const pinned = desktop && !reduced && distance > 0

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px) and (min-height: 720px)')
    const update = () => setDesktop(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      const viewport = viewportRef.current
      if (!track || !viewport) return
      setDistance(Math.max(0, track.scrollWidth - viewport.clientWidth))
      setLineWidth(lineRef.current?.clientWidth ?? 0)
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (trackRef.current) observer.observe(trackRef.current)
    if (viewportRef.current) observer.observe(viewportRef.current)
    return () => observer.disconnect()
  }, [desktop, reduced])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const markerX = useTransform(scrollYProgress, [0, 1], [0, lineWidth])

  const step = useCallback(
    (direction: 1 | -1) => {
      const cardWidth =
        (trackRef.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 320
      if (pinned && sectionRef.current) {
        const perCard = distance / Math.max(1, semesters.length)
        window.scrollBy({ top: direction * perCard, behavior: reduced ? 'auto' : 'smooth' })
      } else {
        viewportRef.current?.scrollBy({
          left: direction * (cardWidth + 20),
          behavior: reduced ? 'auto' : 'smooth',
        })
      }
    },
    [pinned, distance, semesters.length, reduced],
  )

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      step(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      step(-1)
    }
  }

  const bySemester = (number: number) => courses.filter((course) => course.semester === number)

  const header = (
    <div className="container-arus flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <Eyebrow dark>{eyebrow}</Eyebrow> : null}
        {heading ? <h2 className="mt-3 text-section font-bold text-white">{heading}</h2> : null}
        {intro ? <p className="mt-4 text-lead text-white/75">{intro}</p> : null}
      </div>
      {!reduced ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            className="grid size-12 place-items-center rounded-full border-2 border-white/60 text-white hover:border-lime hover:text-lime"
            aria-label="Semester sebelumnya"
          >
            <Icon name="arrow-left" size={20} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="grid size-12 place-items-center rounded-full border-2 border-white/60 text-white hover:border-lime hover:text-lime"
            aria-label="Semester berikutnya"
          >
            <Icon name="arrow-right" size={20} strokeWidth={2.5} />
          </button>
        </div>
      ) : null}
    </div>
  )

  const finalCard = (
    <Link
      href="/kurikulum"
      className="group flex h-full min-h-72 flex-col justify-between rounded-[28px] border-2 border-dashed border-lime p-6 text-white transition-colors duration-200 hover:bg-white/5"
    >
      <div className="relative mb-5 aspect-[3/2] overflow-hidden rounded-2xl bg-ink-50">
        <Image src={CURRICULUM_ART} alt="" fill sizes="(min-width: 1024px) 272px, 70vw" className="object-cover" />
      </div>
      <div>
        <p className="text-2xl leading-tight font-bold">
          {finalCardTitle || 'Lihat kurikulum lengkap'}
        </p>
        {finalCardBody ? <p className="mt-2 text-white/75">{finalCardBody}</p> : null}
        <span className="mt-6 inline-flex items-center gap-2 font-semibold text-lime">
          Buka kurikulum{' '}
          <Icon
            name="arrow-right"
            size={18}
            strokeWidth={2.5}
            className="transition-transform duration-150 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  )

  if (reduced) {
    return (
      <section id={anchorId} data-tone="dark" className="relative bg-navy pt-20 text-white">
        {header}
        <ol className="container-arus mt-10 grid gap-5 pb-24 md:grid-cols-2 lg:grid-cols-4">
          {semesters.map((semester) => (
            <li key={semester.number}>
              <SemesterCard
                semester={semester}
                courses={bySemester(semester.number)}
                showPlaceholders={showPlaceholders}
              />
            </li>
          ))}
          <li>{finalCard}</li>
        </ol>
        <div className="relative h-[clamp(56px,8vw,112px)]">
          <Wave preset="toWhite" />
        </div>
      </section>
    )
  }

  return (
    <section id={anchorId} data-tone="dark" className="relative bg-navy text-white">
      <div ref={sectionRef} style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}>
        <div
          className={cn(
            'relative',
            pinned
              ? 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-[var(--header-h)]'
              : 'pt-20 pb-8',
          )}
        >
          <StarField tone="lime" count={4} className="opacity-60" />
          {header}
          <div
            ref={viewportRef}
            role="region"
            aria-label="Jalur kurikulum 8 semester. Gunakan tombol panah kiri dan kanan untuk berpindah semester."
            tabIndex={0}
            onKeyDown={onKeyDown}
            className={cn(
              'relative mt-8 focus-visible:outline-offset-[-4px]',
              pinned
                ? 'overflow-visible'
                : 'snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-6 [scrollbar-width:thin]',
            )}
          >
            <m.ol
              ref={trackRef}
              style={pinned ? { x } : undefined}
              className="flex w-max gap-5 px-4 sm:px-6 lg:px-10"
            >
              {semesters.map((semester) => (
                <li
                  key={semester.number}
                  className="w-[min(82vw,21.5rem)] shrink-0 snap-start scroll-ml-4"
                >
                  <SemesterCard
                    semester={semester}
                    courses={bySemester(semester.number)}
                    showPlaceholders={showPlaceholders}
                  />
                </li>
              ))}
              <li className="w-[min(70vw,17rem)] shrink-0 snap-start">{finalCard}</li>
            </m.ol>
          </div>
          {pinned ? (
            <div className="container-arus mt-10">
              <div
                ref={lineRef}
                className="relative h-1 rounded-full bg-white/15"
                aria-hidden="true"
              >
                <m.div
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-lime"
                  style={{ scaleX: scrollYProgress }}
                />
                <m.div
                  className="absolute -top-9 left-0 w-12 -translate-x-1/2"
                  style={{ x: markerX }}
                >
                  <Siasat pose="pointing" decorative loop={false} onDark size="xs" className="max-w-full" />
                </m.div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="relative h-[clamp(56px,8vw,112px)]">
        <Wave preset="toWhite" />
      </div>
    </section>
  )
}
