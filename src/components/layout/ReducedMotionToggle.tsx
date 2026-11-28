'use client'

import { uiCopy } from '@/lib/i18n-copy'
import { useLocale } from '@/components/providers/LocaleProvider'

import { useMotionPreference } from '@/components/providers/MotionProvider'
import { cn } from '@/lib/utils'

export function ReducedMotionToggle() {
  const locale = useLocale()
  const { reduced, osReduced, setReduced } = useMotionPreference()
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={reduced}
        onClick={() => setReduced(!reduced)}
        className="group inline-flex min-h-11 items-center gap-3 rounded-full pr-2 font-semibold text-white"
      >
        <span
          aria-hidden="true"
          className={cn('relative inline-block h-7 w-12 rounded-full border-2 transition-colors duration-150', reduced ? 'border-lime bg-lime' : 'border-white/50 bg-transparent')}
        >
          <span
            className={cn(
              'absolute top-1/2 left-0.5 size-5 -translate-y-1/2 rounded-full transition-transform duration-150',
              reduced ? 'translate-x-5 bg-navy' : 'translate-x-0 bg-white',
            )}
          />
        </span>
        {uiCopy(locale, 'Kurangi animasi')}
      </button>
      {osReduced ? <span className="text-sm text-white/65">{locale === 'en' ? 'Follows your device settings.' : 'Mengikuti pengaturan perangkatmu.'}</span> : null}
    </div>
  )
}
