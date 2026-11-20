'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { BrochureModal } from '@/components/cta/BrochureModal'

export type MascotPoseAsset = { url: string | null; url2x: string | null; alt: string | null }

export type SiteConfig = {
  siteName: string
  programName: string
  institutionName: string
  showPlaceholders: boolean
  showTotalSks: boolean
  privacyHref: string
  termsHref: string
  turnstileSiteKey: string | null
  cta: {
    primaryLabel: string
    primaryHref: string
    primaryExternal: boolean
    whatsappHref: string | null
    whatsappLabel: string
    quizLabel: string
    quizHref: string
    brochureLabel: string
    hasBrochure: boolean
  }
  mascot: {
    name: string
    nickname: string
    poses: Record<string, MascotPoseAsset>
    lines: { pose: string; text: string }[]
    eyeFollow: boolean
    tapToTalk: boolean
    idleAnimation: boolean
  }
  deadline: { label: string; date: string | null; waveName: string | null } | null
  mobileBar: { enabled: boolean; items: { kind: string; label: string }[] }
}

export type Utm = { utmSource?: string; utmMedium?: string; utmCampaign?: string }

type SiteContextValue = SiteConfig & {
  openBrochure: (placement?: string) => void
  isOtherPrimaryVisible: (selfId?: string) => boolean
  setPrimaryVisibility: (id: string, visible: boolean) => void
  stickySuppressed: boolean
  setStickySuppressed: (value: boolean) => void
  utm: Utm
}

const SiteContext = createContext<SiteContextValue | null>(null)

export function useSite(): SiteContextValue {
  const value = useContext(SiteContext)
  if (!value) throw new Error('useSite harus dipakai di dalam SiteProvider')
  return value
}

function readUtm(): Utm {
  try {
    const params = new URLSearchParams(window.location.search)
    const fromUrl: Utm = {
      utmSource: params.get('utm_source') ?? undefined,
      utmMedium: params.get('utm_medium') ?? undefined,
      utmCampaign: params.get('utm_campaign') ?? undefined,
    }
    if (fromUrl.utmSource || fromUrl.utmMedium || fromUrl.utmCampaign) {
      sessionStorage.setItem('arus-utm', JSON.stringify(fromUrl))
      return fromUrl
    }
    return JSON.parse(sessionStorage.getItem('arus-utm') ?? '{}') as Utm
  } catch {
    return {}
  }
}

export function SiteProvider({ config, children }: { config: SiteConfig; children: ReactNode }) {
  const [brochurePlacement, setBrochurePlacement] = useState<string | null>(null)
  const [visiblePrimaries, setVisiblePrimaries] = useState<string[]>([])
  const [stickySuppressed, setStickySuppressed] = useState(false)
  const [utm, setUtm] = useState<Utm>({})
  const pending = useRef(new Map<string, boolean>())

  useEffect(() => setUtm(readUtm()), [])

  const setPrimaryVisibility = useCallback((id: string, visible: boolean) => {
    pending.current.set(id, visible)
    setVisiblePrimaries((current) => {
      const has = current.includes(id)
      if (visible && !has) return [...current, id]
      if (!visible && has) return current.filter((item) => item !== id)
      return current
    })
  }, [])

  const isOtherPrimaryVisible = useCallback(
    (selfId?: string) => visiblePrimaries.some((id) => id !== selfId),
    [visiblePrimaries],
  )

  const value = useMemo<SiteContextValue>(
    () => ({
      ...config,
      openBrochure: (placement?: string) => setBrochurePlacement(placement ?? 'umum'),
      isOtherPrimaryVisible,
      setPrimaryVisibility,
      stickySuppressed,
      setStickySuppressed,
      utm,
    }),
    [config, isOtherPrimaryVisible, setPrimaryVisibility, stickySuppressed, utm],
  )

  return (
    <SiteContext.Provider value={value}>
      {children}
      <BrochureModal placement={brochurePlacement} onClose={() => setBrochurePlacement(null)} />
    </SiteContext.Provider>
  )
}
