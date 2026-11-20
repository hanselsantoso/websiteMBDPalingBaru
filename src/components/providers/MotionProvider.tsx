'use client'

import { domAnimation, LazyMotion, MotionConfig } from 'motion/react'
import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from 'react'

const EVENT = 'arus-motion-change'
const STORAGE_KEY = 'arus-motion'

function osPrefersReduced(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Mirrors the inline head script: OS setting, saved choice, then the CMS default. */
export function resolveMotion(): 'full' | 'reduce' {
  const root = document.documentElement
  let saved: string | null = null
  try {
    saved = localStorage.getItem(STORAGE_KEY)
  } catch {
    saved = null
  }
  const cmsDefaultReduce = root.dataset.defaultMotion === 'reduce'
  return osPrefersReduced() || saved === 'reduce' || (saved === null && cmsDefaultReduce) ? 'reduce' : 'full'
}

function subscribe(callback: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  const onMedia = () => {
    document.documentElement.dataset.motion = resolveMotion()
    callback()
  }
  window.addEventListener(EVENT, callback)
  media.addEventListener('change', onMedia)
  return () => {
    window.removeEventListener(EVENT, callback)
    media.removeEventListener('change', onMedia)
  }
}

const getSnapshot = () => document.documentElement.dataset.motion !== 'full'
const getServerSnapshot = () => false

type MotionPreference = {
  reduced: boolean
  osReduced: boolean
  setReduced: (value: boolean) => void
}

const MotionContext = createContext<MotionPreference>({ reduced: false, osReduced: false, setReduced: () => {} })

export function useMotionPreference() {
  return useContext(MotionContext)
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const osReduced = useSyncExternalStore(subscribe, osPrefersReduced, () => false)

  const setReduced = useCallback((value: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, value ? 'reduce' : 'full')
    } catch {
      // storage blocked; still apply for this page view
    }
    document.documentElement.dataset.motion = value || osPrefersReduced() ? 'reduce' : 'full'
    window.dispatchEvent(new Event(EVENT))
  }, [])

  return (
    <MotionContext.Provider value={{ reduced, osReduced, setReduced }}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>{children}</MotionConfig>
      </LazyMotion>
    </MotionContext.Provider>
  )
}

/** Inline, render-blocking script: sets data-motion before first paint (no layout shift). */
export const MOTION_BOOT_SCRIPT = `(function(){try{var d=document.documentElement;var s=null;try{s=localStorage.getItem('${STORAGE_KEY}')}catch(e){}var os=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var def=d.getAttribute('data-default-motion')==='reduce';d.setAttribute('data-motion',(os||s==='reduce'||(s===null&&def))?'reduce':'full');d.classList.add('js')}catch(e){}})();`
