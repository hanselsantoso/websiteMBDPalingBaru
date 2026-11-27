import Image from 'next/image'
import { PROGRAM_WORDMARK } from '@/lib/brand/artwork'
import { INSTITUTION_NAME, PROGRAM_NAME } from '@/lib/brand/identity'
import './admin.css'

export const INVERSE_WORDMARK = { ...PROGRAM_WORDMARK, src: '/images/brand/mbd-jejak-siasat-putih.webp' }

function BrandArtwork({ compact = false }: { compact?: boolean }) {
  const sizes = compact ? '42px' : '96px'
  return (
    <span className={compact ? 'ad-brand__art ad-brand__art--compact' : 'ad-brand__art'}>
      <Image {...PROGRAM_WORDMARK} alt="" sizes={sizes} className="ad-brand__art-light" />
      <Image
        {...INVERSE_WORDMARK}
        alt=""
        sizes={sizes}
        className="ad-brand__art-dark"
      />
    </span>
  )
}

export function Logo() {
  return (
    <span className="ad-brand">
      <BrandArtwork />
      <span className="ad-brand__copy">
        <span className="ad-brand__name">{PROGRAM_NAME}</span>
        <span className="ad-mono">CMS · {INSTITUTION_NAME}</span>
      </span>
    </span>
  )
}

export function Icon() {
  return <BrandArtwork compact />
}
