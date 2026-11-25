'use client'

import { useFormFields } from '@payloadcms/ui'
import { domAnimation, LazyMotion, m, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'
import { SIASAT_ARTWORK } from '@/lib/brand/artwork'
import { SIASAT_POSES, type SiasatPose } from '@/lib/brand/mascot'
import './admin.css'

const LABELS: Record<SiasatPose, string> = {
  greeting: 'Menyapa',
  pointing: 'Menunjuk',
  thinking: 'Berpikir',
  celebrating: 'Merayakan',
  confused: 'Bingung',
  tablet: 'Tablet',
}

export function MascotPreview() {
  const [pose, setPose] = useState<SiasatPose>('greeting')
  const [animated, setAnimated] = useState(true)
  const [dark, setDark] = useState(false)
  const reduced = useReducedMotion()
  const uploaded = useFormFields(([fields]) => Boolean(fields?.[`poses.${pose}.image`]?.value))
  const name = useFormFields(([fields]) => (fields?.mascotName?.value as string) || 'Siasat')

  return (
    <div className="ad-panel">
      <div className="ad-panel__head">
        <strong>Panel uji animasi {name}</strong>
        <div className="ad-row">
          <button type="button" className="ad-btn" aria-pressed={animated} onClick={() => setAnimated((v) => !v)}>
            {animated ? 'Animasi: nyala' : 'Animasi: mati (kurangi gerak)'}
          </button>
          <button type="button" className="ad-btn" aria-pressed={dark} onClick={() => setDark((v) => !v)}>
            {dark ? 'Latar gelap' : 'Latar terang'}
          </button>
        </div>
      </div>
      <div className="ad-row" role="group" aria-label="Pilih pose">
        {SIASAT_POSES.map((item) => (
          <button key={item} type="button" className="ad-btn" aria-pressed={pose === item} onClick={() => setPose(item)}>
            {LABELS[item]}
          </button>
        ))}
      </div>
      <div className={`ad-stage ad-stage--spaced ${dark ? 'ad-stage--dark' : ''}`}>
        <LazyMotion features={domAnimation}>
          <m.div
            key={pose}
            animate={animated && !reduced ? { y: [0, -8, 0] } : { y: 0 }}
            transition={animated && !reduced ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
          >
            <Image src={SIASAT_ARTWORK[pose].url} alt={`${name}, pose ${LABELS[pose]}`} width={240} height={240} />
          </m.div>
        </LazyMotion>
      </div>
      <p className="ad-note">
        {uploaded
          ? 'Situs memakai gambar unggahan untuk pose ini. Panel menampilkan ilustrasi bawaan.'
          : 'Situs memakai ilustrasi bawaan di atas. Unggah gambar PNG atau WebP transparan di bagian Pose untuk menggantinya.'}
      </p>
    </div>
  )
}
