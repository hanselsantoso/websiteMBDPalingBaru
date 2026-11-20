'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useRef } from 'react'
import { track } from '@/lib/analytics'

const SAFE_ID = /^[A-Za-z0-9_-]+$/

export function Analytics({ ga4Id, metaPixelId }: { ga4Id?: string | null; metaPixelId?: string | null }) {
  const pathname = usePathname()
  const first = useRef(true)
  const ga = ga4Id && SAFE_ID.test(ga4Id) && !ga4Id.includes('ISI') ? ga4Id : null
  const pixel = metaPixelId && SAFE_ID.test(metaPixelId) && !metaPixelId.includes('ISI') ? metaPixelId : null

  useEffect(() => {
    try {
      if (!sessionStorage.getItem('arus-session-started')) {
        sessionStorage.setItem('arus-session-started', '1')
        track('session_start')
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    window.gtag?.('event', 'page_view', { page_path: pathname })
    window.fbq?.('track', 'PageView')
  }, [pathname])

  return (
    <>
      {ga ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="arus-ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      ) : null}
      {pixel ? (
        <Script id="arus-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}
        </Script>
      ) : null}
    </>
  )
}
