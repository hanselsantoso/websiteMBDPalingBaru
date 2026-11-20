'use client'

import Link from 'next/link'
import { forwardRef, useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const control =
  'w-full rounded-xl border-2 bg-white px-4 text-base text-navy placeholder:text-ink-500 transition-[border-color] duration-150 aria-[invalid=true]:border-danger'

function describedBy(id: string, hint?: ReactNode, error?: string) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined
}

export function FieldShell({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string
  label: ReactNode
  hint?: ReactNode
  error?: string
  optional?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('grid gap-1.5', className)}>
      <label htmlFor={id} className="font-semibold text-navy">
        {label}
        {optional ? <span className="ml-1 text-sm font-normal text-ink-600">(opsional)</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink-600">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm font-semibold text-danger">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      ) : null}
    </div>
  )
}

type InputProps = ComponentPropsWithoutRef<'input'> & { label: ReactNode; hint?: ReactNode; error?: string; optional?: boolean }

export const TextField = forwardRef<HTMLInputElement, InputProps>(function TextField(
  { id, label, hint, error, optional, className, ...rest },
  ref,
) {
  const fieldId = id ?? rest.name ?? 'field'
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error} optional={optional} className={className}>
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, hint, error)}
        className={cn(control, 'h-12 border-navy')}
        {...rest}
      />
    </FieldShell>
  )
})

type TextareaProps = ComponentPropsWithoutRef<'textarea'> & { label: ReactNode; hint?: ReactNode; error?: string; optional?: boolean }

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaProps>(function TextareaField(
  { id, label, hint, error, optional, className, rows = 5, ...rest },
  ref,
) {
  const fieldId = id ?? rest.name ?? 'field'
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error} optional={optional} className={className}>
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, hint, error)}
        className={cn(control, 'border-navy py-3 leading-relaxed')}
        {...rest}
      />
    </FieldShell>
  )
})

type SelectProps = ComponentPropsWithoutRef<'select'> & {
  label: ReactNode
  hint?: ReactNode
  error?: string
  optional?: boolean
  options: { value: string; label: string }[]
  placeholder?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectProps>(function SelectField(
  { id, label, hint, error, optional, className, options, placeholder = 'Pilih salah satu', ...rest },
  ref,
) {
  const fieldId = id ?? rest.name ?? 'field'
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error} optional={optional} className={className}>
      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, hint, error)}
          className={cn(control, 'h-12 appearance-none border-navy pr-10')}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-navy" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </FieldShell>
  )
})

type ConsentProps = ComponentPropsWithoutRef<'input'> & { error?: string; privacyHref: string; children?: ReactNode }

export const ConsentField = forwardRef<HTMLInputElement, ConsentProps>(function ConsentField(
  { id = 'consent', error, privacyHref, children, ...rest },
  ref,
) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-navy">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-2 border-navy accent-[var(--brand-blue)]"
          {...rest}
        />
        <span>
          {children ?? 'Saya setuju data ini disimpan dan dipakai tim MBD ISTTS untuk menghubungi saya terkait informasi pendaftaran.'}{' '}
          <Link href={privacyHref} className="font-semibold text-blue underline underline-offset-2" target="_blank">
            Baca kebijakan privasi
          </Link>
          .
        </span>
      </label>
      {error ? (
        <p id={`${id}-error`} className="text-sm font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
})

/** Hidden from people; bots tend to fill it. */
export const Honeypot = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<'input'>>(function Honeypot(props, ref) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Situs web
        <input ref={ref} type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  )
})

/** Polite live region listing errors after a failed submit. */
export function ErrorSummary({ errors, message }: { errors: Record<string, { message?: string } | undefined>; message?: string | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const list = Object.values(errors)
    .map((error) => error?.message)
    .filter(Boolean) as string[]
  const visible = Boolean(message) || list.length > 0
  useEffect(() => {
    if (message) ref.current?.focus()
  }, [message])
  return (
    <div ref={ref} tabIndex={-1} role="alert" aria-live="assertive" className={cn(visible ? 'rounded-2xl border-2 border-danger bg-white p-4' : 'sr-only')}>
      {message ? <p className="font-semibold text-danger">{message}</p> : null}
      {list.length > 1 ? (
        <ul className="mt-1 list-disc pl-5 text-sm text-danger">
          {list.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void }
  }
}

/** Cloudflare Turnstile, rendered only when a site key is configured in the CMS. */
export function Turnstile({ siteKey, onToken }: { siteKey: string | null; onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!siteKey || !ref.current) return
    let widgetId: string | null = null
    const mount = () => {
      if (window.turnstile && ref.current && !widgetId) {
        widgetId = window.turnstile.render(ref.current, { sitekey: siteKey, callback: onToken, language: 'id' })
      }
    }
    if (window.turnstile) mount()
    else {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.onload = mount
      document.head.appendChild(script)
    }
    return () => {
      if (widgetId) window.turnstile?.remove(widgetId)
    }
  }, [siteKey, onToken])
  if (!siteKey) return null
  return <div ref={ref} className="min-h-[65px]" />
}
