import { uiCopy } from '@/lib/i18n-copy'
import type { Metadata } from 'next'
import { Bricolage_Grotesque, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { LocaleLink as Link, LocaleProvider } from '@/components/providers/LocaleProvider'
import { getContentTranslator, translateContent } from '@/lib/content-translations'
import { bilingual, type Locale } from '@/lib/i18n'
import Script from 'next/script'
import React from 'react'
import { Analytics } from '@/components/layout/Analytics'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { LivePreviewListener } from '@/components/layout/LivePreviewListener'
import { StickyBar, WhatsAppFab } from '@/components/layout/StickyBar'
import { Siasat } from '@/components/mascot/Siasat'
import { MOTION_BOOT_SCRIPT, MotionProvider } from '@/components/providers/MotionProvider'
import { SiteProvider } from '@/components/providers/SiteProvider'
import { JsonLd } from '@/components/seo/JsonLd'
import { PROGRAM_MARK } from '@/lib/brand/artwork'
import { INSTITUTION_NAME, PROGRAM_NAME } from '@/lib/brand/identity'
import { brandCssVariables, resolveBrandColors } from '@/lib/brand/tokens'
import { getBranding, getNavigation, getPmbInfo, getSiteSettings, isDraftMode } from '@/lib/data'
import { BodyCustomCode, renderHeadCustomCode } from '@/lib/make-custom-code'
import { makeSiteSettings, sanitizeHtmlAttribute } from '@/lib/make-site-settings'
import { siteUrl } from '@/lib/preview'
import { buildFooterColumns, buildNav, buildSiteConfig, hasRealValue, intensity } from '@/lib/site'

const display = Bricolage_Grotesque({ subsets: ['latin'], axes: ['opsz'], variable: '--font-bricolage', display: 'swap' })
const body = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap', preload: false })

export async function publicLayoutMetadata(locale: Locale): Promise<Metadata> {
  const [rawSettings, branding, cmsTranslate] = await Promise.all([getSiteSettings(), getBranding(), getContentTranslator(locale)])
  const translate = (text: string) => uiCopy(locale, cmsTranslate(text))
  const settings = translateContent(rawSettings, translate)
  const defaultTitle = `${bilingual(locale, PROGRAM_NAME, 'BSc in Digital Business Management')} · ${settings.institutionName || INSTITUTION_NAME}`
  const description =
    settings.defaultDescription || makeSiteSettings.description || bilingual(locale, 'S1 Manajemen Bisnis Digital ISTTS', 'Digital Business Management at ISTTS')
  const ogImage = settings.defaultOgImage?.url || branding.ogDefault?.url || makeSiteSettings.openGraph?.image
  const favicon = branding.favicon?.url || makeSiteSettings.icons?.icon || PROGRAM_MARK
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: defaultTitle, template: settings.titleTemplate || '%s · MBD ISTTS' },
    description,
    applicationName: PROGRAM_NAME,
    robots: makeSiteSettings.robots?.index === false ? { index: false, follow: false } : undefined,
    icons: { icon: favicon },
    openGraph: {
      siteName: PROGRAM_NAME,
      locale: locale === 'en' ? 'en_US' : 'id_ID',
      type: 'website',
      title: defaultTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: ogImage ? { card: 'summary_large_image', images: [ogImage] } : undefined,
  }
}

function Maintenance({ settings, locale }: { settings: Record<string, any>; locale: Locale }) {
  const en = locale === 'en'
  return (
    <main id="konten" className="grid min-h-dvh place-items-center bg-navy px-6 text-center text-white">
      <div className="grid max-w-lg justify-items-center gap-5">
        <Siasat pose="thinking" size="lg" onDark />
        <p className="label-mono text-lime">{en ? 'Maintenance' : 'Sedang dirapikan'}</p>
        <h1 className="text-section font-bold">{en ? 'We’re updating the website' : 'Situs sedang kami perbarui'}</h1>
        <p className="text-white/75">
          {en ? 'Please check back shortly.' : 'Kami sedang menyusun strategi tampilan baru. Silakan kembali sebentar lagi.'}
          {hasRealValue(settings.email) ? ` Butuh bantuan? Hubungi ${settings.email}.` : ''}
        </p>
      </div>
    </main>
  )
}

