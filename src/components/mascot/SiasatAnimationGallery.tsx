'use client'

import { useLocale } from '@/components/providers/LocaleProvider'
import { useState } from 'react'
import { SiasatAnimation } from '@/components/mascot/SiasatAnimation'
import { useMotionPreference } from '@/components/providers/MotionProvider'
import { Button } from '@/components/ui/Button'
import { SIASAT_CLIP_NAMES, SIASAT_CLIPS, type SiasatClipName } from '@/lib/brand/animation'

const GALLERY_IMAGE_SIZES = {
  poster: '(min-width: 830px) 208px, (min-width: 768px) calc((100vw - 206px) / 3), (min-width: 640px) calc((100vw - 190px) / 3), 80px',
  sprite: '(min-width: 830px) 416px, (min-width: 768px) calc((200vw - 412px) / 3), (min-width: 640px) calc((200vw - 380px) / 3), 160px',
}

export function SiasatAnimationGallery() {
  const en = useLocale() === 'en'
  const { reduced } = useMotionPreference()
  const [active, setActive] = useState<SiasatClipName | null>(null)
  const [replay, setReplay] = useState(0)

  return (
    <section id="animasi-siasat" aria-labelledby="siasat-animation-title" className="mt-12 scroll-mt-[calc(var(--header-h)+1rem)] sm:mt-16">
      <h2 id="siasat-animation-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{en ? 'Siasat in motion' : 'Siasat bergerak'}</h2>
      {reduced ? <p className="mt-2 text-ink-600">{en ? 'Reduced motion is on. Previewing a still image.' : 'Kurangi gerak aktif. Pratinjau menampilkan gambar diam.'}</p> : null}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {SIASAT_CLIP_NAMES.map((clip) => {
          const selected = active === clip && !reduced
          const { title, action } = en ? {
            sapaan: { title: 'Say hello', action: 'Play greeting' },
            berpikir: { title: 'Think it through', action: 'Play thinking' },
            berhasil: { title: 'Celebrate', action: 'Play celebration' },
          }[clip] : SIASAT_CLIPS[clip]
          return (
            <figure key={clip} className="grid grid-cols-[5rem_1fr] items-center gap-3 rounded-3xl border border-navy/15 bg-white p-4 sm:block sm:p-5">
              <div className="mx-auto w-full max-w-52 rounded-2xl bg-ink-50">
                <SiasatAnimation key={selected ? replay : 0} clip={clip} play={selected} sizes={GALLERY_IMAGE_SIZES} />
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
