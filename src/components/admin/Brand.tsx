import Image from 'next/image'
import { ARUS_MARK } from '@/lib/brand/artwork'
import './admin.css'

export function Logo() {
  return (
    <span className="ad-brand">
      <Image src={ARUS_MARK} alt="" width={44} height={44} />
      <span>
        <span className="ad-brand__name">Arus Digital</span>
        <br />
        <span className="ad-mono">CMS · S1 MBD ISTTS</span>
      </span>
    </span>
  )
}

export function Icon() {
  return <Image src={ARUS_MARK} alt="" width={26} height={26} />
}
