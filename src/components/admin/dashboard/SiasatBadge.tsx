'use client'

import Image from 'next/image'
import { SIASAT_ARTWORK } from '@/lib/brand/artwork'
import type { SiasatPose } from '@/lib/brand/mascot'

export function SiasatBadge({ pose = 'greeting' }: { pose?: SiasatPose }) {
  return <Image src={SIASAT_ARTWORK[pose].url} alt="" width={128} height={128} />
}
