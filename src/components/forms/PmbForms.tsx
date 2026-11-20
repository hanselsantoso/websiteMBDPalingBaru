'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useEffect, useRef, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { checkPmbStatusAction, submitPmbAction } from '@/app/(frontend)/actions'
import { Siasat } from '@/components/mascot/Siasat'
import { useSite } from '@/components/providers/SiteProvider'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { track } from '@/lib/analytics'
import {
  pmbApplicationSchema,
  pmbStatusSchema,
  type PmbApplicationInput,
  type PmbStatusInput,
} from '@/lib/schemas'
import { cn, formatDateTime } from '@/lib/utils'
import type { PmbSubmissionData } from '@/server/services/forms'
import { buildUploadPolicy, validateUploadMetadata } from '@/lib/upload-policy'
import { FailureNote, SuccessPanel } from './Feedback'
import { ConsentField, ErrorSummary, Honeypot, SelectField, TextField, Turnstile } from './fields'

type Option = { id: string; name: string; description?: string | null; note?: string | null }

const STEPS: { title: string; fields: (keyof PmbApplicationInput)[] }[] = [
  { title: 'Data diri', fields: ['fullName', 'email', 'phone', 'city'] },
  { title: 'Sekolah asal', fields: ['schoolName', 'schoolMajor', 'graduationYear'] },
  { title: 'Pilihan pendaftaran', fields: ['trackId', 'waveId', 'source'] },
  { title: 'Persetujuan', fields: ['consent'] },
]


