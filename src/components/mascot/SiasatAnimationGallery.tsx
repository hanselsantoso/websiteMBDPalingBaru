'use client'

import { useState } from 'react'
import { SiasatAnimation } from '@/components/mascot/SiasatAnimation'
import { useMotionPreference } from '@/components/providers/MotionProvider'
import { Button } from '@/components/ui/Button'
import { SIASAT_CLIP_NAMES, SIASAT_CLIPS, type SiasatClipName } from '@/lib/brand/animation'

export function SiasatAnimationGallery() {
  const { reduced } = useMotionPreference()
  const [active, setActive] = useState<SiasatClipName | null>(null)
  const [replay, setReplay] = useState(0)

  return (
    <section aria-labelledby="siasat-animation-title">
      <h2 id="siasat-animation-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Siasat bergerak</h2>
      {reduced ? <p className="mt-2 text-ink-600">Kurangi gerak aktif. Pratinjau menampilkan gambar diam.</p> : null}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {SIASAT_CLIP_NAMES.map((clip) => {
          const selected = active === clip && !reduced
          const { title, action } = SIASAT_CLIPS[clip]
          return (
            <figure key={clip} className="grid grid-cols-[5rem_1fr] items-center gap-3 rounded-3xl border border-navy/15 bg-white p-4 sm:block sm:p-5">
              <div className="mx-auto w-full max-w-52 rounded-2xl bg-ink-50">
                <SiasatAnimation key={selected ? replay : 0} clip={clip} play={selected} sizes="208px" />
              </div>
              <figcaption className="grid justify-items-center gap-2 text-center sm:mt-3">
                <span className="font-bold">{title}</span>
                <Button
                  type="button"
                  variant="secondary"
                  className="px-3 text-sm"
                  disabled={reduced}
                  onClick={() => {
                    setActive(clip)
                    setReplay((previous) => previous + 1)
                  }}
                >
                  {action}
                </Button>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </section>
  )
}
