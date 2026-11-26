const clips = {
  sapaan: { title: 'Lambaian Siasat', action: 'Putar sapaan' },
  berpikir: { title: 'Siasat sedang berpikir', action: 'Putar animasi berpikir' },
  berhasil: { title: 'Siasat memberi jempol', action: 'Putar animasi jempol' },
} as const

export type SiasatClipName = keyof typeof clips

export const SIASAT_CLIP_NAMES = ['sapaan', 'berpikir', 'berhasil'] as const satisfies readonly SiasatClipName[]
export const SIASAT_FRAME_SIZE = 448

const SPRITE_WIDTHS = [192, 384, 640, SIASAT_FRAME_SIZE * 2] as const

function clipAsset(name: SiasatClipName) {
  const stem = `/images/mascot/animation/siasat-${name}`
  const sprite = `${stem}-sprite.webp`
  const spriteSources = SPRITE_WIDTHS.map((width) => ({
    width,
    src: width === SIASAT_FRAME_SIZE * 2 ? sprite : `${stem}-sprite-${width}.webp`,
  }))
  return { ...clips[name], poster: `${stem}-poster.webp`, sprite, spriteSources }
}

export const SIASAT_CLIPS = {
  sapaan: clipAsset('sapaan'),
  berpikir: clipAsset('berpikir'),
  berhasil: clipAsset('berhasil'),
}
