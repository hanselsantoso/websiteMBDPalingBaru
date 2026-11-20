'use client'

import { m, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Siasat } from '@/components/mascot/Siasat'
import { useMotionPreference } from '@/components/providers/MotionProvider'
import type { SiasatPose } from '@/lib/brand/mascot'
import { cn } from '@/lib/utils'

const CHIPS = [
  { position: 'left-[-6%] top-[8%]', style: '-rotate-6 border-navy bg-lime text-navy' },
  { position: 'right-[-4%] top-[18%]', style: 'rotate-3 border-white/80 bg-transparent text-white' },
  { position: 'left-[-2%] bottom-[26%]', style: 'rotate-2 border-white/80 bg-blue text-white' },
  { position: 'right-[2%] bottom-[12%]', style: '-rotate-3 border-cyan bg-navy text-cyan' },
]

export function HeroVisual({ pose, chips }: { pose: SiasatPose; chips: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced } = useMotionPreference()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const fast = useTransform(scrollYProgress, [0, 1], [0, -90])
  const slow = useTransform(scrollYProgress, [0, 1], [0, -40])
  const mascotY = useTransform(scrollYProgress, [0, 1], [0, 30])

  return (
    <div ref={ref} className="relative mx-auto w-fit pt-6">
      <m.div style={reduced ? undefined : { y: mascotY }}>
        <Siasat pose={pose} size="xl" interactive onDark priority showArtTag />
      </m.div>
      {chips.slice(0, 4).map((chip, index) => (
        <m.span
          key={chip + index}
          aria-hidden="true"
          style={reduced ? undefined : { y: index % 2 === 0 ? fast : slow }}
          className={cn('absolute z-10', CHIPS[index % CHIPS.length].position)}
        >
          <span
            className={cn(
              'anim-float label-mono inline-flex items-center rounded-full border-2 px-4 py-2 text-[0.8125rem] font-bold shadow-[3px_3px_0_0_rgb(0_0_0/0.25)]',
              CHIPS[index % CHIPS.length].style,
            )}
            style={{ ['--float-delay' as string]: `${index * 0.7}s` }}
          >
            {chip}
          </span>
        </m.span>
      ))}
    </div>
  )
}