export async function PublicLayout({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  const en = locale === 'en'
  const [rawSettings, branding, navigation, pmbInfo, draft, cmsTranslate] = await Promise.all([
    getSiteSettings(),
    getBranding(),
    getNavigation(),
    getPmbInfo().catch(() => null),
    isDraftMode(),
    getContentTranslator(locale),
  ])

  const translate = (text: string) => uiCopy(locale, cmsTranslate(text))
  const settings = translateContent(rawSettings, translate)
  const colors = resolveBrandColors(branding.colors)
  const patterns = (branding.patterns ?? {}) as Record<string, unknown>
  const patternCss = `:root{--pattern-wave:${intensity(patterns.waveIntensity)};--pattern-fin:${intensity(patterns.finIntensity)};--pattern-star:${intensity(patterns.starIntensity)}}`
  const config = translateContent(buildSiteConfig({ settings: rawSettings, branding, navigation, pmbInfo }), translate)
  const wordmarkUrl = branding.wordmarkDark?.url ?? null
  const integrations = (rawSettings.integrations ?? {}) as Record<string, string | undefined>
  const features = (rawSettings.features ?? {}) as Record<string, unknown>
  const customScripts = makeSiteSettings.customScripts
  const figmaAnalyticsId = sanitizeHtmlAttribute(makeSiteSettings.analytics?.googleAnalyticsId)
  const maintenance = Boolean(features.maintenanceMode) && !draft
  const socials = ((settings.socials as { url?: string }[]) ?? []).map((s) => s.url).filter(Boolean)

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: `${config.programName} · ${config.institutionName}`,
    url: siteUrl(),
    description: settings.shortDescription ?? undefined,
    parentOrganization: { '@type': 'CollegeOrUniversity', name: config.institutionName },
    ...(hasRealValue(settings.address) ? { address: { '@type': 'PostalAddress', streetAddress: settings.address, addressLocality: 'Surabaya', addressCountry: 'ID' } } : {}),
    ...(hasRealValue(settings.email) ? { email: settings.email } : {}),
    ...(hasRealValue(settings.phone) ? { telephone: settings.phone } : {}),
    ...(socials.length ? { sameAs: socials } : {}),
  }

  return (
    <html
      lang={locale}
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      data-default-motion={features.defaultReducedMotion ? 'reduce' : 'full'}
      data-wave={patterns.waveEnabled === false ? 'off' : undefined}
      data-fin={patterns.finEnabled === false ? 'off' : undefined}
      data-star={patterns.starEnabled === false ? 'off' : undefined}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
        <style dangerouslySetInnerHTML={{ __html: brandCssVariables(colors) + patternCss }} />
        {renderHeadCustomCode(customScripts?.headStart, 'head-start')}
        {renderHeadCustomCode(customScripts?.headEnd, 'head-end')}
        {renderHeadCustomCode(integrations.customHeadScripts, 'head-end')}
      </head>
      <body className="min-h-dvh bg-white font-body text-navy antialiased">
        <BodyCustomCode html={customScripts?.bodyStart} />
        <a
          href="#konten"
          className="sr-only z-[100] rounded-full border-2 border-navy bg-lime px-5 py-3 font-semibold text-navy focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {en ? 'Skip to main content' : 'Lewati ke konten utama'}
        </a>
        <div id="root">
          <LocaleProvider locale={locale}>
          <MotionProvider>
            <SiteProvider config={config}>
              {maintenance ? (
                <Maintenance settings={settings} locale={locale} />
              ) : (
                <>
                  <Header items={translateContent(buildNav(navigation.header), translate)} logoUrl={wordmarkUrl} />
                  <main id="konten" tabIndex={-1} className="outline-none">
                    {children}
                  </main>
                  <Footer
                    columns={translateContent(buildFooterColumns(navigation.footerColumns), translate)}
                    locale={locale}
                    logoUrl={wordmarkUrl}
                    settings={settings}
                    showPlaceholders={config.showPlaceholders}
                    privacyHref={config.privacyHref}
                    termsHref={config.termsHref}
                  />
                  <StickyBar />
                  <WhatsAppFab />
                </>
              )}
              <Analytics ga4Id={integrations.ga4Id} metaPixelId={integrations.metaPixelId} />
              {draft ? (
                <>
                  <LivePreviewListener serverURL={siteUrl()} />
                  <p className="fixed bottom-4 left-4 z-[60] flex items-center gap-3 rounded-full border-2 border-navy bg-amber px-4 py-2 text-sm font-semibold text-navy shadow-hard-sm">
                    {en ? 'Draft preview' : 'Mode pratinjau draf'}
                    <Link href="/pratinjau/keluar" prefetch={false} className="underline underline-offset-2">
                      {en ? 'Exit' : 'Keluar'}
                    </Link>
                  </p>
                </>
              ) : null}
            </SiteProvider>
          </MotionProvider>
          </LocaleProvider>
        </div>
        {figmaAnalyticsId && figmaAnalyticsId !== integrations.ga4Id ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${figmaAnalyticsId}`} strategy="afterInteractive" />
            <Script id="figma-google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('js', new Date());gtag('config', ${JSON.stringify(figmaAnalyticsId)});`}
            </Script>
          </>
        ) : null}
        <JsonLd data={organization} />
        <BodyCustomCode html={customScripts?.bodyEnd} />
        <BodyCustomCode html={integrations.customBodyScripts} />
      </body>
    </html>
  )
}