export function PmbForm({
  tracks,
  waves,
  sources,
  documentUpload,
  maxDocumentMb,
  successTitle,
  successBody,
}: {
  tracks: Option[]
  waves: Option[]
  sources: string[]
  documentUpload: boolean
  maxDocumentMb: number
  successTitle?: string | null
  successBody?: string | null
}) {
  const site = useSite()
  const container = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [step, setStep] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [result, setResult] = useState<PmbSubmissionData | null>(null)
  const [copied, setCopied] = useState(false)
  const [pending, startTransition] = useTransition()
  const form = useForm<PmbApplicationInput>({
    resolver: zodResolver(pmbApplicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      city: '',
      schoolName: '',
      schoolMajor: '',
      graduationYear: '',
      trackId: '',
      waveId: waves.length === 1 ? waves[0].id : '',
      source: '',
      consent: false,
      website: '',
    },
    mode: 'onTouched',
  })
  const { errors } = form.formState
  const trackId = form.watch('trackId')
  const waveId = form.watch('waveId')

  const { setStickySuppressed } = site
  useEffect(() => {
    const node = container.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setStickySuppressed(entry.isIntersecting),
      { threshold: 0.15 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      setStickySuppressed(false)
    }
  }, [setStickySuppressed])

  const goTo = (next: number) => {
    setStep(next)
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }))
  }

  const next = async () => {
    if (await form.trigger(STEPS[step].fields)) goTo(step + 1)
  }

  const onFiles = (list: FileList | null) => {
    setFileError(null)
    const picked = Array.from(list ?? [])
    const invalid = validateUploadMetadata(picked, buildUploadPolicy(maxDocumentMb))
    if (invalid) {
      setFileError(`${invalid} Batas per dokumen: ${maxDocumentMb} MB.`)
      return
    }
    setFiles(picked)
  }

  const submit = form.handleSubmit(
    (values) => {
      setServerError(null)
      startTransition(async () => {
        const data = new FormData()
        data.set('payload', JSON.stringify({ ...values, ...site.utm }))
        files.forEach((file) => {
          data.append('documents', file)
          data.append('documentKinds', 'lainnya')
        })
        const response = await submitPmbAction(data)
        if (!response.ok) {
          setServerError(response.message)
          const fieldErrors = response.fieldErrors ?? {}
          Object.entries(fieldErrors).forEach(([field, message]) =>
            form.setError(field as keyof PmbApplicationInput, { message }),
          )
          const firstStep = STEPS.findIndex((item) =>
            item.fields.some((field) => field in fieldErrors),
          )
          if (firstStep >= 0) goTo(firstStep)
          return
        }
        track('pmb_submit', {
          track: tracks.find((item) => item.id === values.trackId)?.name ?? '',
        })
        setResult(response.data)
      })
    },
    (invalid) => {
      const firstStep = STEPS.findIndex((item) => item.fields.some((field) => field in invalid))
      if (firstStep >= 0 && firstStep !== step) goTo(firstStep)
    },
  )

  if (result) {
    return (
      <div ref={container}>
        <SuccessPanel title={successTitle || 'Yeay! Langkah pertamamu sudah tercatat.'}>
          <p className="label-mono text-ink-600">Nomor pendaftaranmu</p>
          <p className="rounded-2xl border-2 border-navy bg-lime px-5 py-3 font-mono text-3xl font-bold tracking-wider text-navy">
            {result.regNumber}
          </p>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(result.regNumber)
                setCopied(true)
              } catch {
                setCopied(false)
              }
            }}
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-blue underline underline-offset-4"
          >
            <Icon name="link" size={18} /> {copied ? 'Tersalin!' : 'Salin nomor'}
          </button>
          <p className="max-w-md text-ink-600">
            {successBody ||
              'Simpan nomor ini. Tim PMB akan menghubungimu lewat WhatsApp untuk verifikasi.'}
          </p>
          {result.documents.some((document) => document.status === 'failed') ? (
            <div role="alert" className="max-w-md rounded-xl border-2 border-warning bg-white p-4 text-left text-navy">
              <p className="font-semibold">Pendaftaran tersimpan, tetapi beberapa dokumen belum tersimpan.</p>
              <ul className="mt-2 list-disc pl-5">
                {result.documents.filter((document) => document.status === 'failed').map((document, index) => (
                  <li key={`${document.name}-${index}`}>{document.name}</li>
                ))}
              </ul>
              <p className="mt-2">Hubungi tim PMB dengan nomor di atas untuk melengkapi dokumen. Tidak perlu mengirim pendaftaran ulang.</p>
            </div>
          ) : null}
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/pmb#cek-status"
              className="pill border-2 border-navy bg-blue text-white shadow-hard"
            >
              Cek status
            </Link>
            <Link href="/" className="pill border-2 border-navy bg-white text-navy">
              Kembali ke beranda
            </Link>
          </div>
        </SuccessPanel>
      </div>
    )
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div ref={container} className="rounded-[28px] border-2 border-navy bg-white shadow-hard">
      <div className="border-b-2 border-navy p-6 sm:p-8">
        <p className="label-mono text-blue">
          Langkah {step + 1} dari {STEPS.length}
        </p>
        <h3 ref={headingRef} tabIndex={-1} className="mt-2 text-title font-bold outline-none">
          {STEPS[step].title}
        </h3>
        <div className="mt-4 grid grid-cols-4 gap-2" aria-hidden="true">
          {STEPS.map((item, index) => (
            <span
              key={item.title}
              className={cn(
                'h-2 rounded-full transition-colors duration-300',
                index <= step ? 'bg-blue' : 'bg-ink-100',
              )}
            />
          ))}
        </div>
        <progress className="sr-only" value={progress} max={100}>
          {progress}%
        </progress>
      </div>
      <form onSubmit={submit} noValidate className="grid gap-5 p-6 sm:p-8">
        <ErrorSummary
          errors={Object.fromEntries(STEPS[step].fields.map((field) => [field, errors[field]]))}
          message={null}
        />
        <FailureNote message={serverError} />
        {step === 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="pmb-fullName"
              label="Nama lengkap"
              autoComplete="name"
              error={errors.fullName?.message}
              {...form.register('fullName')}
            />
            <TextField
              id="pmb-email"
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...form.register('email')}
            />
            <TextField
              id="pmb-phone"
              label="Nomor WhatsApp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="0812 3456 7890"
              error={errors.phone?.message}
              {...form.register('phone')}
            />
            <TextField
              id="pmb-city"
              label="Kota domisili"
              autoComplete="address-level2"
              error={errors.city?.message}
              {...form.register('city')}
            />
          </div>
        ) : null}
        {step === 1 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="pmb-schoolName"
              label="Nama sekolah"
              autoComplete="organization"
              error={errors.schoolName?.message}
              className="sm:col-span-2"
              {...form.register('schoolName')}
            />
            <TextField
              id="pmb-schoolMajor"
              label="Jurusan"
              placeholder="IPS, IPA, Akuntansi, …"
              error={errors.schoolMajor?.message}
              {...form.register('schoolMajor')}
            />
            <TextField
              id="pmb-graduationYear"
              label="Tahun lulus"
              inputMode="numeric"
              maxLength={4}
              placeholder="2026"
              error={errors.graduationYear?.message}
              {...form.register('graduationYear')}
            />
          </div>
        ) : null}
        {step === 2 ? (
          <div className="grid gap-6">
            <fieldset>
              <legend className="font-semibold">Jalur pendaftaran</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                {tracks.map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      'flex min-h-16 cursor-pointer items-start gap-3 rounded-2xl border-2 border-navy p-4',
                      trackId === item.id && 'bg-navy text-white',
                    )}
                  >
                    <input
                      type="radio"
                      value={item.id}
                      className="mt-1 size-4 accent-[var(--brand-lime)]"
                      {...form.register('trackId')}
                    />
                    <span className="font-semibold">{item.name}</span>
                  </label>
                ))}
              </div>
              {errors.trackId?.message ? (
                <p className="mt-2 text-sm font-semibold text-danger">{errors.trackId.message}</p>
              ) : null}
            </fieldset>
            <fieldset>
              <legend className="font-semibold">Gelombang</legend>
              {waves.length ? (
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {waves.map((item) => (
                    <label
                      key={item.id}
                      className={cn(
                        'flex min-h-16 cursor-pointer items-start gap-3 rounded-2xl border-2 border-navy p-4',
                        waveId === item.id && 'bg-navy text-white',
                      )}
                    >
                      <input
                        type="radio"
                        value={item.id}
                        className="mt-1 size-4 accent-[var(--brand-lime)]"
                        {...form.register('waveId')}
                      />
                      <span className="font-semibold">{item.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-ink-600">
                  Belum ada gelombang yang dibuka. Tinggalkan pesan di halaman Kontak agar kami
                  kabari.
                </p>
              )}
              {errors.waveId?.message ? (
                <p className="mt-2 text-sm font-semibold text-danger">{errors.waveId.message}</p>
              ) : null}
            </fieldset>
            <SelectField
              id="pmb-source"
              label="Dari mana kamu mengenal MBD?"
              options={sources.map((source) => ({ value: source, label: source }))}
              error={errors.source?.message}
              {...form.register('source')}
            />
          </div>
        ) : null}
        {step === 3 ? (
          <div className="grid gap-5">
            {documentUpload ? (
              <div className="grid gap-1.5">
                <label htmlFor="pmb-documents" className="font-semibold">
                  Dokumen pendukung{' '}
                  <span className="text-sm font-normal text-ink-600">(opsional)</span>
                </label>
                <p id="pmb-documents-hint" className="text-sm text-ink-600">
                  Rapor, ijazah/SKL, atau sertifikat. PDF, JPG, atau PNG, maksimal {maxDocumentMb}{' '}
                  MB per file, hingga 4 file.
                </p>
                <input
                  id="pmb-documents"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  aria-describedby="pmb-documents-hint"
                  onChange={(event) => onFiles(event.target.files)}
                  className="rounded-xl border-2 border-dashed border-navy bg-ink-50 p-3 text-base file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:font-semibold file:text-white"
                />
                {fileError ? (
                  <p className="text-sm font-semibold text-danger">{fileError}</p>
                ) : null}
                {files.length ? (
                  <ul className="text-sm text-ink-700">
                    {files.map((file) => (
                      <li key={file.name}>
                        {file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
            <dl className="grid gap-2 rounded-2xl bg-ink-50 p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="label-mono text-ink-600">Nama</dt>
                <dd className="font-semibold">{form.getValues('fullName')}</dd>
              </div>
              <div>
                <dt className="label-mono text-ink-600">WhatsApp</dt>
                <dd className="font-semibold">{form.getValues('phone')}</dd>
              </div>
              <div>
                <dt className="label-mono text-ink-600">Jalur</dt>
                <dd className="font-semibold">
                  {tracks.find((item) => item.id === trackId)?.name ?? '—'}
                </dd>
              </div>
              <div>
                <dt className="label-mono text-ink-600">Gelombang</dt>
                <dd className="font-semibold">
                  {waves.find((item) => item.id === waveId)?.name ?? '—'}
                </dd>
              </div>
            </dl>
            <ConsentField
              id="pmb-consent"
              privacyHref={site.privacyHref}
              error={errors.consent?.message}
              {...form.register('consent')}
            >
              Saya menyatakan data ini benar dan setuju data saya diproses untuk keperluan
              penerimaan mahasiswa baru sesuai UU Pelindungan Data Pribadi.
            </ConsentField>
            <Honeypot {...form.register('website')} />
            <Turnstile
              siteKey={site.turnstileSiteKey} resetKey={form.formState.submitCount}
              onToken={(token) => form.setValue('turnstileToken', token)}
            />
          </div>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {step > 0 ? (
            <Button variant="secondary" onClick={() => goTo(step - 1)}>
              <Icon name="arrow-left" size={18} strokeWidth={2.5} /> Kembali
            </Button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>
              Lanjut <Icon name="arrow-right" size={18} strokeWidth={2.5} />
            </Button>
          ) : (
            <Button type="submit" disabled={pending}>
              {pending ? 'Mengirim…' : 'Kirim pra-pendaftaran'}
              <Icon name="check" size={18} strokeWidth={2.5} />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

const STATUS_TONE: Record<string, string> = {
  baru: 'bg-ink-100 text-navy',
  terverifikasi: 'bg-blue text-white',
  seleksi: 'bg-blue text-white',
  lulus: 'bg-lime text-navy ring-2 ring-navy',
  'daftar-ulang': 'bg-lime text-navy ring-2 ring-navy',
  'tidak-lanjut': 'bg-ink-200 text-navy',
}

export function StatusChecker({ intro }: { intro?: string | null }) {
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<{
    status: string
    statusLabel: string
    updatedAt: string
    waveName: string
    trackName: string
  } | null>(null)
  const [notFound, setNotFound] = useState<string | null>(null)
  const form = useForm<PmbStatusInput>({
    resolver: zodResolver(pmbStatusSchema),
    defaultValues: { regNumber: '', phoneSuffix: '' },
  })
  const { errors } = form.formState

  const submit = form.handleSubmit((values) => {
    setNotFound(null)
    setResult(null)
    startTransition(async () => {
      const response = await checkPmbStatusAction(values)
      if (!response.ok) {
        setNotFound(response.message)
        return
      }
      setResult(response.data)
    })
  })

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <form
        onSubmit={submit}
        noValidate
        className="grid gap-5 rounded-[28px] border-2 border-navy bg-white p-6 sm:p-8 lg:col-span-7"
      >
        {intro ? <p className="text-ink-600">{intro}</p> : null}
        <div className="grid gap-5 sm:grid-cols-[1fr_12rem]">
          <TextField
            id="status-reg"
            label="Nomor pendaftaran"
            placeholder="MBD-2026-0001"
            autoCapitalize="characters"
            error={errors.regNumber?.message}
            {...form.register('regNumber')}
          />
          <TextField
            id="status-phone"
            label="4 digit terakhir WhatsApp"
            inputMode="numeric"
            maxLength={4}
            placeholder="7890"
            error={errors.phoneSuffix?.message}
            {...form.register('phoneSuffix')}
          />
        </div>
        <Button type="submit" disabled={pending} className="w-full sm:w-fit">
          {pending ? 'Memeriksa…' : 'Cek status'}
          <Icon name="search" size={18} strokeWidth={2.5} />
        </Button>
      </form>
      <div className="lg:col-span-5" aria-live="polite">
        {result ? (
          <div className="grid gap-3 rounded-[28px] border-2 border-navy bg-navy p-6 text-white">
            <p className="label-mono text-lime">Status terkini</p>
            <p
              className={cn(
                'w-fit rounded-full px-4 py-1.5 font-display text-2xl font-bold',
                STATUS_TONE[result.status] ?? 'bg-white text-navy',
              )}
            >
              {result.statusLabel}
            </p>
            <p className="text-white/80">
              {[result.trackName, result.waveName].filter(Boolean).join(' · ')}
            </p>
            <p className="label-mono text-white/60">
              Diperbarui {formatDateTime(result.updatedAt)} WIB
            </p>
          </div>
        ) : notFound ? (
          <div className="flex items-center gap-4 rounded-[28px] border-2 border-dashed border-navy p-6">
            <Siasat pose="confused" size="sm" decorative />
            <p className="font-semibold">{notFound}</p>
          </div>
        ) : (
          <div className="flex h-full items-center gap-4 rounded-[28px] border-2 border-dashed border-ink-300 p-6 text-ink-600">
            <Siasat pose="thinking" size="sm" decorative />
            <p>Hasil cek status akan muncul di sini.</p>
          </div>
        )}
      </div>
    </div>
  )
}
