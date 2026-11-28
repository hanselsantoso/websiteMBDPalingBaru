'use client'

import { useLocale } from '@/components/providers/LocaleProvider'
import { isPlaceholder, placeholderHint } from '@/lib/domain/placeholders'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

/** Amber chip that marks data still waiting for the program team (`[ISI]`). */
export function PendingChip({ hint, className }: { hint?: string | null; className?: string }) {
  const en = useLocale() === 'en'
  return (
    <span
      className={cn(
        'label-mono inline-flex min-w-0 max-w-full items-center gap-1 rounded-md border border-dashed border-navy bg-amber px-1.5 py-0.5 align-middle text-[0.6875rem] text-navy normal-case tracking-normal',
        className,
      )}
      title={en ? "The program team has yet to provide this information" : "Data ini belum diisi oleh tim program studi"}
    >
      <span className="shrink-0 font-bold uppercase tracking-[0.08em]">{en ? 'Pending' : 'ISI'}</span>
      {hint ? <span className="min-w-0 truncate">{hint}</span> : null}
    </span>
  )
}

/** Renders the value, or the pending chip (when placeholders are shown), or the fallback. */
export function TextOr({
  value,
  show,
  fallback = null,
  hint,
}: {
  value: string | number | null | undefined
  show: boolean
  fallback?: ReactNode
  hint?: string
}) {
  const en = useLocale() === 'en'
  if (!isPlaceholder(value)) return <>{value}</>
  if (!show) return <>{fallback}</>
  return <PendingChip hint={en ? hint : placeholderHint(value) ?? hint} />
}
