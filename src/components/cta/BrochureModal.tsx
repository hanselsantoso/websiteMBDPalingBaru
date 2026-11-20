'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { requestBrochureAction } from '@/app/(frontend)/actions'
import { ConsentField, ErrorSummary, Honeypot, TextField, Turnstile } from '@/components/forms/fields'
import { Siasat } from '@/components/mascot/Siasat'
import { useSite } from '@/components/providers/SiteProvider'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { track } from '@/lib/analytics'
import { brochureSchema, type BrochureInput } from '@/lib/schemas'

export function BrochureModal({ placement, onClose }: { placement: string | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const site = useSite()
  const [pending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [result, setResult] = useState<{ downloadUrl: string | null } | null>(null)
  const form = useForm<BrochureInput>({
    resolver: zodResolver(brochureSchema),
    defaultValues: { name: '', phone: '', email: '', consent: false, website: '' },
  })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (placement && !dialog.open) {
      setResult(null)
      setServerError(null)
      dialog.showModal()
    }
    if (!placement && dialog.open) dialog.close()
  }, [placement])

  const submit = form.handleSubmit((values) => {
    setServerError(null)
    startTransition(async () => {
      const response = await requestBrochureAction({ ...values, ...site.utm })
      if (!response.ok) {
        setServerError(response.message)
        for (const [field, message] of Object.entries(response.fieldErrors ?? {})) {
          form.setError(field as keyof BrochureInput, { message })
        }
        return
      }
      track('brochure_download', { placement: placement ?? 'umum', available: Boolean(response.data.downloadUrl) })
      setResult(response.data)
      form.reset()
    })
  })

  const { errors } = form.formState

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close()
      }}
      aria-labelledby="brosur-title"
      className="m-auto w-[min(100%-2rem,34rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-[28px] border-2 border-navy bg-white p-0 text-navy shadow-hard-lg"
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="absolute top-4 right-4 grid size-11 place-items-center rounded-full border-2 border-navy bg-white hover:bg-ink-50"
          aria-label="Tutup jendela brosur"
        >
          <Icon name="close" size={18} strokeWidth={2.5} />
        </button>
        {result ? (
          <div className="grid justify-items-center gap-4 pt-8 text-center">
            <Siasat pose="celebrating" size="md" say={null} />
            <h2 id="brosur-title" className="text-title font-bold">
              {result.downloadUrl ? 'Brosur siap diunduh!' : 'Terima kasih, datamu sudah tercatat!'}
            </h2>
            <p className="max-w-sm text-ink-600">
              {result.downloadUrl
                ? 'Klik tombol di bawah untuk membuka brosur. Tautan ini berlaku 30 menit.'
                : 'Brosur digital sedang disiapkan. Tim kami akan mengirimkannya lewat WhatsApp.'}
            </p>
            {result.downloadUrl ? (
              <a href={result.downloadUrl} target="_blank" rel="noopener" className="pill border-2 border-navy bg-blue text-white shadow-hard">
                <Icon name="download" size={18} strokeWidth={2.5} /> Buka brosur (PDF)
              </a>
            ) : null}
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-5">
            <div className="pr-12">
              <p className="label-mono text-blue">Brosur MBD ISTTS</p>
              <h2 id="brosur-title" className="mt-2 text-title font-bold">
                Unduh brosur lengkap
              </h2>
              <p className="mt-2 text-ink-600">Isi data singkat ini, lalu brosur langsung bisa kamu buka.</p>
            </div>
            <ErrorSummary errors={errors} message={serverError} />
            <TextField label="Nama lengkap" autoComplete="name" error={errors.name?.message} {...form.register('name')} id="brosur-name" />
            <TextField
              label="Nomor WhatsApp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="0812 3456 7890"
              error={errors.phone?.message}
              {...form.register('phone')}
              id="brosur-phone"
            />
            <TextField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...form.register('email')} id="brosur-email" />
            <ConsentField id="brosur-consent" privacyHref={site.privacyHref} error={errors.consent?.message} {...form.register('consent')} />
            <Honeypot {...form.register('website')} />
            <Turnstile siteKey={site.turnstileSiteKey} resetKey={form.formState.submitCount} onToken={(token) => form.setValue('turnstileToken', token)} />
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? 'Menyimpan…' : 'Unduh brosur'}
              <Icon name="download" size={18} strokeWidth={2.5} />
            </Button>
          </form>
        )}
      </div>
    </dialog>
  )
}
