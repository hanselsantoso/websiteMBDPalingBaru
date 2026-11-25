import Image from 'next/image'
import Link from 'next/link'
import { ARUS_MARK } from '@/lib/brand/artwork'
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
          <Image src={ARUS_MARK} alt="" width={44} height={44} className="size-11 shrink-0" />
          <span className="flex flex-col leading-none">
            <span className={cn('font-display text-[1.35rem] font-extrabold tracking-[-0.03em]', dark ? 'text-white' : 'text-navy')}>Arus Digital</span>
            <span className={cn('label-mono mt-1 text-[0.625rem]', dark ? 'text-lime' : 'text-blue')}>MBD ISTTS</span>
          </span>
        </>
      )}
    </Link>
  )
}
