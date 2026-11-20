import Link from 'next/link'
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
import {
  getCurriculum,
  getFacultyList,
  getPmbInfo,
  getPostCategories,
  getPosts,
  getQuiz,
} from '@/lib/data'
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
  const { version, courses } = await getCurriculum()
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
  const { version, courses } = await getCurriculum()
  return (
    <section id={anchor(block)} className="bg-white py-16 lg:py-24">
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
        <EmptyState>Daftar mata kuliah sedang disiapkan. Cek lagi sebentar lagi, ya.</EmptyState>
      )}
    </section>
  )
}

export async function FacultyDirectoryBlock({ block, ctx }: BlockProps) {
  const faculty = await getFacultyList()
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
        <EmptyState>Profil dosen sedang kami lengkapi.</EmptyState>
      )}
    </section>
  )
}

export async function BlogIndexBlock({ block }: BlockProps) {
  const [posts, categories] = await Promise.all([getPosts(), getPostCategories()])
  return (
    <section id={anchor(block)} className="bg-white py-16 lg:py-24">
      {block.heading ? (
        <div className="container-arus mb-10">
          <h2 className="text-section font-bold">{block.heading}</h2>
        </div>
      ) : null}
      {posts.length ? (
        <BlogIndex
          posts={posts}
          categories={categories.map((category) => ({
            name: String(category.name),
            slug: String(category.slug),
          }))}
          pageSize={Number(block.pageSize) || 9}
        />
      ) : (
        <EmptyState>Belum ada artikel. Tim kami sedang menulis cerita pertama.</EmptyState>
      )}
    </section>
  )
}

