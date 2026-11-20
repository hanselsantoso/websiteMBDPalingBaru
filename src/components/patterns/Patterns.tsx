import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { FIN_PATH, STAR_PATH, wavePath } from './shapes'

type WaveLayer = {
  color: string
  amplitude: number
  baseline: number
  duration: number
  reverse?: boolean
  decorative?: boolean
}

const PRESETS: Record<string, WaveLayer[]> = {
  /** Dark section above, white section below. */
  toWhite: [
    { color: 'var(--brand-cyan)', amplitude: 16, baseline: 52, duration: 24, decorative: true },
    {
      color: 'var(--brand-blue)',
      amplitude: 20,
      baseline: 66,
      duration: 34,
      reverse: true,
      decorative: true,
    },
    { color: '#ffffff', amplitude: 14, baseline: 86, duration: 42 },
  ],
  /** Dark section above, navy footer/section below. */
  toNavy: [
    { color: 'var(--brand-cyan)', amplitude: 14, baseline: 56, duration: 26, decorative: true },
    {
      color: 'var(--brand-blue)',
      amplitude: 18,
      baseline: 70,
      duration: 36,
      reverse: true,
      decorative: true,
    },
    { color: 'var(--brand-navy)', amplitude: 12, baseline: 88, duration: 44 },
  ],
  /** Light section above, navy section below. */
  toNavyFromLight: [
    { color: 'var(--brand-cyan)', amplitude: 14, baseline: 50, duration: 26, decorative: true },
    {
      color: 'var(--brand-blue)',
      amplitude: 18,
      baseline: 64,
      duration: 36,
      reverse: true,
      decorative: true,
    },
    { color: 'var(--brand-navy)', amplitude: 14, baseline: 84, duration: 44 },
  ],
}

/**
 * Layered sine waves drifting horizontally (20–40s loops). Each SVG is 200% wide
 * with whole periods so a -50% translate loops seamlessly. The last layer is
 * opaque and matches the next section, so it doubles as the section divider.
 */
export function Wave({
  preset = 'toWhite',
  className,
  position = 'bottom',
}: {
  preset?: keyof typeof PRESETS
  className?: string
  position?: 'bottom' | 'top'
}) {
  const layers = PRESETS[preset]
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-x-0 h-[clamp(56px,8vw,112px)] overflow-hidden',
        position === 'bottom' ? 'bottom-0' : 'top-0 rotate-180',
        className,
      )}
    >
      {layers.map((layer, index) => (
        <svg
          key={index}
          viewBox="0 0 2880 100"
          preserveAspectRatio="none"
          className={cn(
            'anim-wave absolute bottom-0 left-0 h-full w-[200%]',
            layer.decorative && 'pattern-wave',
          )}
          style={
            {
              '--wave-duration': `${layer.duration}s`,
              animationDirection: layer.reverse ? 'reverse' : undefined,
            } as CSSProperties
          }
        >
          <path d={wavePath(2880, 100, layer.amplitude, layer.baseline, 4)} fill={layer.color} />
        </svg>
      ))}
    </div>
  )
}

export function Fin({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d={FIN_PATH} fill="currentColor" />
    </svg>
  )
}

export function Star({
  className,
  twinkle = false,
  delay = 0,
  duration,
}: {
  className?: string
  twinkle?: boolean
  delay?: number
  duration?: number
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn('pattern-star', twinkle && 'anim-twinkle', className)}
      style={
        twinkle
          ? ({
              '--twinkle-delay': `${delay}s`,
              ...(duration ? { '--twinkle-duration': `${duration}s` } : {}),
            } as CSSProperties)
          : undefined
      }
    >
      <path d={STAR_PATH} fill="currentColor" />
    </svg>
  )
}

/** Scattered twinkling stars; positions are fixed so the layout never shifts. */
export function StarField({
  tone = 'lime',
  className,
  count = 7,
}: {
  tone?: 'lime' | 'blue' | 'navy' | 'cyan'
  className?: string
  count?: number
}) {
  const positions = [
    'left-[6%] top-[14%] size-4',
    'left-[22%] top-[72%] size-3',
    'left-[46%] top-[10%] size-2.5',
    'right-[30%] top-[24%] size-5',
    'right-[8%] top-[58%] size-3',
    'right-[18%] top-[8%] size-2',
    'left-[62%] top-[64%] size-3.5',
    'left-[12%] top-[40%] size-2',
  ].slice(0, count)
  const color = { lime: 'text-lime', blue: 'text-blue', navy: 'text-navy', cyan: 'text-cyan' }[tone]
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      {positions.map((position, index) => (
        <Star
          key={position}
          twinkle={index % 2 === 0}
          delay={index * 0.6}
          className={cn('absolute', position, color)}
        />
      ))}
    </div>
  )
}

/** CSS-only marquee. Two copies loop seamlessly; reduced motion shows a static, wrapped row. */
export function Marquee({
  children,
  duration = 40,
  className,
  label,
}: {
  children: ReactNode
  duration?: number
  className?: string
  label?: string
}) {
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      role={label ? 'region' : undefined}
      aria-label={label}
    >
      <div
        className="anim-marquee marquee-track flex w-max items-center"
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
        <div className="flex shrink-0 items-center gap-10 pr-10">{children}</div>
        <div className="marquee-dup flex shrink-0 items-center gap-10 pr-10" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
