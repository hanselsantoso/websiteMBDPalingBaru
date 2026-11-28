import { translateContent } from '@/lib/content-translations'
import { uiCopy } from '@/lib/i18n-copy'
import type { Locale } from '@/lib/i18n'
import { LocaleLink as Link } from '@/components/providers/LocaleProvider'
import { DataTable } from '@/components/ui/DataTable'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { BlogIndex } from '@/components/blog/BlogIndex'
import { BrochureButton } from '@/components/cta/CtaLinks'
import { CurriculumExplorer } from '@/components/curriculum/CurriculumExplorer'
import { CurriculumTrack } from '@/components/curriculum/CurriculumTrack'
import { toTrackCourses, toTrackSemesters } from '@/components/curriculum/types'
import { FacultyDirectory, type DirectoryMember } from '@/components/faculty/FacultyDirectory'
import { ConsultationForm, ContactForm } from '@/components/forms/ContactForms'
import { PmbForm, StatusChecker } from '@/components/forms/PmbForms'
import { Siasat } from '@/components/mascot/Siasat'
import { Reveal } from '@/components/motion/Interactive'
import { Star, StarField } from '@/components/patterns/Patterns'
import { QuizApp } from '@/components/quiz/QuizApp'
import { NotFoundLogger, SiteSearch } from '@/components/search/SiteSearch'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PendingChip, TextOr } from '@/components/ui/Isi'
import { Eyebrow, SectionHeading } from '@/components/ui/Section'
import { isSiasatPose, type SiasatPose } from '@/lib/brand/mascot'
import { CURRICULUM_ART } from '@/lib/brand/artwork'
import {
  getCurriculum,
  getFacultyList,
  getPmbInfo,
  getPostCategories,
  getPostsPage,
  getPostTags,
  getQuiz,
} from '@/lib/data'
import { admissionWaveStatus } from '@/lib/domain/admission-wave'
import { isPlaceholder } from '@/lib/domain/placeholders'
import { asMedia, cn, formatDate } from '@/lib/utils'
import { anchor, type BlockProps } from './types'

type Doc = Record<string, any>

function EmptyState({ pose = 'thinking', children }: { pose?: SiasatPose; children: ReactNode }) {
  return (
    <div className="container-arus grid justify-items-center gap-4 py-16 text-center">
      <Siasat pose={pose} size="md" />
      <p className="max-w-md text-lg font-semibold">{children}</p>
    </div>
  )
}

export async function CurriculumTrackBlock({ block, ctx }: BlockProps) {
  const { version, courses } = translateContent(await getCurriculum(), ctx.translate)
  if (!courses.length) return null
  return (
    <CurriculumTrack
      semesters={toTrackSemesters(version)}
      courses={toTrackCourses(courses)}
      eyebrow={block.eyebrow}
      heading={block.heading}
      intro={block.intro}
      finalCardTitle={block.finalCardTitle}
      finalCardBody={block.finalCardBody}
      showPlaceholders={ctx.showPlaceholders}
      anchorId={anchor(block)}
    />
  )
}

export async function CurriculumExplorerBlock({ block, ctx }: BlockProps) {
  const copy = (text: string) => uiCopy(ctx.locale, text)
  const { version, courses } = translateContent(await getCurriculum(), ctx.translate)
  return (
    <section id={anchor(block)} className="bg-white py-16 lg:py-24">
      <div className="container-arus mb-8 lg:mb-12">
        <div className="relative mx-auto aspect-[3/2] max-w-3xl overflow-hidden rounded-[28px] border-2 border-navy bg-ink-50 shadow-hard">
          <Image src={CURRICULUM_ART} alt="" fill sizes="(min-width: 840px) 768px, 92vw" className="object-cover" />
        </div>
      </div>
      {courses.length ? (
        <CurriculumExplorer
          semesters={toTrackSemesters(version)}
          courses={toTrackCourses(courses)}
          heading={block.heading}
          intro={block.intro}
          showSearch={block.showSearch !== false}
          showPathMap={block.showPathMap !== false}
          showPlaceholders={ctx.showPlaceholders}
          showTotalSks={ctx.showTotalSks}
          versionName={version?.name ?? null}
        />
      ) : (
        <EmptyState>{copy("Daftar mata kuliah sedang disiapkan. Cek lagi sebentar lagi, ya.")}</EmptyState>
      )}
    </section>
  )
}

