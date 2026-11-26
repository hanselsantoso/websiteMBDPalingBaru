'use client'

import { useInView } from 'motion/react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { SIASAT_CLIPS, SIASAT_FRAME_SIZE, type SiasatClipName } from '@/lib/brand/animation'
import { cn } from '@/lib/utils'

export function SiasatAnimation({
  clip,
  play,
  sizes,
  priority = false,
}: {
  clip: SiasatClipName
  play: boolean
  sizes: { poster: string; sprite: string }
  priority?: boolean
}) {
  const frame = useRef<HTMLSpanElement>(null)
  const visible = useInView(frame, { once: true, amount: 0.35 })
  const [ready, setReady] = useState(false)
  const { poster, sprite, spriteSources } = SIASAT_CLIPS[clip]

  return (
    <span
      ref={frame}
      aria-hidden="true"
      data-siasat-animation={clip}
      className="pointer-events-none relative block overflow-hidden"
    >
      <Image
        src={poster}
        alt=""
        width={SIASAT_FRAME_SIZE}
        height={SIASAT_FRAME_SIZE}
        sizes={sizes.poster}
        priority={priority}
        draggable={false}
        className={cn('h-auto w-full select-none', ready && play && 'siasat-poster-ready')}
      />
      {play && visible ? (
        <picture>
          <source
            type="image/webp"
            sizes={sizes.sprite}
            srcSet={spriteSources.map(({ src, width }) => `${src} ${width}w`).join(', ')}
          />
          <Image
            src={sprite}
            alt=""
            width={SIASAT_FRAME_SIZE * 2}
            height={SIASAT_FRAME_SIZE * 2}
            unoptimized
            loading="eager"
            draggable={false}
            onLoad={() => setReady(true)}
            className={cn('absolute top-0 left-0 h-auto w-[200%] max-w-none select-none', ready ? 'siasat-sprite' : 'invisible')}
          />
        </picture>
      ) : null}
    </span>
  )
}
