import Image from 'next/image'
import { PROGRAM_MARK, PROGRAM_WORDMARK } from '@/lib/brand/artwork'
import { INSTITUTION_NAME, PROGRAM_NAME } from '@/lib/brand/identity'
import './admin.css'

export function Logo() {
  return (
    <span className="ad-brand">
      <span className="ad-brand__mark">
        <Image {...PROGRAM_WORDMARK} alt="" sizes="76px" className="ad-brand__art" />
      </span>
      <span>
        <span className="ad-brand__name">{PROGRAM_NAME}</span>
        <br />
        <span className="ad-mono">CMS · {INSTITUTION_NAME}</span>
      </span>
    </span>
  )
}

export function Icon() {
  return <Image src={PROGRAM_MARK} alt="" width={26} height={26} />
}
