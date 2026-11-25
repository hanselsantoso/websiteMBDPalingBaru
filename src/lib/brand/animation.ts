const clips = {
  sapaan: { title: 'Lambaian Siasat', action: 'Putar sapaan' },
  berpikir: { title: 'Siasat sedang berpikir', action: 'Putar animasi berpikir' },
  berhasil: { title: 'Siasat memberi jempol', action: 'Putar animasi jempol' },
} as const

export type SiasatClipName = keyof typeof clips

export const SIASAT_CLIP_NAMES = ['sapaan', 'berpikir', 'berhasil'] as const satisfies readonly SiasatClipName[]

function clipAsset(name: SiasatClipName) {
  const stem = `/images/mascot/animation/siasat-${name}`
  return { ...clips[name], poster: `${stem}-poster.webp`, sprite: `${stem}-sprite.webp` }
}

export const SIASAT_CLIPS = {
  sapaan: clipAsset('sapaan'),
  berpikir: clipAsset('berpikir'),
  berhasil: clipAsset('berhasil'),
}

export const SIASAT_FRAME_SIZE = 448
