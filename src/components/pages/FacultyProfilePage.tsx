import { uiCopy } from '@/lib/i18n-copy'
import { getContentTranslator, translateContent } from '@/lib/content-translations'
import { withLocale, type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'
import { LocaleLink as Link } from '@/components/providers/LocaleProvider'
import { facultyDisplayName, Portrait } from '@/components/cards/Cards'
import { siteFlags } from '@/components/pages/CmsPage'
import { DetailCta } from '@/components/pages/DetailCta'
import { Star } from '@/components/patterns/Patterns'
import { JsonLd } from '@/components/seo/JsonLd'
import { Icon } from '@/components/ui/Icon'
import { PendingChip, TextOr } from '@/components/ui/Isi'
import { getFacultyMember, getFacultySlugs, getSiteSettings, isDraftMode } from '@/lib/data'
import { displayCourseCode } from '@/lib/domain/curriculum'
import { isPlaceholder } from '@/lib/domain/placeholders'
import { notFoundOrRedirect } from '@/lib/routing'
import { absoluteUrl, breadcrumbLd, docMetadata } from '@/lib/seo'
import { asMedia } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> }
type Doc = Record<string, any>

const LINK_LABELS: Record<string, string> = {
  sinta: 'SINTA',
  scholar: 'Google Scholar',
  linkedin: 'LinkedIn',
  website: 'Situs pribadi',
}

export async function pageStaticParams() {
  const slugs = await getFacultySlugs()
  return slugs.map((slug) => ({ slug }))
}

async function loadMember(slug: string) {
  return getFacultyMember(slug, await isDraftMode())
}

const realText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '' && !isPlaceholder(value)

export async function pageMetadata(params: Props['params'], locale: Locale): Promise<Metadata> {
  const copy = (text: string) => uiCopy(locale, text)
  const { slug } = await params
  const [rawmember, rawSettings, t] = await Promise.all([loadMember(slug), getSiteSettings(), getContentTranslator(locale)])
  const member = translateContent(rawmember, t)
  const settings = translateContent(rawSettings, t)
  if (!member) return { title: copy("Halaman tidak ditemukan") }
  const name = facultyDisplayName(member)
  return docMetadata({
    locale,
    doc: member,
    path: `/dosen/${member.slug}`,
    fallbackTitle: `${name} · Dosen MBD`,
    fallbackDescription: realText(member.bio)
      ? member.bio
      : `Profil ${name}, dosen S1 Manajemen Bisnis Digital ISTTS.`,
    fallbackImage: member.photo ?? settings.defaultOgImage,
    type: 'profile',
  })
}

