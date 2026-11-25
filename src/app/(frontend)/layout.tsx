import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import Link from 'next/link'
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
import { ARUS_MARK } from '@/lib/brand/artwork'
import { brandCssVariables, resolveBrandColors } from '@/lib/brand/tokens'
import { getBranding, getNavigation, getPmbInfo, getSiteSettings, isDraftMode } from '@/lib/data'
import { BodyCustomCode, renderHeadCustomCode } from '@/lib/make-custom-code'
import { makeSiteSettings, sanitizeHtmlAttribute } from '@/lib/make-site-settings'
import { siteUrl } from '@/lib/preview'
import { buildFooterColumns, buildNav, buildSiteConfig, hasRealValue, intensity } from '@/lib/site'
import './styles.css'

const display = Bricolage_Grotesque({ subsets: ['latin'], axes: ['opsz'], variable: '--font-bricolage', display: 'swap' })
const body = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap', preload: false })

export const viewport: Viewport = {
  themeColor: '#071A3D',
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
  const [settings, branding] = await Promise.all([getSiteSettings(), getBranding()])
  const siteName = settings.siteName || 'Arus Digital'
  const defaultTitle = `${settings.programName || 'S1 Manajemen Bisnis Digital'} ISTTS · ${siteName}`
  const description =
    settings.defaultDescription || makeSiteSettings.description || 'S1 Manajemen Bisnis Digital ISTTS: jadi strategis bisnis di era digital.'
  const ogImage = settings.defaultOgImage?.url || branding.ogDefault?.url || makeSiteSettings.openGraph?.image
  const favicon = branding.favicon?.url || makeSiteSettings.icons?.icon || ARUS_MARK
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: defaultTitle, template: settings.titleTemplate || '%s · MBD ISTTS' },
    description,
    applicationName: siteName,
    robots: makeSiteSettings.robots?.index === false ? { index: false, follow: false } : undefined,
    icons: { icon: favicon },
    openGraph: {
      siteName,
      locale: 'id_ID',
      type: 'website',
      title: defaultTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: ogImage ? { card: 'summary_large_image', images: [ogImage] } : undefined,
  }
}

function Maintenance({ settings }: { settings: Record<string, any> }) {
  return (
    <main id="konten" className="grid min-h-dvh place-items-center bg-navy px-6 text-center text-white">
      <div className="grid max-w-lg justify-items-center gap-5">
        <Siasat pose="thinking" size="lg" onDark />
        <p className="label-mono text-lime">Sedang dirapikan</p>
        <h1 className="text-section font-bold">Situs sedang kami perbarui</h1>
        <p className="text-white/75">
          Kami sedang menyusun strategi tampilan baru. Silakan kembali sebentar lagi.
          {hasRealValue(settings.email) ? ` Butuh bantuan? Hubungi ${settings.email}.` : ''}
        </p>
      </div>
    </main>
  )
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, branding, navigation, pmbInfo, draft] = await Promise.all([
    getSiteSettings(),
    getBranding(),
    getNavigation(),
    getPmbInfo().catch(() => null),
    isDraftMode(),
  ])

  const colors = resolveBrandColors(branding.colors)
  const patterns = (branding.patterns ?? {}) as Record<string, unknown>
  const patternCss = `:root{--pattern-wave:${intensity(patterns.waveIntensity)};--pattern-fin:${intensity(patterns.finIntensity)};--pattern-star:${intensity(patterns.starIntensity)}}`
  const config = buildSiteConfig({ settings, branding, navigation, pmbInfo })
  const integrations = (settings.integrations ?? {}) as Record<string, string | undefined>
  const features = (settings.features ?? {}) as Record<string, unknown>
  const language = sanitizeHtmlAttribute(makeSiteSettings.language) || 'id'
  const customScripts = makeSiteSettings.customScripts
  const figmaAnalyticsId = sanitizeHtmlAttribute(makeSiteSettings.analytics?.googleAnalyticsId)
  const maintenance = Boolean(features.maintenanceMode) && !draft
  const socials = ((settings.socials as { url?: string }[]) ?? []).map((s) => s.url).filter(Boolean)

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: `${config.programName} · ${config.institutionName}`,
    alternateName: config.siteName,
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
      lang={language}
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
          Lewati ke konten utama
        </a>
        <div id="root">
          <MotionProvider>
            <SiteProvider config={config}>
              {maintenance ? (
                <Maintenance settings={settings} />
              ) : (
                <>
                  <Header items={buildNav(navigation.header)} logoUrl={branding.wordmarkDark?.url ?? null} />
                  <main id="konten" tabIndex={-1} className="outline-none">
                    {children}
                  </main>
                  <Footer
                    columns={buildFooterColumns(navigation.footerColumns)}
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
                    Mode pratinjau draf
                    <Link href="/pratinjau/keluar" prefetch={false} className="underline underline-offset-2">
                      Keluar
                    </Link>
                  </p>
                </>
              ) : null}
            </SiteProvider>
          </MotionProvider>
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
