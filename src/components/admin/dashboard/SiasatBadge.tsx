'use client'

import Image from 'next/image'
import { getSiasatArtwork } from '@/lib/brand/artwork'
import type { SiasatPose } from '@/lib/brand/mascot'

export function SiasatBadge({ pose = 'greeting' }: { pose?: SiasatPose }) {
  return <Image src={getSiasatArtwork(pose).url} alt="" width={128} height={128} />
}