export default async function FacultyProfilePage({ params, locale }: Props & { locale: Locale }) {
  const copy = (text: string) => uiCopy(locale, text)
  const { slug } = await params
  const [rawmember, rawSettings, t] = await Promise.all([loadMember(slug), getSiteSettings(), getContentTranslator(locale)])
  const member = translateContent(rawmember, t)
  const settings = translateContent(rawSettings, t)
  if (!member) return notFoundOrRedirect(`/dosen/${slug}`, locale)

  const { showPlaceholders } = siteFlags(settings)
  const name = facultyDisplayName(member)
  const path = `/dosen/${member.slug}`
  const expertise = ((member.expertise as string[] | null) ?? []).filter(
    (item) => showPlaceholders || !isPlaceholder(item),
  )
  const education = ((member.education as Doc[] | null) ?? []).filter(
    (item) => showPlaceholders || !isPlaceholder(item.degree),
  )
  const publications = ((member.publications as Doc[] | null) ?? []).filter(
    (item) => showPlaceholders || !isPlaceholder(item.title),
  )
  const courses = ((member.coursesTaught?.docs as unknown[] | undefined) ?? []).filter(
    (item): item is Doc => Boolean(item) && typeof item === 'object',
  )
  const linkGroup = (member.links ?? {}) as Record<string, string | null | undefined>
  const links = Object.entries(LINK_LABELS)
    .map(([key, label]) => ({ key, label, href: linkGroup[key] }))
    .filter(
      (link): link is { key: string; label: string; href: string } =>
        realText(link.href) && /^https?:\/\//i.test(link.href),
    )
  const email = member.showEmail && realText(member.email) ? member.email : null
  const photo = asMedia(member.photo)
  const meta = (member.meta ?? {}) as Doc

  return (
    <article>
      {meta.jsonLd !== false ? (
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: member.name,
              ...(realText(member.titleFront) ? { honorificPrefix: member.titleFront } : {}),
              ...(realText(member.titleBack) ? { honorificSuffix: member.titleBack } : {}),
              ...(realText(member.position) ? { jobTitle: member.position } : {}),
              ...(realText(member.bio) ? { description: member.bio } : {}),
              ...(photo?.url ? { image: absoluteUrl(photo.url) } : {}),
              ...(email ? { email } : {}),
              ...(expertise.filter(realText).length
                ? { knowsAbout: expertise.filter(realText) }
                : {}),
              ...(links.length ? { sameAs: links.map((link) => link.href) } : {}),
              url: absoluteUrl(withLocale(path, locale)),
              worksFor: {
                '@type': 'CollegeOrUniversity',
                name: settings.institutionName ?? 'ISTTS',
              },
            },
            breadcrumbLd([
              { name: t('Beranda'), path: withLocale('/', locale) },
              { name: t('Dosen'), path: withLocale('/dosen', locale) },
              { name: String(member.name ?? ''), path },
            ]),
          ]}
        />
      ) : null}

      <header className="relative overflow-hidden bg-ink-50 py-12 lg:py-20">
        <div className="container-arus grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Portrait locale={locale}
              photo={member.photo}
              name={String(member.name ?? '')}
              sizes="(min-width: 1024px) 440px, 90vw"
              priority
              className="mx-auto max-w-[26rem] shadow-hard-lg"
            />
          </div>
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb">
              <ol className="label-mono flex flex-wrap items-center gap-2 text-ink-600">
                <li>
                  <Link href="/" className="hover:text-blue">{copy("Beranda")}</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/dosen" className="hover:text-blue">{copy("Dosen")}</Link>
                </li>
              </ol>
            </nav>
            <p className="label-mono mt-6 text-blue">
              <TextOr
                value={member.position}
                show={showPlaceholders}
                hint={copy("jabatan akademik")}
                fallback="Dosen"
              />
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.25rem,1.5rem+3.4vw,4.25rem)] leading-[1.02] font-extrabold tracking-[-0.03em]">
              <TextOr value={name} show={showPlaceholders} hint={copy("nama dosen")} />
            </h1>
            {expertise.length ? (
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={copy("Bidang keahlian")}>
                {expertise.map((item) => (
                  <li
                    key={item}
                    className="label-mono rounded-full border-2 border-navy bg-white px-3 py-1"
                  >
                    {isPlaceholder(item) ? <PendingChip hint={copy("keahlian")} /> : item}
                  </li>
                ))}
              </ul>
            ) : null}
            {member.bio && (showPlaceholders || !isPlaceholder(member.bio)) ? (
              <p className="mt-6 max-w-2xl text-lead text-ink-700">
                <TextOr value={member.bio} show={showPlaceholders} hint="bio" />
              </p>
            ) : null}
            {email || links.length ? (
              <ul className="mt-7 flex flex-wrap gap-2">
                {email ? (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="pill border-2 border-navy bg-navy text-white hover:bg-blue"
                    >
                      <Icon name="mail" size={18} /> {email}
                    </a>
                  </li>
                ) : null}
                {links.map((link) => (
                  <li key={link.key}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pill border-2 border-navy bg-white text-navy hover:bg-ink-100"
                    >
                      {link.label} <Icon name="external" size={16} />
                      <span className="sr-only">{copy("(membuka tab baru)")}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {realText(member.nidn) ? (
              <p className="label-mono mt-6 text-ink-600">NIDN {member.nidn}</p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="container-arus grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
        <div className="grid gap-12 lg:col-span-7">
          <section aria-labelledby="pendidikan">
            <h2 id="pendidikan" className="text-title font-bold">{copy("Pendidikan")}</h2>
            {education.length ? (
              <ol className="mt-6 grid gap-6 border-l-2 border-dashed border-navy pl-7">
                {education.map((item, index) => (
                  <li key={item.id ?? index} className="relative">
                    <Star className="absolute top-1 -left-[2.3rem] size-4 bg-white text-blue" />
                    {realText(item.year) ? (
                      <p className="label-mono text-blue">{item.year}</p>
                    ) : null}
                    <p className="text-lg font-bold">
                      {isPlaceholder(item.degree) ? (
                        <PendingChip hint={copy("jenjang & bidang")} />
                      ) : (
                        item.degree
                      )}
                    </p>
                    {item.institution ? (
                      <p className="text-ink-600">
                        <TextOr value={item.institution} show={showPlaceholders} hint={copy("institusi")} />
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-ink-600">{copy("Riwayat pendidikan menyusul.")}</p>
            )}
          </section>
          <section aria-labelledby="publikasi">
            <h2 id="publikasi" className="text-title font-bold">{copy("Publikasi pilihan")}</h2>
            {publications.length ? (
              <ul className="mt-6 grid gap-3">
                {publications.map((item, index) => (
                  <li key={item.id ?? index} className="rounded-2xl border-2 border-navy p-4">
                    {realText(item.year) ? (
                      <p className="label-mono text-blue">{item.year}</p>
                    ) : null}
                    {isPlaceholder(item.title) ? (
                      <PendingChip hint={copy("judul publikasi")} />
                    ) : realText(item.url) && /^https?:\/\//i.test(item.url) ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline decoration-navy/30 underline-offset-4 hover:decoration-blue"
                      >
                        {item.title}
                        <span className="sr-only">{" " + copy("(membuka tab baru)")}</span>
                      </a>
                    ) : (
                      <p className="font-semibold">{item.title}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-ink-600">{copy("Daftar publikasi menyusul.")}</p>
            )}
          </section>
        </div>
        <aside className="lg:col-span-5">
          <section aria-labelledby="mengajar" className="sticker p-6 lg:sticky lg:top-28">
            <h2 id="mengajar" className="text-xl font-bold">{copy("Mengajar di MBD")}</h2>
            {courses.length ? (
              <ul className="mt-4 grid gap-2">
                {courses.map((course) => (
                  <li key={course.id}>
                    <Link
                      href={`/kurikulum/${course.slug}`}
                      className="flex min-h-12 items-center gap-3 rounded-xl border-2 border-navy px-3 font-semibold hover:bg-ink-50"
                    >
                      <span className="font-mono text-xs text-blue">
                        {displayCourseCode(course.code)}
                      </span>
                      <span className="flex-1">{course.name}</span>
                      <Icon name="arrow-right" size={16} strokeWidth={2.5} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-ink-600">
                {showPlaceholders ? (
                  <PendingChip hint={copy("mata kuliah yang diampu")} />
                ) : (
                  'Informasi mata kuliah menyusul.'
                )}
              </p>
            )}
            <Link
              href="/dosen"
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-blue hover:underline"
            >
              <Icon name="arrow-left" size={16} strokeWidth={2.5} />{" " + copy("Semua dosen")}</Link>
          </section>
        </aside>
      </div>

      <DetailCta
        id="faculty-detail"
        title={copy("Belajar langsung dari praktisi dan peneliti.")}
        body={copy("Daftar sekarang atau tanya dulu soal kelas dan dosen lewat WhatsApp.")}
      />
    </article>
  )
}
