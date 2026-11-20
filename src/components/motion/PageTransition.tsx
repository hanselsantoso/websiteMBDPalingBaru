'use client'

import { m } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { easeSoft } from '@/lib/motion'

let hydrated = false

/** Fades routes in on client navigation only; the first load is never hidden. */
export function PageTransition({ children }: { children: ReactNode }) {
  const [animateIn] = useState(() => typeof window !== 'undefined' && hydrated)
  useEffect(() => {
    hydrated = true
  }, [])
  return (
    <m.div initial={animateIn ? { opacity: 0, y: 14 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: easeSoft }}>
      {children}
    </m.div>
  )
}