export async function FormEmbedBlock({ block }: BlockProps) {
  const kind = String(block.form ?? 'kontak')
  const pose = isSiasatPose(block.mascotPose) ? block.mascotPose : null
  const wide = kind === 'pmb' || kind === 'statusPmb'
  let form: ReactNode = null

  if (kind === 'kontak') form = <ContactForm />
  if (kind === 'konsultasi') form = <ConsultationForm />
  if (kind === 'brosur') {
    form = (
      <div className="grid gap-5 rounded-[28px] border-2 border-navy bg-navy p-7 text-white shadow-hard-lime sm:p-9">
        <p className="text-xl font-bold">
          Brosur lengkap MBD: kurikulum, biaya, dan jalur pendaftaran dalam satu PDF.
        </p>
        <BrochureButton
          placement={`form-${block.id ?? 'brosur'}`}
          className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full border-2 border-navy bg-lime px-6 font-semibold text-navy shadow-hard-sm transition-transform duration-150 hover:-translate-y-0.5"
        />
      </div>
    )
  }
  if (kind === 'pmb' || kind === 'statusPmb') {
    const info = await getPmbInfo()
    const settings = (info.settings ?? {}) as Doc
    if (kind === 'pmb') {
      const tracks = info.tracks.filter((track) => track.isActive !== false)
      const waves = info.waves.filter((wave) => wave.status !== 'ditutup')
      form = (
        <PmbForm
          tracks={tracks.map((track) => ({
            id: String(track.id),
            name: String(track.name),
            description: track.description ?? null,
          }))}
          waves={waves.map((wave) => ({
            id: String(wave.id),
            name: String(wave.name),
            note: wave.closeDate ? `Tutup ${formatDate(wave.closeDate)}` : null,
          }))}
          sources={((settings.sourceOptions as Doc[] | undefined) ?? [])
            .map((option) => String(option.label))
            .filter(Boolean)}
          documentUpload={Boolean(settings.documentUploadEnabled)}
          maxDocumentMb={Number(settings.maxDocumentMb) || 2}
          successTitle={settings.successTitle}
          successBody={settings.successBody}
        />
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

  return (
    <section id={anchor(block)} className="bg-white py-20 lg:py-24">
      <div className="container-arus grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
          {block.heading ? <h2 className="mt-3 text-section font-bold">{block.heading}</h2> : null}
          {block.intro ? <p className="mt-4 text-lead text-ink-600">{block.intro}</p> : null}
          {pose ? (
            <div className="mt-8 hidden lg:block">
              <Siasat pose={pose} size="md" interactive />
            </div>
          ) : null}
        </div>
        <div className="lg:col-span-8">{form}</div>
      </div>
    </section>
  )
}

const WAVE_STATUS: Record<string, { label: string; className: string }> = {
  dibuka: { label: 'Sedang dibuka', className: 'bg-lime text-navy border-navy' },
  'akan-datang': { label: 'Akan datang', className: 'bg-white text-navy border-navy' },
  ditutup: { label: 'Ditutup', className: 'bg-ink-100 text-ink-700 border-ink-300' },
}

function dateRange(open?: string | null, close?: string | null): string | null {
  if (!open && !close) return null
  if (open && close) return `${formatDate(open, 'short')} – ${formatDate(close, 'short')}`
  return open ? `Mulai ${formatDate(open, 'short')}` : `Sampai ${formatDate(close, 'short')}`
}

export async function PmbInfoBlock({ block, ctx }: BlockProps) {
  const info = await getPmbInfo()
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
    const waves = info.waves
    if (!waves.length) return null
    tone = 'dark'
    body = (
      <ol className="relative grid gap-5 md:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
        {waves.map((wave, index) => {
          const status = WAVE_STATUS[String(wave.status)] ?? WAVE_STATUS['akan-datang']
          const active = info.activeWave?.id === wave.id
          const range = dateRange(wave.openDate, wave.closeDate)
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
                <span className={cn('font-mono text-sm', active ? 'text-blue' : 'text-cyan')}>
                  GEL. {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'label-mono rounded-full border-2 px-2.5 py-1 text-[0.6875rem]',
                    status.className,
                  )}
                >
                  {status.label}
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-bold">{wave.name}</h3>
              <p className={cn('mt-2 font-semibold', active ? 'text-navy' : 'text-white/85')}>
                {range ??
                  (ctx.showPlaceholders ? (
                    <PendingChip hint="tanggal gelombang" />
                  ) : (
                    'Jadwal segera diumumkan'
                  ))}
              </p>
              <dl
                className={cn(
                  'mt-5 grid grid-cols-2 gap-3 border-t-2 pt-4 text-sm',
                  active ? 'border-navy' : 'border-white/20',
                )}
              >
                <div>
                  <dt className={cn('label-mono', active ? 'text-ink-600' : 'text-white/60')}>
                    Biaya daftar
                  </dt>
                  <dd className="mt-1 font-semibold">
                    <TextOr value={wave.fee} show={ctx.showPlaceholders} fallback="—" />
                  </dd>
                </div>
                <div>
                  <dt className={cn('label-mono', active ? 'text-ink-600' : 'text-white/60')}>
                    Kuota
                  </dt>
                  <dd className="mt-1 font-semibold">{wave.quota ? `${wave.quota} kursi` : '—'}</dd>
                </div>
              </dl>
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="sr-only">
              Rincian biaya kuliah{' '}
              {settings.academicYear && !isPlaceholder(settings.academicYear)
                ? settings.academicYear
                : ''}
            </caption>
            <thead className="bg-navy text-white">
              <tr>
                <th scope="col" className="label-mono px-5 py-4">
                  Komponen
                </th>
                <th scope="col" className="label-mono px-5 py-4">
                  Nominal
                </th>
                <th scope="col" className="label-mono px-5 py-4">
                  Keterangan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-navy/10 bg-white">
              {rows.map((row, index) => (
                <tr key={row.id ?? index}>
                  <th scope="row" className="px-5 py-4 font-semibold">
                    <TextOr value={row.item} show={ctx.showPlaceholders} />
                  </th>
                  <td className="px-5 py-4 font-mono font-medium">
                    <TextOr
                      value={row.amount}
                      show={ctx.showPlaceholders}
                      fallback="—"
                      hint="nominal"
                    />
                  </td>
                  <td className="px-5 py-4 text-ink-600">
                    <TextOr value={row.note} show={ctx.showPlaceholders} fallback="—" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export async function QuizBlock({ block }: BlockProps) {
  const questions = await getQuiz()
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

export function NotFoundHeroBlock({ block }: { block: Doc }) {
  const quickLinks = ((block.quickLinks as Doc[] | undefined) ?? []).filter(
    (link) => link.label && link.href,
  )
  const links = quickLinks.length
    ? quickLinks
    : [
        { label: 'Kurikulum', href: '/kurikulum' },
        { label: 'Dosen', href: '/dosen' },
        { label: 'PMB', href: '/pmb' },
        { label: 'Kuis jurusan', href: '/kuis' },
      ]
  return (
    <section
      data-tone="dark"
      className="relative isolate overflow-hidden bg-navy py-20 text-white lg:py-28"
    >
      <StarField tone="lime" count={6} />
      <div className="container-arus relative grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label-mono text-lime">{block.label || 'RUTE TIDAK DITEMUKAN'}</p>
          <h1 className="relative mt-4 w-fit font-display text-[clamp(7rem,3.5rem+17vw,15rem)] leading-[0.8] font-extrabold tracking-[-0.06em]">
            404
            <span
              aria-hidden="true"
              className="anim-float absolute -top-4 -right-12 grid size-16 place-items-center rounded-full border-2 border-navy bg-lime font-display text-4xl text-navy shadow-hard-sm sm:-right-16 sm:size-20 sm:text-5xl"
            >
              ?
            </span>
            <span className="sr-only">: halaman tidak ditemukan</span>
          </h1>
          <p className="mt-8 max-w-xl text-lead text-white/85">
            {block.line || 'Waduh, halaman ini tidak ada di peta strategiku.'}
          </p>
          <div className="mt-8 max-w-xl">
            <SiteSearch placeholder={block.searchPlaceholder} />
          </div>
          <nav aria-label="Tautan cepat" className="mt-8">
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
            {block.buttonLabel || 'Kembali ke Beranda'}
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
