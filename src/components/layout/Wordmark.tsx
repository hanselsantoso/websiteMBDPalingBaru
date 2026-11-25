import Image from 'next/image'
import Link from 'next/link'
import { PROGRAM_MARK } from '@/lib/brand/artwork'
import { INSTITUTION_NAME, PROGRAM_NAME } from '@/lib/brand/identity'
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
    <Link href="/" className={cn('inline-flex min-h-11 min-w-0 items-center gap-2.5 rounded-xl', className)} onClick={onNavigate} aria-label={`${PROGRAM_NAME} ${INSTITUTION_NAME}, ke beranda`}>
      {logoUrl ? (
        <Image src={logoUrl} alt="" width={180} height={40} className="h-9 w-auto" priority />
      ) : (
        <>
          <Image src={PROGRAM_MARK} alt="" width={44} height={44} className="size-11 shrink-0" />
          <span className="flex max-w-44 flex-col leading-none">
            <span className={cn('font-display text-base leading-[1.05] font-extrabold tracking-[-0.025em] sm:text-lg', dark ? 'text-white' : 'text-navy')}>{PROGRAM_NAME}</span>
            <span className={cn('label-mono mt-1 text-[0.625rem]', dark ? 'text-lime' : 'text-blue')}>{INSTITUTION_NAME}</span>
          </span>
        </>
      )}
    </Link>
  )
}
