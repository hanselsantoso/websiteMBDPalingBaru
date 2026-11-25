'use client'

import { useFormFields } from '@payloadcms/ui'
import { domAnimation, LazyMotion, m, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'
import { getSiasatArtwork, SIASAT_LABELS, SIASAT_VARIANTS, type SiasatVariant } from '@/lib/brand/artwork'
import { isSiasatPose } from '@/lib/brand/mascot'
import './admin.css'

export function MascotPreview() {
  const [pose, setPose] = useState<SiasatVariant>('greeting')
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
      <div className="ad-row" role="group" aria-label="Pilih ekspresi">
        {SIASAT_VARIANTS.map((item) => (
          <button key={item} type="button" className="ad-btn" aria-pressed={pose === item} onClick={() => setPose(item)}>
            {SIASAT_LABELS[item]}
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
            <Image src={getSiasatArtwork(pose).url} alt={`${name}: ${SIASAT_LABELS[pose]}`} width={240} height={240} />
          </m.div>
        </LazyMotion>
      </div>
      <p className="ad-note">
        {uploaded
          ? 'Situs memakai gambar unggahan untuk pose ini. Panel menampilkan ilustrasi bawaan.'
          : isSiasatPose(pose)
            ? 'Unggah gambar PNG atau WebP transparan di bagian Pose untuk mengganti ilustrasi bawaan ini.'
            : 'Ekspresi tambahan dari koleksi ilustrasi Siasat.'}
      </p>
    </div>
  )
}
