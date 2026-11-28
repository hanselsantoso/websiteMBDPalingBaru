import { uiCopy } from '@/lib/i18n-copy'
import { getContentTranslator, translateContent } from '@/lib/content-translations'
import { withLocale, type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'
import { LocaleLink as Link } from '@/components/providers/LocaleProvider'
import { permanentRedirect } from 'next/navigation'
import { CourseDetailBody } from '@/components/curriculum/CourseDetail'
import { siteFlags } from '@/components/pages/CmsPage'
import { DetailCta } from '@/components/pages/DetailCta'
import { StarField, Wave } from '@/components/patterns/Patterns'
import { JsonLd } from '@/components/seo/JsonLd'
import { Icon } from '@/components/ui/Icon'
import { PendingChip } from '@/components/ui/Isi'
import { getCourse, getCourseSlugs, getCurriculum, getSiteSettings, isDraftMode } from '@/lib/data'
import { displayCourseCode } from '@/lib/domain/curriculum'
import { isPlaceholder } from '@/lib/domain/placeholders'
import { notFoundOrRedirect } from '@/lib/routing'
import { breadcrumbLd, docMetadata } from '@/lib/seo'

type Props = { params: Promise<{ kode: string }> }
type Doc = Record<string, any>

const TYPE_LABEL: Record<string, string> = { wajib: 'Wajib', pilihan: 'Pilihan', umum: 'Umum' }

export async function pageStaticParams() {
  const slugs = await getCourseSlugs()
  return slugs.map((kode) => ({ kode }))
}

async function loadCourse(kode: string) {
  return getCourse(kode, await isDraftMode())
}

function summary(course: Doc): string {
  const short = [course.shortDescription, course.description].find(
    (text) => typeof text === 'string' && text.trim() && !isPlaceholder(text),
  )
  return (
    short ??
    `${course.name}: mata kuliah semester ${course.semester} (${course.credits} SKS) di S1 Manajemen Bisnis Digital ISTTS.`
  )
}

export async function pageMetadata(params: Props['params'], locale: Locale): Promise<Metadata> {
  const copy = (text: string) => uiCopy(locale, text)
  const { kode } = await params
  const [rawcourse, rawSettings, t] = await Promise.all([loadCourse(kode), getSiteSettings(), getContentTranslator(locale)])
  const course = translateContent(rawcourse, t)
  const settings = translateContent(rawSettings, t)
  if (!course) return { title: copy("Halaman tidak ditemukan") }
  return docMetadata({
    locale,
    doc: course,
    path: `/kurikulum/${course.slug}`,
    fallbackTitle: course.code ? `${course.name} (${course.code})` : course.name,
    fallbackDescription: summary(course),
    fallbackImage: settings.defaultOgImage,
  })
}

export default async function CoursePage({ params, locale }: Props & { locale: Locale }) {
  const copy = (text: string) => uiCopy(locale, text)
  const { kode } = await params
  if (kode !== kode.toLowerCase()) permanentRedirect(withLocale(`/kurikulum/${kode.toLowerCase()}`, locale))
  const [rawDoc, rawSettings, rawOther, t] = await Promise.all([
    loadCourse(kode),
    getSiteSettings(),
    getCurriculum(),
    getContentTranslator(locale),
  ])
  const course = translateContent(rawDoc, t)
  const settings = translateContent(rawSettings, t)
  const curriculum = translateContent(rawOther, t)
  if (!course) return notFoundOrRedirect(`/kurikulum/${kode}`, locale)

  const { showPlaceholders } = siteFlags(settings)
  const ordered = curriculum.courses
  const position = ordered.findIndex((item) => item.slug === course.slug)
  const previous = position > 0 ? ordered[position - 1] : null
  const next = position >= 0 && position < ordered.length - 1 ? ordered[position + 1] : null
  const tags = ((course.tags as string[] | null) ?? []).filter(Boolean)
  const path = `/kurikulum/${course.slug}`
  const meta = (course.meta ?? {}) as Doc

  return (
    <article>
      {meta.jsonLd !== false ? (
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'Course',
              name: course.name,
              description: summary(course),
              ...(course.code ? { courseCode: course.code } : {}),
              numberOfCredits: course.credits,
              inLanguage: 'id',
              provider: {
                '@type': 'CollegeOrUniversity',
                name: `${settings.programName ?? 'S1 Manajemen Bisnis Digital'} · ${settings.institutionName ?? 'ISTTS'}`,
              },
            },
            breadcrumbLd([
              { name: t('Beranda'), path: withLocale('/', locale) },
              { name: t('Kurikulum'), path: withLocale('/kurikulum', locale) },
              { name: course.name, path: withLocale(path, locale) },
            ]),
          ]}
        />
      ) : null}

      <header
        data-tone="dark"
        className="relative isolate overflow-hidden bg-navy pt-12 pb-28 text-white lg:pt-16 lg:pb-32"
      >
        <StarField tone="lime" count={4} />
        <div className="container-arus relative">
          <nav aria-label="Breadcrumb">
            <ol className="label-mono flex flex-wrap items-center gap-2 text-white/70">
              <li>
                <Link href="/" className="hover:text-lime">{copy("Beranda")}</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/kurikulum" className="hover:text-lime">{copy("Kurikulum")}</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-lime">
                {course.code ? displayCourseCode(course.code) : course.name}
              </li>
            </ol>
          </nav>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="label-mono rounded-full border-2 border-lime px-3 py-1 text-lime">
              {course.code ? (
                displayCourseCode(course.code)
              ) : showPlaceholders ? (
                <PendingChip hint={copy("kode")} />
              ) : (
                copy('Kode menyusul')
              )}
            </span>
            <span className="label-mono rounded-full bg-white/10 px-3 py-1">
              Semester {course.semester}
            </span>
            <span className="label-mono rounded-full bg-white/10 px-3 py-1">
              {course.credits}{" " + copy("SKS")}</span>
            {course.type ? (
              <span className="label-mono rounded-full bg-white/10 px-3 py-1">
                {copy(TYPE_LABEL[course.type] ?? course.type)}
              </span>
            ) : null}
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,1.6rem+4vw,5rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
            {course.name}
          </h1>
          {course.nameSource && course.nameSource !== course.name ? (
            <p className="mt-3 text-lg text-white/70">{course.nameSource}</p>
          ) : null}
          {tags.length ? (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label={copy("Tag mata kuliah")}>
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="label-mono rounded-full border-2 border-white/30 px-3 py-1 text-white/90"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <Wave className="absolute inset-x-0 bottom-0 h-16 text-white" />
      </header>

      <div className="container-arus grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-8">
          <CourseDetailBody locale={locale} course={course} showPlaceholders={showPlaceholders} />
        </div>
        <aside className="lg:col-span-4">
          <div className="sticker grid gap-5 p-6 lg:sticky lg:top-28">
            <h2 className="text-xl font-bold">{copy("Ringkasan")}</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="label-mono text-ink-600">Semester</dt>
                <dd className="mt-1 font-display text-3xl font-extrabold">{course.semester}</dd>
              </div>
              <div>
                <dt className="label-mono text-ink-600">{copy("Beban")}</dt>
                <dd className="mt-1 font-display text-3xl font-extrabold">{course.credits}{" " + copy("SKS")}</dd>
              </div>
            </dl>
            {showPlaceholders && typeof course.syllabusCompleteness === 'number' ? (
              <div className="grid gap-1.5">
                <p className="flex justify-between text-sm font-semibold">
                  <span>{copy("Kelengkapan silabus")}</span>
                  <span className="font-mono">{course.syllabusCompleteness}%</span>
                </p>
                <span className="block h-2.5 overflow-hidden rounded-full bg-ink-100">
                  <span
                    className="block h-full origin-left rounded-full bg-blue"
                    style={{
                      transform: `scaleX(${Math.min(100, course.syllabusCompleteness) / 100})`,
                    }}
                  />
                </span>
              </div>
            ) : null}
            <Link
              href="/kurikulum"
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-blue hover:underline"
            >
              <Icon name="arrow-left" size={16} strokeWidth={2.5} />{" " + copy("Semua mata kuliah")}</Link>
          </div>
        </aside>
      </div>

      {previous || next ? (
        <nav
          aria-label={copy("Mata kuliah lain")}
          className="container-arus grid gap-4 pb-16 sm:grid-cols-2"
        >
          {previous ? (
            <Link
              href={`/kurikulum/${previous.slug}`}
              className="sticker sticker-press grid gap-1 p-5 transition-transform duration-200 hover:-translate-y-1"
            >
              <span className="label-mono flex items-center gap-1 text-ink-600">
                <Icon name="arrow-left" size={14} strokeWidth={2.5} />{" " + copy("Sebelumnya · Semester")}{' '}
                {previous.semester}
              </span>
              <span className="text-lg font-bold">{previous.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/kurikulum/${next.slug}`}
              className="sticker sticker-press grid gap-1 p-5 text-right transition-transform duration-200 hover:-translate-y-1"
            >
              <span className="label-mono flex items-center justify-end gap-1 text-ink-600">{copy("Berikutnya · Semester") + " "}{next.semester}{' '}
                <Icon name="arrow-right" size={14} strokeWidth={2.5} />
              </span>
              <span className="text-lg font-bold">{next.name}</span>
            </Link>
          ) : null}
        </nav>
      ) : null}

      <DetailCta
        id="course-detail"
        title={copy("Tertarik belajar ini di MBD ISTTS?")}
        body="Mulai pendaftaranmu, atau ngobrol dulu dengan tim kami lewat WhatsApp."
      />
    </article>
  )
}
