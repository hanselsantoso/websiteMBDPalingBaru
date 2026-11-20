import Image from 'next/image'
import Link from 'next/link'
import { WhatsAppLink } from '@/components/cta/CtaLinks'
import { ArrowLink, FacultyCard, PostCard } from '@/components/cards/Cards'
import { Siasat } from '@/components/mascot/Siasat'
import { Reveal } from '@/components/motion/Interactive'
import { Fin, Star } from '@/components/patterns/Patterns'
import { buttonStyles } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PendingChip, TextOr } from '@/components/ui/Isi'
import { Eyebrow, SectionHeading } from '@/components/ui/Section'
import { isSiasatPose } from '@/lib/brand/mascot'
import { displayCourseCode } from '@/lib/domain/curriculum'
import { isPlaceholder } from '@/lib/domain/placeholders'
import {
  getCareerPaths,
  getFacultyList,
  getJobs,
  getLatestPosts,
  getPrograms,
  getSiteSettings,
  getTestimonials,
} from '@/lib/data'
import { asMedia, cn, formatDate } from '@/lib/utils'
import { anchor, type BlockProps } from './types'

export async function FacultyHighlightBlock({ block, ctx }: BlockProps) {
  const all = await getFacultyList()
  const members = all.filter((member) => member.showOnHome).slice(0, Number(block.limit ?? 4))
  if (!members.length) return null
  return (
    <section data-tone="light" id={anchor(block)} className="bg-white py-20 lg:py-28">
      <div className="container-arus">
        <SectionHeading
          eyebrow={block.eyebrow}
          title={block.heading}
          intro={block.intro}
          aside={<ArrowLink href="/dosen">{block.linkLabel || 'Kenal semua dosen'}</ArrowLink>}
        />
        <ul className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, index) => (
            <Reveal
              as="li"
              key={member.id}
              delay={index * 90}
              className={cn(index % 2 === 1 && 'lg:translate-y-10')}
            >
              <FacultyCard
                member={member}
                showPlaceholders={ctx.showPlaceholders}
                mask={index % 2 === 0 ? 'fin' : 'round'}
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export async function TestimonialsBlock({ block }: BlockProps) {
  const testimonials = (await getTestimonials())
    .filter((item) => !isPlaceholder(item.quote))
    .slice(0, Number(block.limit ?? 3))
  if (!testimonials.length) return null
  const [first, ...rest] = testimonials
  return (
    <section data-tone="light" id={anchor(block)} className="bg-ink-50 py-20 lg:py-28">
      <div className="container-arus">
        <SectionHeading eyebrow={block.eyebrow} title={block.heading} />
        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          <Reveal as="article" className="sticker relative p-8 lg:col-span-7 lg:p-10">
            <Star className="absolute top-6 right-6 size-6 text-blue" />
            <blockquote className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-tight font-semibold tracking-[-0.02em]">
              “{first.quote}”
            </blockquote>
            <Attribution item={first} />
          </Reveal>
          <div className="grid gap-5 lg:col-span-5">
            {rest.map((item, index) => (
              <Reveal
                as="article"
                key={item.id}
                delay={(index + 1) * 90}
                className="rounded-[24px] border-2 border-navy bg-white p-6"
              >
                <blockquote className="text-lg leading-relaxed">“{item.quote}”</blockquote>
                <Attribution item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Attribution({ item }: { item: Record<string, any> }) {
  const photo = asMedia(item.photo)
  return (
    <footer className="mt-6 flex items-center gap-3">
      {photo ? (
        <Image
          src={photo.url!}
          alt=""
          width={48}
          height={48}
          className="size-12 rounded-full border-2 border-navy object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid size-12 place-items-center rounded-full bg-navy text-lime"
        >
          <Fin className="size-6" />
        </span>
      )}
      <div>
        <p className="font-bold">{item.name}</p>
        <p className="label-mono text-ink-600">
          {[item.classYear, item.workplace]
            .filter((value) => value && !isPlaceholder(value))
            .join(' · ')}
        </p>
      </div>
    </footer>
  )
}

export async function LatestPostsBlock({ block }: BlockProps) {
  const posts = await getLatestPosts(Number(block.limit ?? 3))
  if (!posts.length) return null
  const [feature, ...rest] = posts
  return (
    <section data-tone="light" id={anchor(block)} className="bg-white py-20 lg:py-28">
      <div className="container-arus">
        <SectionHeading
          eyebrow={block.eyebrow}
          title={block.heading}
          aside={<ArrowLink href="/blog">{block.linkLabel || 'Semua artikel'}</ArrowLink>}
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <PostCard post={feature} featured={false} />
          </Reveal>
          <div className="grid gap-5 lg:col-span-5">
            {rest.map((post, index) => (
              <Reveal key={post.id} delay={(index + 1) * 90}>
                <article className="sticker sticker-press group relative flex flex-col gap-2 p-6">
                  {typeof post.category === 'object' && post.category ? (
                    <span className="label-mono text-blue">{post.category.name}</span>
                  ) : null}
                  <h3 className="text-xl leading-tight font-bold">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="after:absolute after:inset-0 group-hover:text-blue"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="label-mono text-ink-600">
                    {formatDate(post.publishedAt)}
                    {post.readingMinutes ? ` · ${post.readingMinutes} menit baca` : ''}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export async function ProgramsBlock({ block, ctx }: BlockProps) {
  const programs = await getPrograms()
  if (!programs.length) return null
  return (
    <section data-tone="light" id={anchor(block)} className="bg-white py-20 lg:py-28">
      <div className="container-arus">
        <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, index) => {
            const pose = isSiasatPose(program.mascotPose) ? program.mascotPose : null
            const image = asMedia(program.image)
            return (
              <Reveal
                as="li"
                key={program.id}
                delay={(index % 3) * 80}
                className={cn(
                  'sticker relative flex flex-col overflow-hidden',
                  pose && 'bg-navy text-white sm:col-span-2 lg:col-span-1 lg:row-span-2',
                )}
              >
                {image ? (
                  <div className="relative aspect-[16/9] border-b-2 border-navy">
                    <Image
                      src={image.url!}
                      alt={image.alt ?? ''}
                      fill
                      sizes="(min-width: 1024px) 400px, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        'grid size-11 place-items-center rounded-xl',
                        pose ? 'bg-lime text-navy' : 'bg-navy text-lime',
                      )}
                    >
                      <Icon name={program.icon ?? 'bintang'} size={22} />
                    </span>
                    {program.tag ? (
                      <span className={cn('label-mono', pose ? 'text-lime' : 'text-ink-600')}>
                        {program.tag}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-5 text-xl leading-tight font-bold">{program.title}</h3>
                  <p className={cn('mt-2', pose ? 'text-white/80' : 'text-ink-600')}>
                    <TextOr value={program.summary} show={ctx.showPlaceholders} />
                  </p>
                  {pose ? (
                    <div className="mt-auto self-center pt-6">
                      <Siasat pose={pose} size="md" onDark interactive />
                    </div>
                  ) : null}
                  {program.linkHref ? (
                    <Link
                      href={program.linkHref}
                      className={cn(
                        'mt-5 inline-flex items-center gap-1 font-semibold',
                        pose ? 'text-lime' : 'text-blue',
                      )}
                    >
                      Lihat detail <span className="sr-only">{program.title}</span>
                      <Icon name="arrow-right" size={16} strokeWidth={2.5} />
                    </Link>
                  ) : null}
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export async function CareerPathsBlock({ block, ctx }: BlockProps) {
  const careers = await getCareerPaths()
  if (!careers.length) return null
  return (
    <section data-tone="light" id={anchor(block)} className="bg-white py-20 lg:py-28">
      <div className="container-arus">
        <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
        <ol className="mt-12 grid gap-5">
          {careers.map((career, index) => {
            const courses = ((career.relatedCourses as Record<string, any>[]) ?? []).filter(
              (course) => course && typeof course === 'object',
            )
            const semesters = Array.from(
              new Set(courses.map((course) => Number(course.semester)).filter(Boolean)),
            ).sort((a, b) => a - b)
            const skills = (career.skills as string[]) ?? []
            return (
              <Reveal
                as="li"
                key={career.id}
                delay={(index % 3) * 70}
                className="sticker grid min-w-0 gap-6 p-6 lg:grid-cols-12 lg:p-8"
              >
                <div className="min-w-0 lg:col-span-4">
                  <p className="label-mono text-blue">Peran {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-2 text-2xl leading-tight font-bold">{career.role}</h3>
                  <p className="mt-3 text-ink-600">{career.summary}</p>
                </div>
                {block.showRoadmap ? (
                  <div
                    className="min-w-0 lg:col-span-5"
                    aria-label={`Peta jalan menuju ${career.role}`}
                  >
                    <p className="label-mono text-ink-600">Semester → skill → peran</p>
                    <ol className="mt-3 flex flex-wrap items-center gap-2">
                      {semesters.map((semester) => (
                        <li
                          key={semester}
                          className="label-mono rounded-full bg-navy px-3 py-1.5 text-white"
                        >
                          Sem {semester}
                        </li>
                      ))}
                      <li aria-hidden="true" className="text-blue">
                        <Icon name="arrow-right" size={18} strokeWidth={2.5} />
                      </li>
                      {skills.map((skill) => (
                        <li
                          key={skill}
                          className="rounded-full border-2 border-navy px-3 py-1 text-sm font-semibold"
                        >
                          {skill}
                        </li>
                      ))}
                      <li aria-hidden="true" className="text-blue">
                        <Icon name="arrow-right" size={18} strokeWidth={2.5} />
                      </li>
                      <li className="rounded-full bg-lime px-3 py-1 text-sm font-bold text-navy ring-2 ring-navy">
                        {career.role}
                      </li>
                    </ol>
                    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                      {courses.map((course) => (
                        <li key={course.id}>
                          <Link
                            href={`/kurikulum/${course.slug}`}
                            prefetch={false}
                            className="inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-blue"
                          >
                            <span className="font-mono text-xs text-blue">
                              {displayCourseCode(course.code)}
                            </span>
                            {course.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <dl className="grid content-start gap-4 text-sm lg:col-span-3">
                  <div>
                    <dt className="label-mono text-ink-600">Contoh tempat kerja</dt>
                    <dd className="mt-1">
                      <TextOr
                        value={career.employers}
                        show={ctx.showPlaceholders}
                        fallback="Informasi menyusul"
                      />
                    </dd>
                  </div>
                  <div>
                    <dt className="label-mono text-ink-600">Kisaran gaji indikatif</dt>
                    <dd className="mt-1">
                      <TextOr
                        value={career.salaryNote}
                        show={ctx.showPlaceholders}
                        fallback="Informasi menyusul"
                      />
                    </dd>
                  </div>
                </dl>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

const JOB_TYPES: Record<string, string> = {
  magang: 'Magang',
  'penuh-waktu': 'Penuh waktu',
  'paruh-waktu': 'Paruh waktu',
  kontrak: 'Kontrak',
  freelance: 'Lepas',
}

export async function JobBoardBlock({ block }: BlockProps) {
  const now = Date.now()
  const jobs = (await getJobs()).filter(
    (job) => !job.deadline || new Date(job.deadline).getTime() + 24 * 3600 * 1000 > now,
  )
  return (
    <section data-tone="light" id={anchor(block)} className="bg-ink-50 py-20 lg:py-24">
      <div className="container-arus">
        <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
        {jobs.length ? (
          <ul className="mt-10 grid gap-4">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="sticker flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="label-mono text-blue">
                    {JOB_TYPES[job.type as string] ?? job.type}
                  </p>
                  <h3 className="mt-1 text-xl font-bold">{job.title}</h3>
                  <p className="text-ink-600">
                    {job.company}
                    {job.location ? ` · ${job.location}` : ''}
                    {job.deadline ? ` · Tenggat ${formatDate(job.deadline)}` : ''}
                  </p>
                </div>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonStyles.secondary}
                >
                  Lamar <span className="sr-only">{job.title}</span>
                  <Icon name="arrow-up-right" size={18} strokeWidth={2.5} />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-[28px] border-2 border-dashed border-navy bg-white p-10 text-center">
            <Siasat pose="thinking" size="sm" decorative />
            <p className="max-w-md font-semibold">
              {block.emptyText || 'Belum ada lowongan aktif.'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export async function ContactInfoBlock({ block, ctx }: BlockProps) {
  const settings = await getSiteSettings()
  const lat = Number(settings.mapLat)
  const lng = Number(settings.mapLng)
  const hasMap =
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    settings.mapLat !== null &&
    settings.mapLng !== null
  const socials = (settings.socials as { platform: string; url: string }[]) ?? []
  const rows = [
    {
      icon: 'map-pin',
      label: 'Alamat',
      value: settings.address,
      hint: 'alamat kampus ISTTS',
      show: true,
    },
    { icon: 'phone', label: 'Telepon', value: settings.phone, hint: 'nomor telepon', show: true },
    { icon: 'mail', label: 'Email', value: settings.email, hint: 'email', show: true },
    {
      icon: 'clock',
      label: 'Jam layanan',
      value: settings.serviceHours,
      hint: 'jam layanan',
      show: block.showHours !== false,
    },
  ].filter((row) => row.show)

  return (
    <section data-tone="light" id={anchor(block)} className="bg-white py-20 lg:py-24">
      <div className="container-arus grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
          <h2 className="mt-3 text-section font-bold">{block.heading}</h2>
          {block.intro ? <p className="mt-4 text-lead text-ink-600">{block.intro}</p> : null}
          <dl className="mt-8 grid gap-5">
            {rows.map((row) => (
              <div key={row.label} className="flex gap-4">
                <dt className="grid size-11 shrink-0 place-items-center rounded-xl bg-navy text-lime">
                  <Icon name={row.icon} size={20} />
                  <span className="sr-only">{row.label}</span>
                </dt>
                <dd className="pt-2.5">
                  <TextOr
                    value={row.value}
                    show={ctx.showPlaceholders}
                    hint={row.hint}
                    fallback="Informasi menyusul"
                  />
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <WhatsAppLink placement="kontak" className={buttonStyles.primary} />
            {block.showSocials !== false ? (
              socials.length ? (
                <ul className="flex gap-2" aria-label="Media sosial">
                  {socials.map((social) => (
                    <li key={social.url}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.platform}
                        className="grid size-12 place-items-center rounded-full border-2 border-navy hover:bg-navy hover:text-white"
                      >
                        <Icon name={social.platform} size={20} />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : ctx.showPlaceholders ? (
                <PendingChip hint="media sosial" />
              ) : null
            ) : null}
          </div>
        </div>
        {block.showMap !== false ? (
          <div className="lg:col-span-7">
            {hasMap ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border-2 border-navy shadow-hard-lg lg:aspect-auto lg:h-full lg:min-h-[26rem]">
                <iframe
                  title="Peta lokasi kampus ISTTS"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.008}%2C${lat - 0.005}%2C${lng + 0.008}%2C${lat + 0.005}&layer=mapnik&marker=${lat}%2C${lng}`}
                  loading="lazy"
                  className="absolute inset-0 size-full"
                />
              </div>
            ) : (
              <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[28px] border-2 border-dashed border-navy bg-ink-50 p-8 text-center lg:aspect-auto lg:h-full lg:min-h-[26rem]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 400 300"
                  className="absolute inset-0 size-full text-ink-200"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <path
                    d="M0 80 C100 60 140 140 240 110 S380 60 400 90 M0 200 C120 170 180 250 280 220 S380 180 400 210 M60 0 C80 120 40 200 90 300 M300 0 C280 90 330 180 310 300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                  />
                </svg>
                <div className="relative grid justify-items-center gap-3">
                  <span className="grid size-14 place-items-center rounded-full bg-navy text-lime">
                    <Icon name="map-pin" size={26} />
                  </span>
                  {ctx.showPlaceholders ? (
                    <PendingChip hint="koordinat peta kampus" />
                  ) : (
                    <p className="font-semibold">Peta segera tersedia</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  )
}
