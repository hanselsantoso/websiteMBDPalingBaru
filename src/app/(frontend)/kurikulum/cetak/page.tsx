import type { Metadata } from 'next'
import { DataTable } from '@/components/ui/DataTable'
import Link from 'next/link'
import { PrintButton } from '@/components/curriculum/PrintButton'
import { toTrackCourses, toTrackSemesters } from '@/components/curriculum/types'
import { siteFlags } from '@/components/pages/CmsPage'
import { buttonStyles } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PendingChip } from '@/components/ui/Isi'
import { getCurriculum, getSiteSettings } from '@/lib/data'
import { displayCourseCode, programTotals } from '@/lib/domain/curriculum'

export const metadata: Metadata = {
  title: 'Ringkasan Kurikulum (Versi Cetak)',
  robots: { index: false, follow: true },
}

export default async function CurriculumPrintPage() {
  const [{ version, courses }, settings] = await Promise.all([getCurriculum(), getSiteSettings()])
  const { showPlaceholders, showTotalSks } = siteFlags(settings)
  const semesters = toTrackSemesters(version)
  const trackCourses = toTrackCourses(courses)
  const totals = programTotals(trackCourses)

  return (
    <article className="bg-white py-12 text-navy lg:py-16">
      <div className="container-arus max-w-5xl">
        <div className="no-print mb-10 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border-2 border-navy bg-ink-50 p-5">
          <Link href="/kurikulum" className={buttonStyles.secondary}>
            <Icon name="arrow-left" size={18} strokeWidth={2.5} /> Kembali ke kurikulum
          </Link>
          <PrintButton />
        </div>

        <header className="border-b-2 border-navy pb-6">
          <p className="label-mono text-blue">
            {settings.programName ?? 'S1 Manajemen Bisnis Digital'} ·{' '}
            {settings.institutionName ?? 'ISTTS'}
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.03em]">
            {version?.name ?? 'Kurikulum 2024'}
          </h1>
          <p className="mt-2 text-ink-600">
            {totals.count} mata kuliah · 8 semester{showTotalSks ? ` · ${totals.credits} SKS` : ''}
          </p>
        </header>

        <div className="mt-8 grid gap-8">
          {semesters.map((semester) => {
            const list = trackCourses.filter((course) => course.semester === semester.number)
            const credits = list.reduce((sum, course) => sum + course.credits, 0)
            return (
              <section key={semester.number} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-navy pb-2">
                  <h2 className="text-xl font-bold">
                    Semester {semester.number}: {semester.title}
                  </h2>
                  <span className="label-mono text-ink-600">
                    {list.length} mata kuliah · {credits} SKS
                  </span>
                </div>
                <DataTable
                  label={`Ringkasan semester ${semester.number}`}
                  columns={[{ label: 'Kode' }, { label: 'Mata kuliah' }, { label: 'Jalur' }, { label: 'SKS' }]}
                  rows={list.map(course => ({
                    id: course.id,
                    values: [course.code ?? '', course.name, course.tags.join(', '), course.credits],
                    cells: [
                      <span key="code" className="font-mono text-blue">{course.code ? displayCourseCode(course.code) : showPlaceholders ? <PendingChip hint="kode" /> : '—'}</span>,
                      course.name,
                      course.tags.join(', '),
                      course.credits,
                    ],
                  }))}
                />
              </section>
            )
          })}
        </div>

        {showTotalSks ? (
          <p className="label-mono mt-8 border-t-2 border-navy pt-4 text-right">
            Total program: {totals.count} mata kuliah · {totals.credits} SKS
          </p>
        ) : null}
      </div>
    </article>
  )
}
