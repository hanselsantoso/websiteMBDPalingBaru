import Image from 'next/image'
import { HERO_WAVE_ART } from '@/lib/brand/artwork'

export function PaintedDivider() {
  return (
    <div aria-hidden="true" className="pointer-events-none relative h-[clamp(58px,10vw,144px)] overflow-hidden bg-linear-to-b from-transparent from-18% to-white to-88%">
      <Image
        src={HERO_WAVE_ART}
        alt=""
        fill
        sizes="100vw"
        className="pattern-wave object-fill"
      />
    </div>
  )
}
