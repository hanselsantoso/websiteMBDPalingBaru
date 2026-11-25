import Image from 'next/image'
import { PROGRAM_MARK } from '@/lib/brand/artwork'
import { INSTITUTION_NAME, PROGRAM_NAME } from '@/lib/brand/identity'
import './admin.css'

export function Logo() {
  return (
    <span className="ad-brand">
      <Image src={PROGRAM_MARK} alt="" width={44} height={44} />
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