export async function FacultyDirectoryBlock({ block, ctx }: BlockProps) {
  const copy = (text: string) => uiCopy(ctx.locale, text)
  const faculty = translateContent(await getFacultyList(), ctx.translate)
  const members: DirectoryMember[] = faculty.map((member) => {
    const photo = asMedia(member.photo)
    const taught = ((member.coursesTaught?.docs as unknown[] | undefined) ?? []).filter(
      (course): course is Doc => Boolean(course) && typeof course === 'object',
    )
    return {
      id: String(member.id),
      slug: String(member.slug ?? ''),
      name: String(member.name ?? ''),
      titleFront: member.titleFront ?? null,
      titleBack: member.titleBack ?? null,
      position: member.position ?? null,
      expertise: ((member.expertise as string[] | null) ?? []).filter(Boolean),
      photo: photo
        ? { url: photo.url, alt: photo.alt, focalX: photo.focalX, focalY: photo.focalY }
        : null,
      courses: taught.map((course) => ({
        slug: String(course.slug ?? ''),
        name: String(course.name ?? ''),
      })),
    }
  })
  return (
    <section id={anchor(block)} className="bg-white py-16 lg:py-24">
      {members.length ? (
        <FacultyDirectory
          members={members}
          showPlaceholders={ctx.showPlaceholders}
          heading={block.heading}
          intro={block.intro}
        />
      ) : (
        <EmptyState>{copy("Profil dosen sedang kami lengkapi.")}</EmptyState>
      )}
    </section>
  )
}

export async function BlogIndexBlock({ block, ctx }: BlockProps) {
  const copy = (text: string) => uiCopy(ctx.locale, text)
  const pageSize = Math.max(1, Math.min(30, Math.floor(Number(block.pageSize) || 9)))
  const [page, categories, tags] = translateContent(await Promise.all([getPostsPage({ page: 1, limit: pageSize }), getPostCategories(), getPostTags()]), ctx.translate)
  return (
    <section id={anchor(block)} className="bg-white py-16 lg:py-24">
      {block.heading ? (
        <div className="container-arus mb-10">
          <h2 className="text-section font-bold">{block.heading}</h2>
        </div>
      ) : null}
      {page.docs.length ? (
        <BlogIndex
          initialPage={page}
          tags={tags.map((tag) => ({ name: String(tag.name), slug: String(tag.slug) }))}
          categories={categories.map((category) => ({
            name: String(category.name),
            slug: String(category.slug),
          }))}
          pageSize={pageSize}
        />
      ) : (
        <EmptyState>{copy("Belum ada artikel. Tim kami sedang menulis cerita pertama.")}</EmptyState>
      )}
    </section>
  )
}

