import Image from 'next/image'
import Link from 'next/link'
import { Fin } from '@/components/patterns/Patterns'
import { cn } from '@/lib/utils'

export function Wordmark({
  logoUrl,
  dark = true,
  className,
  onNavigate,
}: {
  logoUrl?: string | null
  dark?: boolean
  className?: string
  onNavigate?: () => void
}) {
  return (
    <Link href="/" className={cn('group inline-flex min-h-11 items-center gap-2.5 rounded-xl', className)} onClick={onNavigate} aria-label="Arus Digital, S1 Manajemen Bisnis Digital ISTTS, ke beranda">
      {logoUrl ? (
        <Image src={logoUrl} alt="" width={180} height={40} className="h-9 w-auto" priority />
      ) : (
        <>
          <span className="relative grid size-9 place-items-center overflow-hidden rounded-[10px] border-2 border-current bg-lime text-navy">
            <Fin className="relative z-10 size-5 translate-y-0.5" />
            <svg viewBox="0 0 40 10" className="absolute bottom-0.5 h-2 w-full text-blue" aria-hidden="true">
              <path d="M0 6 Q5 1 10 6 T20 6 T30 6 T40 6" fill="none" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className={cn('font-display text-[1.35rem] font-extrabold tracking-[-0.03em]', dark ? 'text-white' : 'text-navy')}>Arus Digital</span>
            <span className={cn('label-mono mt-1 text-[0.625rem]', dark ? 'text-lime' : 'text-blue')}>MBD ISTTS</span>
          </span>
        </>
      )}
    </Link>
  )
}
