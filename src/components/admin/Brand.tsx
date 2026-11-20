import { FIN_PATH } from '@/components/patterns/shapes'
import './admin.css'

function FinMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" rx="24" fill="#071A3D" />
      <path d="M 10 78 q 14 -10 28 0 t 28 0 t 28 0" fill="none" stroke="#2EE6F6" strokeWidth="6" strokeLinecap="round" />
      <g transform="translate(26 14) scale(0.5)">
        <path d={FIN_PATH} fill="#C6F432" />
      </g>
    </svg>
  )
}

export function Logo() {
  return (
    <span className="ad-brand">
      <FinMark size={44} />
      <span>
        <span className="ad-brand__name">Arus Digital</span>
        <br />
        <span className="ad-mono">CMS · S1 MBD ISTTS</span>
      </span>
    </span>
  )
}

export function Icon() {
  return <FinMark size={26} />
}
