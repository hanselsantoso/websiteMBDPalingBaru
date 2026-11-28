import { uiCopy } from '@/lib/i18n-copy'
import { getContentTranslator, translateContent } from '@/lib/content-translations'
import { localizedAlternates, type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'
import { DataTable } from '@/components/ui/DataTable'
import { LocaleLink as Link } from '@/components/providers/LocaleProvider'
import { PrintButton } from '@/components/curriculum/PrintButton'
import { toTrackCourses, toTrackSemesters } from '@/components/curriculum/types'
import { siteFlags } from '@/components/pages/CmsPage'
import { buttonStyles } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PendingChip } from '@/components/ui/Isi'
import { getCurriculum, getSiteSettings } from '@/lib/data'
import { displayCourseCode, programTotals } from '@/lib/domain/curriculum'

export function pageMetadata(locale: Locale): Metadata {
  const copy = (text: string) => uiCopy(locale, text)
  return {
  title: copy("Ringkasan Kurikulum (Versi Cetak)"),
  robots: { index: false, follow: true },
  }
}

export default async function CurriculumPrintPage({ locale }: { locale: Locale }) {
  const copy = (text: string) => uiCopy(locale, text)
  const [rawCurriculum, rawSettings, t] = await Promise.all([getCurriculum(), getSiteSettings(), getContentTranslator(locale)])
  const { version, courses } = translateContent(rawCurriculum, t)
  const settings = translateContent(rawSettings, t)
  const { showPlaceholders, showTotalSks } = siteFlags(settings)
  const semesters = toTrackSemesters(version)
  const trackCourses = toTrackCourses(courses)
  const totals = programTotals(trackCourses)

  return (
    <article className="bg-white py-12 text-navy lg:py-16">
      <div className="container-arus max-w-5xl">
        <div className="no-print mb-10 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border-2 border-navy bg-ink-50 p-5">
          <Link href="/kurikulum" className={buttonStyles.secondary}>
            <Icon name="arrow-left" size={18} strokeWidth={2.5} />{" " + copy("Kembali ke kurikulum")}</Link>
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
            {totals.count}{" " + copy("mata kuliah · 8 semester")}{showTotalSks ? ` · ${totals.credits} ${copy('SKS')}` : ''}
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
                    {list.length}{" " + copy("mata kuliah ·") + " "}{credits}{" " + copy("SKS")}</span>
                </div>
                <DataTable
                  label={`${locale === 'en' ? 'Semester overview' : 'Ringkasan semester'} ${semester.number}`}
                  columns={[{ label: copy("Kode") }, { label: copy("Mata kuliah") }, { label: copy("Jalur") }, { label: copy("SKS") }]}
                  rows={list.map(course => ({
                    id: course.id,
                    values: [course.code ?? '', course.name, course.tags.join(', '), course.credits],
                    cells: [
                      <span key="code" className="font-mono text-blue">{course.code ? displayCourseCode(course.code) : showPlaceholders ? <PendingChip hint={copy("kode")} /> : '—'}</span>,
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
            {locale === 'en' ? 'Program total' : 'Total program'}: {totals.count}{" " + copy("mata kuliah ·") + " "}{totals.credits}{" " + copy("SKS")}</p>
        ) : null}
      </div>
    </article>
  )
}
