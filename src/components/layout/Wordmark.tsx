import Image from '@/components/ui/CmsImage'
import Link from 'next/link'
import { PROGRAM_WORDMARK } from '@/lib/brand/artwork'
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
          <span className="w-[4.5rem] shrink-0 rounded-md bg-[#fff7e7] px-1 py-1.5 sm:w-[5.75rem]">
            <Image {...PROGRAM_WORDMARK} alt="" sizes="(min-width: 640px) 84px, 64px" className="h-auto w-full" />
          </span>
          <span className="flex max-w-36 flex-col leading-none">
            <span className={cn('font-display text-base leading-[1.05] font-extrabold tracking-[-0.025em] sm:text-lg', dark ? 'text-white' : 'text-navy')}>{PROGRAM_NAME}</span>
            <span className={cn('label-mono mt-1 text-[0.625rem]', dark ? 'text-lime' : 'text-blue')}>{INSTITUTION_NAME}</span>
          </span>
        </>
      )}
    </Link>
  )
}
