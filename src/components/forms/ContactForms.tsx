'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { submitConsultationAction, submitContactAction } from '@/app/(frontend)/actions'
import { useSite } from '@/components/providers/SiteProvider'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { track } from '@/lib/analytics'
import {
  CONTACT_TOPICS,
  TIME_SLOTS,
  consultationSchema,
  contactSchema,
  type ConsultationInput,
  type ContactInput,
} from '@/lib/schemas'
import { cn } from '@/lib/utils'
import { FailureNote, SuccessPanel } from './Feedback'
import {
  ConsentField,
  ErrorSummary,
  Honeypot,
  SelectField,
  TextareaField,
  TextField,
  Turnstile,
} from './fields'

export function ContactForm() {
  const site = useSite()
  const [pending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      topic: '',
      message: '',
      consent: false,
      website: '',
    },
  })
  const { errors } = form.formState

  const submit = form.handleSubmit((values) => {
    setServerError(null)
    startTransition(async () => {
      const result = await submitContactAction({ ...values, ...site.utm })
      if (!result.ok) {
        setServerError(result.message)
        Object.entries(result.fieldErrors ?? {}).forEach(([field, message]) =>
          form.setError(field as keyof ContactInput, { message }),
        )
        return
      }
      track('contact_submit', { topic: values.topic })
      setSentTo(values.name)
      form.reset()
    })
  })

  if (sentTo !== null) {
    return (
      <SuccessPanel
        title={`Pesanmu sudah kami terima${sentTo ? `, ${sentTo.split(' ')[0]}` : ''}!`}
      >
        <p className="max-w-md text-ink-600">
          Tim kami akan membalas lewat email atau WhatsApp pada jam layanan.
        </p>
        <Button variant="secondary" onClick={() => setSentTo(null)}>
          Kirim pesan lain
        </Button>
      </SuccessPanel>
    )
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="grid gap-5 rounded-[28px] border-2 border-navy bg-white p-6 shadow-hard sm:p-8"
    >
      <ErrorSummary errors={errors} message={null} />
      <FailureNote message={serverError} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="kontak-name"
          label="Nama lengkap"
          autoComplete="name"
          error={errors.name?.message}
          {...form.register('name')}
        />
        <TextField
          id="kontak-email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...form.register('email')}
        />
        <TextField
          id="kontak-phone"
          label="Nomor WhatsApp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0812 3456 7890"
          error={errors.phone?.message}
          {...form.register('phone')}
        />
        <SelectField
          id="kontak-topic"
          label="Topik"
          options={[...CONTACT_TOPICS]}
          error={errors.topic?.message}
          {...form.register('topic')}
        />
      </div>
      <TextareaField
        id="kontak-message"
        label="Pesan"
        rows={6}
        error={errors.message?.message}
        {...form.register('message')}
      />
      <ConsentField
        id="kontak-consent"
        privacyHref={site.privacyHref}
        error={errors.consent?.message}
        {...form.register('consent')}
      />
      <Honeypot {...form.register('website')} />
      <Turnstile
        siteKey={site.turnstileSiteKey}
        onToken={(token) => form.setValue('turnstileToken', token)}
      />
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? 'Mengirim…' : 'Kirim pesan'}
        <Icon name="arrow-right" size={18} strokeWidth={2.5} />
      </Button>
    </form>
  )
}

export function ConsultationForm() {
  const site = useSite()
  const [pending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [minDate, setMinDate] = useState<string | undefined>(undefined)
  const form = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      preferredDate: '',
      timeSlot: '',
      message: '',
      consent: false,
      website: '',
    },
  })
  const { errors } = form.formState
  const slot = form.watch('timeSlot')

  useEffect(() => setMinDate(new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10)), [])

  const submit = form.handleSubmit((values) => {
    setServerError(null)
    startTransition(async () => {
      const result = await submitConsultationAction({ ...values, ...site.utm })
      if (!result.ok) {
        setServerError(result.message)
        Object.entries(result.fieldErrors ?? {}).forEach(([field, message]) =>
          form.setError(field as keyof ConsultationInput, { message }),
        )
        return
      }
      track('contact_submit', { kind: 'konsultasi' })
      setDone(true)
      form.reset()
    })
  })

  if (done) {
    return (
      <SuccessPanel title="Jadwal konsultasi tercatat!">
        <p className="max-w-md text-ink-600">
          Tim kami akan mengonfirmasi jadwalnya lewat WhatsApp.
        </p>
        <Button variant="secondary" onClick={() => setDone(false)}>
          Atur jadwal lain
        </Button>
      </SuccessPanel>
    )
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="grid gap-5 rounded-[28px] border-2 border-navy bg-ink-50 p-6 sm:p-8"
    >
      <ErrorSummary errors={errors} message={null} />
      <FailureNote message={serverError} />
      <div className="grid gap-5 sm:grid-cols-3">
        <TextField
          id="konsul-name"
          label="Nama lengkap"
          autoComplete="name"
          error={errors.name?.message}
          {...form.register('name')}
        />
        <TextField
          id="konsul-email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...form.register('email')}
        />
        <TextField
          id="konsul-phone"
          label="Nomor WhatsApp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...form.register('phone')}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-[minmax(0,14rem)_1fr]">
        <TextField
          id="konsul-date"
          label="Tanggal"
          type="date"
          min={minDate}
          error={errors.preferredDate?.message}
          {...form.register('preferredDate')}
        />
        <fieldset className="grid gap-1.5">
          <legend className="font-semibold">Slot waktu</legend>
          <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
            {TIME_SLOTS.map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border-2 border-navy bg-white px-3 text-sm font-semibold',
                  slot === option.value && 'bg-navy text-white',
                )}
              >
                <input
                  type="radio"
                  value={option.value}
                  className="size-4 accent-[var(--brand-lime)]"
                  {...form.register('timeSlot')}
                />
                {option.label}
              </label>
            ))}
          </div>
          {errors.timeSlot?.message ? (
            <p className="text-sm font-semibold text-danger">{errors.timeSlot.message}</p>
          ) : null}
        </fieldset>
      </div>
      <TextareaField
        id="konsul-message"
        label="Yang ingin dibahas"
        optional
        rows={3}
        error={errors.message?.message}
        {...form.register('message')}
      />
      <ConsentField
        id="konsul-consent"
        privacyHref={site.privacyHref}
        error={errors.consent?.message}
        {...form.register('consent')}
      />
      <Honeypot {...form.register('website')} />
      <Turnstile
        siteKey={site.turnstileSiteKey}
        onToken={(token) => form.setValue('turnstileToken', token)}
      />
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? 'Menyimpan…' : 'Jadwalkan konsultasi'}
        <Icon name="calendar" size={18} strokeWidth={2.5} />
      </Button>
    </form>
  )
}
