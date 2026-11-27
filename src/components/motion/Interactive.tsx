'use client'

import { animate, AnimatePresence, m, useInView } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useMotionPreference } from '@/components/providers/MotionProvider'
import { parseVideoUrl } from '@/lib/video'
import { springs } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * Reveal on scroll with stagger. Content renders visible on the server (no-JS,
 * crawlers); only items still below the fold are hidden, then revealed once.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'article' | 'section'
}) {
  const ref = useRef<HTMLElement>(null)
  const [state, setState] = useState<'idle' | 'pending' | 'in'>('idle')
  const { reduced } = useMotionPreference()

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    if (reduced || rect.top < window.innerHeight) {
      setState('idle')
      return
    }
    setState('pending')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('in')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduced])

  return (
    <Tag
      ref={ref as never}
      className={cn(state === 'pending' && 'reveal-pending', state === 'in' && 'reveal-in', className)}
      style={state === 'idle' ? undefined : ({ '--reveal-delay': `${delay}ms` } as CSSProperties)}
    >
      {children}
    </Tag>
  )
}

/** Rotating headline word. Every word is laid out invisibly to reserve width (no layout shift). */
export function RotatingWords({ words, interval = 2400 }: { words: string[]; interval?: number }) {
  const { reduced } = useMotionPreference()
  const [index, setIndex] = useState(0)
  const list = words.length ? words : ['AI']

  useEffect(() => {
    if (reduced || list.length < 2) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setIndex((value) => (value + 1) % list.length)
    }, interval)
    return () => window.clearInterval(id)
  }, [reduced, list.length, interval])

  const current = list[reduced ? 0 : index]
  return (
    <span className="relative inline-grid overflow-hidden pb-[0.12em] align-bottom" aria-hidden="true">
      {list.map((word) => (
        <span key={word} className="invisible col-start-1 row-start-1 whitespace-nowrap">
          {word}
        </span>
      ))}
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={current}
          className="col-start-1 row-start-1 whitespace-nowrap text-lime"
          initial={{ y: '105%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-105%', opacity: 0 }}
          transition={springs.soft}
        >
          {current}
        </m.span>
      </AnimatePresence>
      <svg viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute right-0 bottom-0 left-0 h-[0.14em] w-full text-lime" aria-hidden="true">
        <path d="M0 7 Q12.5 1 25 7 T50 7 T75 7 T100 7 T125 7 T150 7 T175 7 T200 7" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </span>
  )
}

/** Count-up number. Renders the final value on the server; animates only if it starts offscreen. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const { reduced } = useMotionPreference()
  const [display, setDisplay] = useState(value)
  const armed = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node || reduced) return
    if (node.getBoundingClientRect().top > window.innerHeight) {
      armed.current = true
      setDisplay(0)
    }
  }, [reduced])

  useEffect(() => {
    if (!inView || !armed.current) return
    armed.current = false
    const controls = animate(0, value, { duration: 1.2, ease: [0.25, 1, 0.5, 1], onUpdate: (latest) => setDisplay(Math.round(latest)) })
    return () => controls.stop()
  }, [inView, value])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {display.toLocaleString('id-ID')}
    </span>
  )
}

/** Click-to-load video (no third-party requests until the visitor asks). */
export function VideoEmbed({ url, title, caption }: { url: string; title?: string | null; caption?: string | null }) {
  const video = parseVideoUrl(url)
  const [playing, setPlaying] = useState(false)
  if (!video) return null
  return (
    <figure className="grid gap-3">
      <div className="relative aspect-video overflow-hidden rounded-[24px] border-2 border-navy bg-navy shadow-hard">
        {playing ? (
          <iframe
            src={video.embedUrl}
            title={title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 grid place-items-center"
            aria-label={`Putar video${title ? `: ${title}` : ''}`}
            style={video.thumbnail ? { backgroundImage: `url(${video.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
          >
            <span className="grid size-20 place-items-center rounded-full border-2 border-navy bg-lime text-navy shadow-hard transition-transform duration-150 group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="size-8 translate-x-0.5" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {caption ? <figcaption className="text-sm text-ink-600">{caption}</figcaption> : null}
    </figure>
  )
}
