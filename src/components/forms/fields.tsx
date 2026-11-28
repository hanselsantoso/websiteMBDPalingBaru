'use client'

import { LocaleLink as Link, useLocale } from '@/components/providers/LocaleProvider'
import { englishFormMessage } from './form-messages'
import { forwardRef, useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react'
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
  const en = useLocale() === 'en'
  return (
    <div className={cn('grid gap-1.5', className)}>
      <label htmlFor={id} className="font-semibold text-navy">
        {label}
        {optional ? <span className="ml-1 text-sm font-normal text-ink-600">{en ? '(optional)' : '(opsional)'}</span> : null}
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
          {en ? englishFormMessage(error) : error}
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
  { id, label, hint, error, optional, className, options, placeholder, ...rest },
  ref,
) {
  const en = useLocale() === 'en'
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
          <option value="">{placeholder ?? (en ? 'Select an option' : 'Pilih salah satu')}</option>
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
  const en = useLocale() === 'en'
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
          {children ?? (en ? "I consent to MBD ISTTS storing and using this information to contact me about admissions." : 'Saya setuju data ini disimpan dan dipakai tim MBD ISTTS untuk menghubungi saya terkait informasi pendaftaran.')}{' '}
          <Link href={privacyHref} className="font-semibold text-blue underline underline-offset-2" target="_blank">
            {en ? 'Read the privacy policy' : 'Baca kebijakan privasi'}
          </Link>
          .
        </span>
      </label>
      {error ? (
        <p id={`${id}-error`} className="text-sm font-semibold text-danger">
          {en ? englishFormMessage(error) : error}
        </p>
      ) : null}
    </div>
  )
})

/** Hidden from people; bots tend to fill it. */
export const Honeypot = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<'input'>>(function Honeypot(props, ref) {
  const en = useLocale() === 'en'
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        {en ? 'Website' : 'Situs web'}
        <input ref={ref} type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  )
})

/** Polite live region listing errors after a failed submit. */
export function ErrorSummary({ errors, message }: { errors: Record<string, { message?: string } | undefined>; message?: string | null }) {
  const en = useLocale() === 'en'
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
      {message ? <p className="font-semibold text-danger">{en ? englishFormMessage(message) : message}</p> : null}
      {list.length > 1 ? (
        <ul className="mt-1 list-disc pl-5 text-sm text-danger">
          {list.map((text) => (
            <li key={text}>{en ? englishFormMessage(text) : text}</li>
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
export function Turnstile({ siteKey, onToken, resetKey = 0 }: { siteKey: string | null; onToken: (token: string) => void; resetKey?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const locale = useLocale()
  const en = locale === 'en'
  const onTokenRef = useRef(onToken)
  const [scriptFailed, setScriptFailed] = useState(false)
  const [retry, setRetry] = useState(0)
  useEffect(() => { onTokenRef.current = onToken }, [onToken])
  useEffect(() => {
    if (!siteKey || !ref.current) return
    let disposed = false
    let widgetId: string | null = null
    setScriptFailed(false)
    onTokenRef.current('')
    const mount = () => {
      if (!disposed && window.turnstile && ref.current && widgetId === null) {
        widgetId = window.turnstile.render(ref.current, {
          sitekey: siteKey, language: locale,
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(''),
          'error-callback': () => onTokenRef.current(''),
        })
      }
    }
    let script = document.querySelector<HTMLScriptElement>('script[data-arus-turnstile]')
    if (!window.turnstile && !script) {
      script = document.createElement('script')
      script.dataset.arusTurnstile = 'true'
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      document.head.appendChild(script)
    }
    const handleScriptError = () => {
      script?.remove()
      if (!disposed) setScriptFailed(true)
    }
    script?.addEventListener('load', mount)
    script?.addEventListener('error', handleScriptError)
    mount()
    return () => {
      disposed = true
      script?.removeEventListener('load', mount)
      script?.removeEventListener('error', handleScriptError)
      if (widgetId !== null) window.turnstile?.remove(widgetId)
    }
  }, [siteKey, resetKey, retry, locale])
  if (!siteKey) return null
  return (
    <div>
      <div ref={ref} className={scriptFailed ? 'hidden' : 'min-h-[65px]'} />
      {scriptFailed ? (
        <div>
          <p role="alert">{en ? 'Security verification could not be loaded.' : 'Verifikasi keamanan gagal dimuat.'}</p>
          <button type="button" className="mt-1 font-semibold underline" onClick={() => setRetry((value) => value + 1)}>{en ? 'Reload verification' : 'Muat ulang verifikasi'}</button>
        </div>
      ) : null}
    </div>
  )
}
