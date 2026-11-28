'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { Siasat } from '@/components/mascot/Siasat'
import { useLocale } from '@/components/providers/LocaleProvider'
import { englishFormMessage } from './form-messages'
import { cn } from '@/lib/utils'

/** Success panel with the celebrating fox; moves focus so screen readers announce it. */
export function SuccessPanel({
  title,
  children,
  className,
}: {
  title: string
  children?: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => ref.current?.focus({ preventScroll: true }), [])
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className={cn(
        'grid justify-items-center gap-4 rounded-[28px] border-2 border-navy bg-white p-8 text-center shadow-hard outline-none',
        className,
      )}
    >
      <Siasat pose="celebrating" expression="proud" clip="berhasil" size="md" />
      <h3 className="text-title font-bold">{title}</h3>
      {children}
    </div>
  )
}

/** Server failure feedback with a reassuring expression. */
export function FailureNote({ message }: { message: string | null }) {
  const en = useLocale() === 'en'
  if (!message) return null
  return (
    <div
      className="flex items-center gap-4 rounded-2xl border-2 border-danger bg-white p-4"
      role="alert"
    >
      <Siasat pose="confused" expression="reassuring" size="xs" decorative />
      <p className="font-semibold text-danger">{en ? englishFormMessage(message) : message}</p>
    </div>
  )
}
