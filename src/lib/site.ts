import { canonicalCrewHref, pivotDisplayName } from '@/lib/brand/crew'
import type { NavItem } from '@/components/layout/Header'
import type { FooterColumn } from '@/components/layout/Footer'
import type { SiteConfig } from '@/components/providers/SiteProvider'
import { INSTITUTION_NAME, PROGRAM_NAME } from '@/lib/brand/identity'
import { SIASAT_POSES } from '@/lib/brand/mascot'
import { waLink } from '@/lib/domain/phone'
import { isPlaceholder } from '@/lib/domain/placeholders'
import { resolveHref, type CmsLink } from '@/lib/links'
import type { PmbInfo } from '@/lib/queries'

type Doc = Record<string, any>

const pageHref = (value: unknown, fallback: string) =>
  value && typeof value === 'object' && (value as { slug?: string }).slug ? `/${(value as { slug: string }).slug}` : fallback

export function buildNav(items: CmsLink[] | null | undefined): NavItem[] {
  return (items ?? [])
    .filter((item) => item.isVisible !== false && item.label)
    .map((item) => ({
      label: String(item.label),
      href: canonicalCrewHref(resolveHref(item)),
      newTab: Boolean(item.newTab),
      asButton: Boolean(item.asButton),
      children: (item.children ?? [])
        .filter((child) => child.isVisible !== false && child.label)
        .map((child) => ({ label: String(child.label), href: canonicalCrewHref(resolveHref(child)), newTab: Boolean(child.newTab) })),
    }))
}

export function buildFooterColumns(columns: Doc[] | null | undefined): FooterColumn[] {
  return (columns ?? []).map((column) => ({
    title: String(column.title ?? ''),
    links: ((column.links as CmsLink[]) ?? [])
      .filter((link) => link.isVisible !== false && link.label)
      .map((link) => ({ label: String(link.label), href: canonicalCrewHref(resolveHref(link)), newTab: Boolean(link.newTab) })),
  }))
}

export function buildSiteConfig({
  settings,
  branding,
  navigation,
  pmbInfo,
}: {
  settings: Doc
  branding: Doc
  navigation: Doc
  pmbInfo: PmbInfo | null
}): SiteConfig {
  const features = (settings.features ?? {}) as Doc
  const cta = (navigation.cta ?? {}) as Doc
  const external = String(features.externalRegistrationUrl ?? '').trim()
  const primaryExternal = /^https?:\/\//i.test(external)
  const poses = (branding.poses ?? {}) as Doc
  const settingsMascot = (branding.mascotSettings ?? {}) as Doc
  const brochure = cta.brochureFile
  const activeWave = pmbInfo?.activeWave ?? null

  return {
    siteName: PROGRAM_NAME,
    programName: PROGRAM_NAME,
    institutionName: settings.institutionName || INSTITUTION_NAME,
    showPlaceholders: features.showPlaceholders !== false,
    showTotalSks: features.showTotalSks === true,
    privacyHref: pageHref(settings.privacyPage, '/kebijakan-privasi'),
    termsHref: pageHref(settings.termsPage, '/syarat-ketentuan'),
    turnstileSiteKey: settings.integrations?.turnstileSiteKey?.trim() || null,
    cta: {
      primaryLabel: cta.primaryLabel || 'Daftar Sekarang',
      primaryHref: primaryExternal ? external : cta.primaryPath || '/pmb',
      primaryExternal,
      whatsappHref: waLink(cta.whatsappNumber, cta.whatsappMessage),
      whatsappLabel: cta.whatsappLabel || 'Chat via WhatsApp',
      quizLabel: cta.quizLabel || 'Cari Jurusan yang Cocok',
      quizHref: '/kuis',
      brochureLabel: cta.brochureLabel || 'Unduh Brosur',
      hasBrochure: Boolean(brochure),
    },
    mascot: {
      name: pivotDisplayName(branding.mascotName),
      nickname: pivotDisplayName(branding.mascotNickname),
      poses: Object.fromEntries(
        SIASAT_POSES.map((pose) => {
          const value = (poses[pose] ?? {}) as Doc
          return [pose, { url: value.image?.url ?? null, url2x: value.image2x?.url ?? null, alt: value.alt ?? null }]
        }),
      ),
      lines: ((branding.lines as Doc[]) ?? [])
        .filter((line) => line.isActive !== false && line.text)
        .map((line) => ({ pose: String(line.pose), text: String(line.text) })),
      eyeFollow: settingsMascot.eyeFollow !== false,
      tapToTalk: settingsMascot.tapToTalk !== false,
      idleAnimation: settingsMascot.idleAnimation !== false,
    },
    deadline: activeWave
      ? {
          label: 'Batas akhir pendaftaran',
          date: activeWave.closeDate ?? null,
          waveName: activeWave.name ?? null,
        }
      : null,
    mobileBar: {
      enabled: navigation.mobileBar?.enabled !== false,
      items: ((navigation.mobileBar?.items as Doc[]) ?? [])
        .filter((item) => item.isVisible !== false)
        .map((item) => ({ kind: String(item.kind), label: String(item.label ?? '') })),
    },
  }
}

export function intensity(value: unknown): string {
  const n = Number(value)
  return Number.isFinite(n) ? String(Math.min(1, Math.max(0, n / 100))) : '0.7'
}

export function hasRealValue(value: unknown): value is string {
  return typeof value === 'string' && !isPlaceholder(value)
}
