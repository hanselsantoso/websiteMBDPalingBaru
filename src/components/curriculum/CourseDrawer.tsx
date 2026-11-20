'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { displayCourseCode } from '@/lib/domain/curriculum'
import { CourseDetailBody } from './CourseDetail'

type Doc = Record<string, any>

/** Side drawer with the full syllabus, loaded on demand from /api/v1/courses/:slug. */
export function CourseDrawer({
  slug,
  onClose,
  showPlaceholders,
}: {
  slug: string | null
  onClose: () => void
  showPlaceholders: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const [state, setState] = useState<{
    status: 'idle' | 'loading' | 'ready' | 'error'
    course?: Doc
  }>({ status: 'idle' })

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (slug && !dialog.open) dialog.showModal()
    if (!slug && dialog.open) dialog.close()
  }, [slug])

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setState({ status: 'loading' })
    fetch(`/api/v1/courses/${encodeURIComponent(slug)}`)
      .then((response) => response.json())
      .then((json: { data?: Doc }) => {
        if (!cancelled)
          setState(json.data ? { status: 'ready', course: json.data } : { status: 'error' })
      })
      .catch(() => !cancelled && setState({ status: 'error' }))
    return () => {
      cancelled = true
    }
  }, [slug])

  const course = state.course

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) ref.current?.close()
      }}
      aria-labelledby="drawer-title"
      className="m-0 ml-auto h-dvh max-h-none w-[min(100%,42rem)] max-w-none overflow-y-auto overscroll-contain border-l-2 border-navy bg-white p-0 text-navy"
    >
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b-2 border-navy bg-white p-6">
        <div>
          {course ? (
            <>
              <p className="label-mono text-blue">
                {displayCourseCode(course.code)} · Semester {course.semester} · {course.credits} SKS
              </p>
              <h2 id="drawer-title" className="mt-2 text-title font-bold">
                {course.name}
              </h2>
              {course.nameSource && course.nameSource !== course.name ? (
                <p className="mt-1 text-sm text-ink-600">{course.nameSource}</p>
              ) : null}
            </>
          ) : (
            <h2 id="drawer-title" className="text-title font-bold">
              {state.status === 'error' ? 'Silabus belum bisa dimuat' : 'Memuat silabus…'}
            </h2>
          )}
        </div>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-navy hover:bg-ink-50"
          aria-label="Tutup silabus"
        >
          <Icon name="close" size={18} strokeWidth={2.5} />
        </button>
      </div>
      <div className="p-6" aria-live="polite" aria-busy={state.status === 'loading'}>
        {state.status === 'loading' ? (
          <div className="grid gap-4" aria-hidden="true">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="h-16 rounded-2xl bg-ink-100" />
            ))}
          </div>
        ) : null}
        {state.status === 'error' ? (
          <p className="text-ink-600">
            Periksa koneksi lalu coba lagi, atau buka{' '}
            <Link href={`/kurikulum/${slug}`} className="font-semibold text-blue underline">
              halaman mata kuliah
            </Link>
            .
          </p>
        ) : null}
        {course ? (
          <>
            <CourseDetailBody course={course} showPlaceholders={showPlaceholders} />
            <Link
              href={`/kurikulum/${course.slug}`}
              className="pill mt-10 border-2 border-navy bg-blue text-white shadow-hard"
            >
              Buka halaman lengkap
              <Icon name="arrow-right" size={18} strokeWidth={2.5} />
            </Link>
          </>
        ) : null}
      </div>
    </dialog>
  )
}
