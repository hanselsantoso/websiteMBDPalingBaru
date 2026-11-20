'use client'

import { domAnimation, LazyMotion } from 'motion/react'
import { SiasatArt, type SiasatPose } from '@/components/mascot/SiasatArt'

export function SiasatBadge({ pose = 'greeting' }: { pose?: SiasatPose }) {
  return (
    <LazyMotion features={domAnimation}>
      <SiasatArt pose={pose} onDark animated />
    </LazyMotion>
  )
}