export async function FormEmbedBlock({ block, ctx }: BlockProps) {
  const copy = (text: string) => uiCopy(ctx.locale, text)
  const kind = String(block.form ?? 'kontak')
  const pose = isSiasatPose(block.mascotPose) ? block.mascotPose : null
  const wide = kind === 'pmb' || kind === 'statusPmb'
  let form: ReactNode = null

  if (kind === 'kontak') form = <ContactForm />
  if (kind === 'konsultasi') form = <ConsultationForm />
  if (kind === 'brosur') {
    form = (
      <div className="grid gap-5 rounded-[28px] border-2 border-navy bg-navy p-7 text-white shadow-hard-lime sm:p-9">
        <p className="text-xl font-bold">{copy("Brosur lengkap MBD: kurikulum, biaya, dan jalur pendaftaran dalam satu PDF.")}</p>
        <BrochureButton
          placement={`form-${block.id ?? 'brosur'}`}
          className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full border-2 border-navy bg-lime px-6 font-semibold text-navy shadow-hard-sm transition-transform duration-150 hover:-translate-y-0.5"
        />
      </div>
    )
  }
  if (kind === 'pmb' || kind === 'statusPmb') {
    const rawInfo = await getPmbInfo()
    const info = translateContent(rawInfo, ctx.translate)
    const settings = (info.settings ?? {}) as Doc
    const sources = ((rawInfo.settings?.sourceOptions as Doc[] | undefined) ?? []).map((option) => String(option.label ?? '')).filter(Boolean)
    if (kind === 'pmb') {
      const tracks = info.tracks.filter((track) => track.isActive !== false)
      const waves = info.waves.filter((wave) => admissionWaveStatus(wave) === 'dibuka')
      form = tracks.length && waves.length ? (
        <PmbForm
          tracks={tracks.map((track) => ({
            id: String(track.id),
            name: String(track.name),
            description: track.description ?? null,
          }))}
          waves={waves.map((wave) => ({
            id: String(wave.id),
            name: String(wave.name),
            note: wave.closeDate ? `${ctx.locale === 'en' ? 'Closes' : 'Tutup'} ${formatDate(wave.closeDate, 'long', ctx.locale)}` : null,
          }))}
          sources={sources}
          sourceLabels={Object.fromEntries(sources.map((source) => [source, ctx.translate(source)]))}
          documentUpload={Boolean(settings.documentUploadEnabled) && (Number(settings.maxDocumentMb) || 2) <= Number(process.env.PMB_MAX_DOCUMENT_MB || 2)}
          maxDocumentMb={Number(settings.maxDocumentMb) || 2}
          successTitle={settings.successTitle}
          successBody={settings.successBody}
        />
      ) : (
        <EmptyState>{copy("Pra-pendaftaran sedang tidak dibuka. Lihat jadwal gelombang atau hubungi tim PMB melalui halaman Kontak.")}</EmptyState>
      )
    } else {
      form = <StatusChecker intro={settings.statusIntro} />
    }
  }

  if (!form) return null

  if (wide) {
    return (
      <section id={anchor(block)} className="bg-ink-50 py-20 lg:py-24">
        <div className="container-arus">
          <SectionHeading
            eyebrow={block.eyebrow}
            title={block.heading}
            intro={block.intro}
            aside={pose ? <Siasat pose={pose} size="md" interactive /> : undefined}
          />
          <div className={cn(block.heading || block.intro ? 'mt-10' : '')}>{form}</div>
        </div>
      </section>
    )
  }

  const hasText = Boolean(block.eyebrow || block.heading || block.intro)
  const hasAside = hasText || Boolean(pose)

  return (
    <section id={anchor(block)} className="bg-white py-20 lg:py-24">
      <div className={cn('container-arus', hasAside && 'grid gap-8 lg:grid-cols-12 lg:gap-12')}>
        {hasAside ? (
          <div className={cn('lg:col-span-4', !hasText && 'hidden lg:block')}>
            {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
            {block.heading ? <h2 className="mt-3 text-section font-bold">{block.heading}</h2> : null}
            {block.intro ? <p className="mt-4 text-lead text-ink-600">{block.intro}</p> : null}
            {pose ? (
              <div className="mt-8 hidden lg:block">
                <Siasat pose={pose} size="md" interactive />
              </div>
            ) : null}
          </div>
        ) : null}
        <div className={cn(hasAside ? 'min-w-0 lg:col-span-8' : 'mx-auto max-w-3xl')}>{form}</div>
      </div>
    </section>
  )
}

const WAVE_STATUS: Record<string, { label: string; className: string }> = {
  dibuka: { label: 'Sedang dibuka', className: 'bg-lime text-navy border-navy' },
  'akan-datang': { label: 'Akan datang', className: 'bg-white text-navy border-navy' },
  ditutup: { label: 'Ditutup', className: 'bg-ink-100 text-ink-700 border-ink-300' },
}

function dateRange(open: string | null | undefined, close: string | null | undefined, locale: Locale): string | null {
  if (!open && !close) return null
  if (open && close) return `${formatDate(open, 'short', locale)} – ${formatDate(close, 'short', locale)}`
  return open ? `${locale === 'en' ? 'From' : 'Mulai'} ${formatDate(open, 'short', locale)}` : `${locale === 'en' ? 'Until' : 'Sampai'} ${formatDate(close, 'short', locale)}`
}

export async function PmbInfoBlock({ block, ctx }: BlockProps) {
  const copy = (text: string) => uiCopy(ctx.locale, text)
  const info = translateContent(await getPmbInfo(), ctx.translate)
  const settings = (info.settings ?? {}) as Doc
  const section = String(block.section ?? 'tracks')
  let body: ReactNode = null
  let tone: 'light' | 'muted' | 'dark' = 'light'

  if (section === 'tracks') {
    const tracks = info.tracks.filter((track) => track.isActive !== false)
    if (!tracks.length) return null
    body = (
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track, index) => (
          <Reveal as="li" key={track.id} delay={index * 70} className="sticker flex flex-col p-6">
            <span className="font-mono text-sm font-medium text-blue">
              JALUR {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-3 text-2xl leading-tight font-bold">{track.name}</h3>
            {track.description ? (
              <p className="mt-2 text-ink-600">
                <TextOr value={track.description} show={ctx.showPlaceholders} />
              </p>
            ) : null}
            {(track.highlights as Doc[] | undefined)?.length ? (
              <ul className="mt-5 grid gap-2 border-t-2 border-navy pt-4">
                {(track.highlights as Doc[]).map((item, i) =>
                  ctx.showPlaceholders || !isPlaceholder(item.text) ? (
                    <li key={item.id ?? i} className="flex items-start gap-2">
                      <Icon
                        name="check"
                        size={18}
                        strokeWidth={2.5}
                        className="mt-0.5 shrink-0 text-blue"
                      />
                      <TextOr value={item.text} show={ctx.showPlaceholders} />
                    </li>
                  ) : null,
                )}
              </ul>
            ) : null}
          </Reveal>
        ))}
      </ul>
    )
  }

  if (section === 'waves') {
    const waves = info.waves.filter((wave) =>
      admissionWaveStatus(wave) !== 'ditutup' || wave.openDate || wave.closeDate,
    )
    if (!waves.length) return null
    tone = 'dark'
    body = (
      <ol className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {waves.map((wave, index) => {
          const status = WAVE_STATUS[admissionWaveStatus(wave)]
          const active = info.activeWave?.id === wave.id
          const range = dateRange(wave.openDate, wave.closeDate, ctx.locale)
          const hasDetails = !isPlaceholder(wave.fee) || Boolean(wave.quota) || ctx.showPlaceholders
          return (
            <Reveal
              as="li"
              key={wave.id}
              delay={index * 80}
              className={cn(
                'relative flex flex-col rounded-[24px] border-2 p-6',
                active
                  ? 'border-navy bg-white text-navy shadow-hard-lime'
                  : 'border-white/30 bg-white/5 text-white',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className={cn('font-mono text-sm', active ? 'text-blue' : 'text-cyan')}>{copy("GEL.") + " "}{String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'label-mono rounded-full border-2 px-2.5 py-1 text-[0.6875rem]',
                    status.className,
                  )}
                >
                  {copy(status.label)}
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-bold">{wave.name}</h3>
              <p className={cn('mt-2 font-semibold', active ? 'text-navy' : 'text-white/85')}>
                {range ??
                  (ctx.showPlaceholders ? (
                    <PendingChip hint={copy("tanggal gelombang")} />
                  ) : (
                    'Jadwal segera diumumkan'
                  ))}
              </p>
              {hasDetails ? <dl
                className={cn(
                  'mt-5 grid grid-cols-2 gap-3 border-t-2 pt-4 text-sm',
                  active ? 'border-navy' : 'border-white/20',
                )}
              >
                <div>
                  <dt className={cn('label-mono', active ? 'text-ink-600' : 'text-white/60')}>{copy("Biaya daftar")}</dt>
                  <dd className="mt-1 font-semibold">
                    <TextOr value={wave.fee} show={ctx.showPlaceholders} fallback="—" />
                  </dd>
                </div>
                <div>
                  <dt className={cn('label-mono', active ? 'text-ink-600' : 'text-white/60')}>{copy("Kuota")}</dt>
                  <dd className="mt-1 font-semibold">{wave.quota ? `${wave.quota} kursi` : '—'}</dd>
                </div>
              </dl> : null}
              {wave.note && (ctx.showPlaceholders || !isPlaceholder(wave.note)) ? (
                <p className={cn('mt-4 text-sm', active ? 'text-ink-600' : 'text-white/70')}>
                  <TextOr value={wave.note} show={ctx.showPlaceholders} />
                </p>
              ) : null}
            </Reveal>
          )
        })}
      </ol>
    )
  }

  if (section === 'requirements') {
    const items = ((settings.requirements as Doc[] | undefined) ?? []).filter(
      (item) => ctx.showPlaceholders || !isPlaceholder(item.text),
    )
    if (!items.length) return null
    tone = 'muted'
    body = (
      <ol className="grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <li
            key={item.id ?? index}
            className="flex min-h-16 items-center gap-4 rounded-2xl border-2 border-navy bg-white px-5 py-4"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy font-mono text-sm text-lime">
              {index + 1}
            </span>
            <span className="font-semibold">
              <TextOr value={item.text} show={ctx.showPlaceholders} />
            </span>
          </li>
        ))}
      </ol>
    )
  }

  if (section === 'fees') {
    const rows = (settings.fees as Doc[] | undefined) ?? []
    if (!rows.length) return null
    body = (
      <div className="overflow-hidden rounded-[24px] border-2 border-navy shadow-hard">
        <DataTable
          label={`${copy('Rincian biaya kuliah')} ${settings.academicYear && !isPlaceholder(settings.academicYear) ? settings.academicYear : ''}`.trim()}
          className="px-4"
          columns={[{ label: copy("Komponen") }, { label: copy("Nominal") }, { label: copy("Keterangan") }]}
          rows={rows.map((row, index) => {
            const values = [row.item, row.amount, row.note].map(value =>
              isPlaceholder(value) ? '' : String(value ?? '').trim(),
            )
            const amount = values[1]
            const rupiah = /^(?:Rp\s*)?\d+(?:\.\d{3})*$/i.test(amount)
            return {
              id: row.id ?? index,
              values,
              sortValues: rupiah ? { 1: Number(amount.replace(/\D/g, '')) } : undefined,
              cells: [
                <TextOr key="item" value={row.item} show={ctx.showPlaceholders} />,
                <span key="amount" className="font-mono font-medium"><TextOr value={row.amount} show={ctx.showPlaceholders} fallback="—" hint={copy("nominal")} /></span>,
                <TextOr key="note" value={row.note} show={ctx.showPlaceholders} fallback="—" />,
              ],
            }
          })}
        />
        {settings.feesNote && (ctx.showPlaceholders || !isPlaceholder(settings.feesNote)) ? (
          <p className="border-t-2 border-navy bg-ink-50 px-5 py-4 text-sm text-ink-700">
            <TextOr value={settings.feesNote} show={ctx.showPlaceholders} />
          </p>
        ) : null}
      </div>
    )
  }

  if (section === 'stepper') {
    const steps = (settings.steps as Doc[] | undefined) ?? []
    if (!steps.length) return null
    body = (
      <ol className="grid gap-6 md:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
        {steps.map((step, index) => (
          <Reveal as="li" key={step.id ?? index} delay={index * 80} className="relative">
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-navy bg-lime font-display text-xl font-extrabold text-navy shadow-hard-sm">
                {index + 1}
              </span>
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="hidden h-0.5 flex-1 border-t-2 border-dashed border-navy/40 lg:block"
                />
              ) : null}
            </div>
            <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
            {step.description ? (
              <p className="mt-2 text-ink-600">
                <TextOr value={step.description} show={ctx.showPlaceholders} />
              </p>
            ) : null}
          </Reveal>
        ))}
      </ol>
    )
  }

  if (!body) return null
  const dark = tone === 'dark'
  return (
    <section
      id={anchor(block)}
      data-tone={dark ? 'dark' : 'light'}
      className={cn(
        'relative isolate overflow-hidden py-20 lg:py-24',
        dark ? 'bg-navy text-white' : tone === 'muted' ? 'bg-ink-50' : 'bg-white',
      )}
    >
      {dark ? <StarField tone="lime" count={4} /> : null}
      <div className="container-arus relative">
        <SectionHeading
          eyebrow={block.eyebrow}
          title={block.heading}
          intro={block.intro}
          dark={dark}
        />
        <div className="mt-12">{body}</div>
      </div>
    </section>
  )
}

