import Image from 'next/image'
import Link from 'next/link'
import { PrimaryCta, SecondaryActions } from '@/components/cta/CtaLinks'
import { Fin, StarField, Wave } from '@/components/patterns/Patterns'
import { Icon } from '@/components/ui/Icon'
import { PendingChip, TextOr } from '@/components/ui/Isi'
import { PROGRAM_WORDMARK } from '@/lib/brand/artwork'
import { INSTITUTION_NAME, PROGRAM_NAME } from '@/lib/brand/identity'
import { isExternalHref } from '@/lib/links'
import { asMedia } from '@/lib/utils'
import { ReducedMotionToggle } from './ReducedMotionToggle'

export type FooterColumn = { title: string; links: { label: string; href: string; newTab?: boolean }[] }

export function Footer({
  columns,
  logoUrl,
  settings,
  showPlaceholders,
  privacyHref,
  termsHref,
}: {
  columns: FooterColumn[]
  logoUrl: string | null
  settings: Record<string, any>
  showPlaceholders: boolean
  privacyHref: string
  termsHref: string
}) {
  const socials = (settings.socials as { platform: string; url: string }[]) ?? []
  const badge = asMedia(settings.accreditationBadge)
  const year = new Date().getFullYear()

  return (
    <footer data-site-footer className="relative text-white">
      <div data-footer-wave className="relative h-[clamp(56px,8vw,112px)] bg-white">
        <Wave preset="toNavyFromLight" />
      </div>
      <div className="relative overflow-hidden bg-navy pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
        <StarField tone="lime" count={5} className="opacity-60" />
        <Fin className="pattern-fin pointer-events-none absolute -right-10 bottom-24 size-72 text-white/[0.04]" />
        <div className="container-arus relative grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-5">
            <div className="flex items-start gap-3 sm:gap-4">
              {logoUrl ? (
                <Image src={logoUrl} alt="" width={180} height={40} className="h-9 w-auto max-w-[42%] shrink-0 object-contain object-left" />
              ) : (
                <span className="w-16 shrink-0 rounded-lg bg-[#fff7e7] px-1.5 py-2 sm:w-24">
                  <Image {...PROGRAM_WORDMARK} alt="" sizes="(min-width: 640px) 84px, 52px" className="h-auto w-full" />
                </span>
              )}
              <div>
                <p className="font-display text-[clamp(1.875rem,4vw,3.25rem)] leading-none font-extrabold tracking-[-0.04em]">
                  {PROGRAM_NAME}
                </p>
                <p className="label-mono mt-3 text-lime">{settings.institutionName || INSTITUTION_NAME}</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-white/75">{settings.shortDescription}</p>
            <div className="mt-8 grid gap-5">
              <PrimaryCta id="footer" placement="footer" hideWhenOtherVisible magnetic={false} />
              <SecondaryActions placement="footer" />
            </div>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="label-mono text-white/60">{column.title}</h2>
                <ul className="mt-4 grid gap-1">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        target={link.newTab || isExternalHref(link.href) ? '_blank' : undefined}
                        className="inline-flex min-h-10 items-center font-semibold text-white/90 hover:text-lime"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div className="sm:col-span-2 lg:col-span-3">
              <h2 className="label-mono text-white/60">Kontak</h2>
              <address className="mt-4 grid gap-3 not-italic text-white/90 sm:grid-cols-2">
                <p className="flex gap-3">
                  <Icon name="map-pin" size={20} className="mt-0.5 shrink-0 text-lime" />
                  <span>
                    <TextOr value={settings.address} show={showPlaceholders} hint="alamat kampus" />
                  </span>
                </p>
                <p className="flex gap-3">
                  <Icon name="phone" size={20} className="mt-0.5 shrink-0 text-lime" />
                  <span>
                    <TextOr value={settings.phone} show={showPlaceholders} hint="telepon" />
                  </span>
                </p>
                <p className="flex gap-3">
                  <Icon name="mail" size={20} className="mt-0.5 shrink-0 text-lime" />
                  <span className="break-all">
                    <TextOr value={settings.email} show={showPlaceholders} hint="email" />
                  </span>
                </p>
                <p className="flex gap-3">
                  <Icon name="clock" size={20} className="mt-0.5 shrink-0 text-lime" />
                  <span>
                    <TextOr value={settings.serviceHours} show={showPlaceholders} hint="jam layanan" />
                  </span>
                </p>
              </address>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {socials.length ? (
                  <ul className="flex flex-wrap gap-2" aria-label="Media sosial">
                    {socials.map((social) => (
                      <li key={social.url}>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="grid size-11 place-items-center rounded-full border-2 border-white/30 text-white hover:border-lime hover:text-lime"
                          aria-label={`${social.platform} MBD ISTTS`}
                        >
                          <Icon name={social.platform} size={20} />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : showPlaceholders ? (
                  <PendingChip hint="tautan media sosial" />
                ) : null}
                <div className="flex items-center gap-3">
                  {badge ? (
                    <Image src={badge.url!} alt={badge.alt || 'Badge akreditasi'} width={120} height={48} className="h-12 w-auto rounded bg-white p-1" />
                  ) : null}
                  <span className="text-sm text-white/75">
                    <TextOr value={settings.accreditationText} show={showPlaceholders} hint="status akreditasi" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-arus relative flex flex-col gap-4 border-t border-white/15 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-white/65">
            © {year} {settings.institutionName || INSTITUTION_NAME}.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/siasat" className="inline-flex min-h-11 items-center text-sm font-semibold text-white/85 hover:text-lime">
              Galeri Siasat
            </Link>
            <Link href={privacyHref} className="inline-flex min-h-11 items-center text-sm font-semibold text-white/85 hover:text-lime">
              Kebijakan privasi
            </Link>
            <Link href={termsHref} className="inline-flex min-h-11 items-center text-sm font-semibold text-white/85 hover:text-lime">
              Syarat dan ketentuan
            </Link>
            <ReducedMotionToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
