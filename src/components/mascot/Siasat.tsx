'use client'

import { AnimatePresence, m, useAnimate, useScroll, useTransform } from 'motion/react'
import Image from '@/components/ui/CmsImage'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useMotionPreference } from '@/components/providers/MotionProvider'
import { useSite } from '@/components/providers/SiteProvider'
import type { SiasatClipName } from '@/lib/brand/animation'
import { getSiasatArtwork, type SiasatVariant } from '@/lib/brand/artwork'
import { springs } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { DEFAULT_LINES, POSE_LABEL } from './lines'
import { SiasatAnimation } from './SiasatAnimation'
import { SiasatArt, type SiasatPose } from './SiasatArt'

const SIZES = {
  xs: 'w-16',
  sm: 'w-24',
  md: 'w-40',
  lg: 'w-52 sm:w-64 lg:w-72',
  xl: 'w-64 sm:w-80 lg:w-[25rem]',
} as const

const IMAGE_SIZES = {
  xs: { poster: '64px', sprite: '128px' },
  sm: { poster: '96px', sprite: '192px' },
  md: { poster: '160px', sprite: '320px' },
  lg: {
    poster: '(min-width: 1024px) 288px, (min-width: 640px) 256px, 208px',
    sprite: '(min-width: 1024px) 576px, (min-width: 640px) 512px, 416px',
  },
  xl: {
    poster: '(min-width: 1024px) 400px, (min-width: 640px) 320px, 256px',
    sprite: '(min-width: 1024px) 800px, (min-width: 640px) 640px, 512px',
  },
} as const

export type SiasatProps = {
  pose: SiasatPose
  expression?: Exclude<SiasatVariant, SiasatPose>
  clip?: SiasatClipName
  size?: keyof typeof SIZES
  /** Idle loops (float, blink, tail sway…). */
  loop?: boolean
  /** Tap to hop and speak; eyes follow the pointer on desktop. */
  interactive?: boolean
  /** Hidden from assistive tech (pure decoration). */
  decorative?: boolean
  onDark?: boolean
  flip?: boolean
  priority?: boolean
  /** Speech line shown immediately (for example after a form succeeds). */
  say?: string | null
  showArtTag?: boolean
  className?: string
}

function PointingMotion({ flip, children }: { flip: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced } = useMotionPreference()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 0.5, 1], flip ? [10, -6, 0] : [-10, 6, 0])
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], flip ? [4, -2.5, 0] : [-4, 2.5, 0])
  return (
    <m.div ref={ref} style={reduced ? undefined : { x, rotate }}>
      {children}
    </m.div>
  )
}

export function Siasat({
  pose,
  expression,
  clip,
  size = 'md',
  loop = true,
  interactive = false,
  decorative = false,
  onDark = false,
  flip = false,
  priority = false,
  say = null,
  showArtTag = false,
  className,
}: SiasatProps) {
  const { mascot, showPlaceholders } = useSite()
  const { reduced } = useMotionPreference()
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const [bubble, setBubble] = useState<string | null>(say)
  const [replay, setReplay] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cmsAsset = mascot.poses[pose]
  const asset = cmsAsset?.url ? cmsAsset : getSiasatArtwork(expression ?? pose)
  const animated = loop && mascot.idleAnimation && !reduced
  const builtInClip = cmsAsset?.url ? undefined : clip
  const playClip = animated && Boolean(builtInClip)
  const label = `${mascot.name}, rubah strategis MBD, sedang ${POSE_LABEL[pose]}`

  useEffect(() => setBubble(say), [say])
  useEffect(() => () => (timer.current ? clearTimeout(timer.current) : undefined), [])

  const speak = useCallback(() => {
    const fromCms = mascot.lines.filter((line) => line.pose === pose).map((line) => line.text)
    const pool = fromCms.length ? fromCms : DEFAULT_LINES[pose]
    const choices = pool.length > 1 ? pool.filter((line) => line !== bubble) : pool
    setBubble(choices[Math.floor(Math.random() * choices.length)] ?? null)
    if (playClip) setReplay((previous) => previous + 1)
    else if (!reduced && scope.current)
      void animate(scope.current, { y: [0, -18, 0] }, { duration: 0.5, ease: 'easeOut' })
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setBubble(null), 4500)
  }, [animate, bubble, mascot.lines, playClip, pose, reduced, scope])

  const art = asset?.url ? (
    <m.div
      className={cn('relative', flip && '-scale-x-100')}
      animate={animated && !playClip ? { y: [0, -8, 0], scale: [1, 1.015, 1] } : undefined}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {builtInClip ? (
        <SiasatAnimation key={`${builtInClip}-${replay}`} clip={builtInClip} play={playClip} sizes={IMAGE_SIZES[size]} priority={priority} />
      ) : (
        <Image
          src={asset.url}
          alt=""
          width={1024}
          height={1024}
          sizes={IMAGE_SIZES[size].poster}
          priority={priority}
          className="h-auto w-full select-none"
          draggable={false}
        />
      )}
    </m.div>
  ) : (
    <SiasatArt
      pose={pose}
      animated={animated}
      followPointer={interactive && mascot.eyeFollow}
      onDark={onDark}
      flip={flip}
      className="h-auto w-full"
    />
  )

  const tag =
    showArtTag && showPlaceholders && !asset?.url ? (
      <span
        className={cn(
          'label-mono mt-1 block text-center text-[0.625rem]',
          onDark ? 'text-white/60' : 'text-ink-500',
        )}
      >
        Ilustrasi placeholder
      </span>
    ) : null

  const canTalk = interactive && mascot.tapToTalk
  const renderedArt =
    pose === 'pointing' && loop && mascot.idleAnimation ? (
      <PointingMotion flip={flip}>{art}</PointingMotion>
    ) : (
      art
    )

  return (
    <div className={cn('relative', SIZES[size], className)}>
      <div
        aria-live="polite"
        className="pointer-events-none absolute inset-x-0 -top-2 z-10 flex -translate-y-full justify-center"
      >
        <AnimatePresence>
          {bubble ? (
            <m.p
              key={bubble}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={springs.snappy}
              className="relative w-max max-w-[15rem] rounded-2xl border-2 border-navy bg-white px-4 py-2.5 text-sm leading-snug font-semibold text-navy shadow-hard-sm"
            >
              {bubble}
              <span className="absolute -bottom-[9px] left-1/2 size-4 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-navy bg-white" />
            </m.p>
          ) : null}
        </AnimatePresence>
      </div>
      {canTalk ? (
        <button
          type="button"
          onClick={speak}
          aria-label={`${mascot.name}: ketuk untuk mendengar pesan`}
          className="block w-full cursor-pointer rounded-[40%] focus-visible:outline-offset-4"
        >
          <div ref={scope}>{renderedArt}</div>
        </button>
      ) : decorative ? (
        <div ref={scope} aria-hidden="true">
          {renderedArt}
        </div>
      ) : (
        <div ref={scope} role="img" aria-label={asset?.alt || label}>
          {renderedArt}
        </div>
      )}
      {tag}
    </div>
  )
}