export async function QuizBlock({ block, ctx }: BlockProps) {
  const assessment = ctx.pageSlug === 'kuis'
  const questions = translateContent(await getQuiz(assessment), ctx.translate)
  const bands = ((block.bands as Doc[] | undefined) ?? [])
    .filter((band) => band.label)
    .map((band) => ({
      min: Number(band.min) || 0,
      label: String(band.label),
      description: band.description ?? null,
    }))
  return (
    <section id={anchor(block)} className="relative bg-white">
      <QuizApp
        questions={questions}
        assessment={assessment}
        introTitle={block.introTitle}
        introBody={block.introBody}
        disclaimer={block.disclaimer}
        bands={bands}
        leadCapture={block.leadCapture !== false}
        leadHeading={block.leadHeading}
      />
    </section>
  )
}

export function NotFoundHeroBlock({ block, ctx, locale = 'id', translate }: { block: Doc; ctx?: BlockProps['ctx']; locale?: Locale; translate?: (text: string) => string }) {
  const copy = (text: string) => uiCopy(ctx?.locale ?? locale, (ctx?.translate ?? translate)?.(text) ?? text)
  const quickLinks = ((block.quickLinks as Doc[] | undefined) ?? []).filter(
    (link) => link.label && link.href,
  )
  const links = quickLinks.length
    ? quickLinks
    : [
        { label: copy("Kurikulum"), href: '/kurikulum' },
        { label: copy("Dosen"), href: '/dosen' },
        { label: 'PMB', href: '/pmb' },
        { label: copy("Kuis jurusan"), href: '/kuis' },
      ]
  return (
    <section
      data-tone="dark"
      className="relative isolate overflow-hidden bg-navy py-20 text-white lg:py-28"
    >
      <StarField tone="lime" count={6} />
      <div className="container-arus relative grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label-mono text-lime">{block.label || copy("RUTE TIDAK DITEMUKAN")}</p>
          <h1 className="relative mt-4 w-fit font-display text-[clamp(7rem,3.5rem+17vw,15rem)] leading-[0.8] font-extrabold tracking-[-0.06em]">
            404
            <span
              aria-hidden="true"
              className="anim-float absolute -top-4 -right-12 grid size-16 place-items-center rounded-full border-2 border-navy bg-lime font-display text-4xl text-navy shadow-hard-sm sm:-right-16 sm:size-20 sm:text-5xl"
            >
              ?
            </span>
            <span className="sr-only">{copy(": halaman tidak ditemukan")}</span>
          </h1>
          <p className="mt-8 max-w-xl text-lead text-white/85">
            {block.line || copy("Waduh, halaman ini tidak ada di peta strategiku.")}
          </p>
          <div className="mt-8 max-w-xl">
            <SiteSearch placeholder={block.searchPlaceholder} />
          </div>
          <nav aria-label={copy("Tautan cepat")} className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-white/40 px-4 font-semibold transition-colors duration-150 hover:border-lime hover:text-lime"
                  >
                    <Star className="size-3" /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ButtonLink href="/" variant="primaryDark" className="mt-10">
            <Icon name="arrow-left" size={18} strokeWidth={2.5} />{' '}
            {block.buttonLabel || copy("Kembali ke Beranda")}
          </ButtonLink>
        </div>
        <div className="justify-self-center lg:col-span-5">
          <Siasat pose="confused" size="lg" onDark interactive showArtTag />
        </div>
      </div>
      <NotFoundLogger />
    </section>
  )
}
