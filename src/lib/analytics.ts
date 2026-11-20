'use client'

import type { TrackedEvent } from './schemas'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function sessionId(): string {
  try {
    let id = sessionStorage.getItem('arus-sid')
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36)
      sessionStorage.setItem('arus-sid', id)
    }
    return id
  } catch {
    return 'anon'
  }
}

const FB_EVENTS: Partial<Record<TrackedEvent, string>> = {
  cta_register_click: 'Lead',
  pmb_submit: 'CompleteRegistration',
  contact_submit: 'Contact',
  brochure_download: 'Lead',
}

/** Sends an event to GA4 / Meta Pixel (when configured) and to the CMS dashboard. */
export function track(name: TrackedEvent, props: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return
  try {
    window.gtag?.('event', name, props)
    const fbEvent = FB_EVENTS[name]
    if (fbEvent) window.fbq?.('track', fbEvent, props)
  } catch {
    // analytics must never break the UI
  }
  try {
    const body = JSON.stringify({
      name,
      path: window.location.pathname,
      sessionId: sessionId(),
      referrer: document.referrer ? document.referrer.slice(0, 300) : undefined,
      props,
    })
    const blob = new Blob([body], { type: 'application/json' })
    if (!navigator.sendBeacon?.('/api/v1/events', blob)) {
      void fetch('/api/v1/events', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true })
    }
  } catch {
    // ignore
  }
}
