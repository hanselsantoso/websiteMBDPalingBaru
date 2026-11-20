'use client'

import { useFormFields } from '@payloadcms/ui'
import { domAnimation, LazyMotion } from 'motion/react'
import { useState } from 'react'
import { SIASAT_POSES, SiasatArt, type SiasatPose } from '@/components/mascot/SiasatArt'
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
          <SiasatArt key={`${pose}-${animated}`} pose={pose} animated={animated} followPointer onDark={dark} title={`${name}, pose ${LABELS[pose]}`} />
        </LazyMotion>
      </div>
      <p className="ad-note">
        {uploaded
          ? 'Pose ini sudah punya gambar unggahan. Situs menampilkan gambar tersebut dengan animasi melayang dan bernapas; pratinjau di atas adalah placeholder vektor.'
          : 'Belum ada gambar untuk pose ini, jadi situs memakai placeholder vektor di atas. Unggah PNG/WebP transparan 1024 px dan 2048 px di bagian Pose.'}
      </p>
    </div>
  )
}
