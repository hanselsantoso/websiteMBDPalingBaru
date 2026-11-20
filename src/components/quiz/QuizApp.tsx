'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { m } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { submitQuizAction, submitQuizLeadAction } from '@/app/(frontend)/actions'
import { PrimaryCta, SecondaryActions } from '@/components/cta/CtaLinks'
import { ConsentField, Honeypot, TextField } from '@/components/forms/fields'
import { FailureNote } from '@/components/forms/Feedback'
import { Siasat } from '@/components/mascot/Siasat'
import { CountUp } from '@/components/motion/Interactive'
import { Star, StarField } from '@/components/patterns/Patterns'
import { useSite } from '@/components/providers/SiteProvider'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { sessionId, track } from '@/lib/analytics'
import { isSiasatPose } from '@/lib/brand/mascot'
import { displayCourseCode } from '@/lib/domain/curriculum'
import { bandFor, DEFAULT_BANDS, DIMENSIONS, type ScoreBand } from '@/lib/domain/quiz'
import { springs } from '@/lib/motion'
import type { PublicQuizQuestion } from '@/lib/queries'
import { quizLeadSchema, type QuizLeadInput } from '@/lib/schemas'
import type { QuizResultPayload } from '@/server/services/forms'
import { cn } from '@/lib/utils'
import { renderShareCard } from './shareCard'

type Phase = 'intro' | 'question' | 'submitting' | 'result'

function LeadCapture({ attemptId, heading }: { attemptId: string; heading?: string | null }) {
  const site = useSite()
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<QuizLeadInput>({
    resolver: zodResolver(quizLeadSchema),
    defaultValues: { attemptId, name: '', phone: '', consent: false, website: '' },
  })
  const { errors } = form.formState

  if (done) {
    return (
      <p
        className="flex items-center gap-3 rounded-2xl border-2 border-navy bg-lime p-4 font-semibold text-navy"
        role="status"
      >
        <Icon name="check" size={20} strokeWidth={2.5} /> Siap! Hasil dan brosurnya akan kami kirim
        lewat WhatsApp.
      </p>
    )
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) => {
        setServerError(null)
        startTransition(async () => {
          const result = await submitQuizLeadAction({ ...values, ...site.utm })
          if (!result.ok) {
            setServerError(result.message)
            return
          }
          setDone(true)
        })
      })}
      className="grid gap-4 rounded-[28px] border-2 border-navy bg-white p-6"
    >
      <h3 className="text-xl font-bold">{heading || 'Mau hasil ini dikirim ke WhatsApp-mu?'}</h3>
      <FailureNote message={serverError} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="kuis-name"
          label="Nama"
          autoComplete="name"
          error={errors.name?.message}
          {...form.register('name')}
        />
        <TextField
          id="kuis-phone"
          label="Nomor WhatsApp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...form.register('phone')}
        />
      </div>
      <ConsentField
        id="kuis-consent"
        privacyHref={site.privacyHref}
        error={errors.consent?.message}
        {...form.register('consent')}
      />
      <Honeypot {...form.register('website')} />
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? 'Menyimpan…' : 'Kirim ke WhatsApp'} <Icon name="whatsapp" size={18} />
      </Button>
    </form>
  )
}

export function QuizApp({
  questions,
  introTitle,
  introBody,
  disclaimer,
  bands,
  leadCapture,
  leadHeading,
}: {
  questions: PublicQuizQuestion[]
  introTitle?: string | null
  introBody?: string | null
  disclaimer?: string | null
  bands?: ScoreBand[] | null
  leadCapture?: boolean | null
  leadHeading?: string | null
}) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<QuizResultPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sharing, setSharing] = useState(false)
  const [testMode, setTestMode] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [, startTransition] = useTransition()

  useEffect(() => setTestMode(new URLSearchParams(window.location.search).get('uji') === '1'), [])
  useEffect(() => {
    if (phase !== 'intro') headingRef.current?.focus({ preventScroll: true })
  }, [phase, index])

  if (!questions.length) {
    return (
      <div className="container-arus py-20 text-center">
        <Siasat pose="thinking" size="md" className="mx-auto" />
        <p className="mt-4 text-lg font-semibold">Pertanyaan kuis sedang disiapkan.</p>
      </div>
    )
  }

  const question = questions[index]
  const chosen = answers[question?.id]
  const usableBands = bands?.length ? bands : DEFAULT_BANDS

  const start = () => {
    setPhase('question')
    setIndex(0)
    setAnswers({})
    setResult(null)
    if (!testMode) track('quiz_start')
  }

  const submit = () => {
    setPhase('submitting')
    setError(null)
    startTransition(async () => {
      const response = await submitQuizAction({ answers, sessionId: sessionId(), isTest: testMode })
      if (!response.ok) {
        setError(response.message)
        setPhase('question')
        return
      }
      setResult(response.data)
      setPhase('result')
    })
  }

  const nextQuestion = () => {
    if (!chosen) return
    if (index < questions.length - 1) setIndex(index + 1)
    else submit()
  }

  const band = result ? bandFor(result.matchPercent, usableBands) : null

  const share = async (mode: 'download' | 'share') => {
    if (!result) return
    setSharing(true)
    try {
      const blob = await renderShareCard({
        archetype: result.result?.archetype ?? 'Strategis Digital',
        match: result.matchPercent,
        band: band?.label ?? '',
      })
      if (!blob) return
      const file = new File([blob], 'arketipe-mbd.png', { type: 'image/png' })
      if (mode === 'share' && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Arketipe strategisku',
          text: `Aku ${result.result?.archetype ?? ''} dengan kecocokan ${result.matchPercent}% di MBD ISTTS!`,
          url: window.location.href,
        })
      } else {
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = 'arketipe-mbd.png'
        anchor.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
    } catch {
      // user cancelled sharing
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="container-arus py-16 lg:py-24">
      {phase === 'intro' ? (
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label-mono text-blue">{questions.length} pertanyaan · ± 3 menit</p>
            <h2 ref={headingRef} tabIndex={-1} className="mt-3 text-section font-bold outline-none">
              {introTitle || 'Kamu cocok jadi strategis yang mana?'}
            </h2>
            {introBody ? <p className="mt-4 max-w-xl text-lead text-ink-600">{introBody}</p> : null}
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {DIMENSIONS.map((dimension) => (
                <li key={dimension.key} className="flex items-center gap-2 font-semibold">
                  <Star className="size-4 text-blue" /> {dimension.label}
                </li>
              ))}
            </ul>
            <Button onClick={start} className="mt-8">
              Mulai kuis <Icon name="arrow-right" size={18} strokeWidth={2.5} />
            </Button>
            {testMode ? (
              <p className="label-mono mt-4 text-danger">
                Mode uji: hasil tidak dihitung sebagai lead.
              </p>
            ) : null}
            {disclaimer ? <p className="mt-6 text-sm text-ink-600">{disclaimer}</p> : null}
          </div>
          <div className="justify-self-center lg:col-span-5">
            <Siasat pose="thinking" size="lg" interactive showArtTag />
          </div>
        </div>
      ) : null}

      {phase === 'question' && question ? (
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ol
              className="flex flex-wrap gap-1.5"
              aria-label={`Pertanyaan ${index + 1} dari ${questions.length}`}
            >
              {questions.map((item, position) => (
                <li key={item.id} aria-hidden="true">
                  <Star
                    className={cn(
                      'size-6 transition-colors duration-200',
                      answers[item.id]
                        ? 'text-blue'
                        : position === index
                          ? 'text-navy'
                          : 'text-ink-200',
                    )}
                  />
                </li>
              ))}
            </ol>
            <p className="label-mono mt-4 text-blue">
              Pertanyaan {index + 1} dari {questions.length}
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                nextQuestion()
              }}
            >
              <fieldset>
                <legend className="w-full">
                  <h2
                    ref={headingRef}
                    tabIndex={-1}
                    className="mt-3 text-title font-bold outline-none"
                  >
                    {question.text}
                  </h2>
                  {question.helpText ? (
                    <span className="mt-2 block text-ink-600">{question.helpText}</span>
                  ) : null}
                </legend>
                {question.image?.url ? (
                  <Image
                    src={question.image.url}
                    alt={question.image.alt ?? ''}
                    width={question.image.width ?? 800}
                    height={question.image.height ?? 450}
                    className="mt-5 h-auto w-full max-w-lg rounded-[24px] border-2 border-navy"
                  />
                ) : null}
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const selected = chosen === option.id
                    return (
                      <label
                        key={option.id}
                        className={cn(
                          'flex min-h-20 cursor-pointer items-center gap-4 rounded-[20px] border-2 border-navy p-4 text-lg font-semibold transition-[transform,background-color] duration-150 active:scale-[0.98]',
                          selected
                            ? 'bg-navy text-white shadow-hard-cyan'
                            : 'bg-white hover:bg-ink-50',
                        )}
                      >
                        <input
                          type="radio"
                          name={`q-${question.id}`}
                          value={option.id}
                          checked={selected}
                          onChange={() =>
                            setAnswers((current) => ({ ...current, [question.id]: option.id }))
                          }
                          className="size-5 shrink-0 accent-[var(--brand-lime)]"
                        />
                        {option.label}
                      </label>
                    )
                  })}
                </div>
              </fieldset>
              <FailureNote message={error} />
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                {index > 0 ? (
                  <Button variant="secondary" onClick={() => setIndex(index - 1)}>
                    <Icon name="arrow-left" size={18} strokeWidth={2.5} /> Kembali
                  </Button>
                ) : (
                  <span />
                )}
                <Button type="submit" disabled={!chosen}>
                  {index < questions.length - 1 ? 'Lanjut' : 'Lihat hasil'}{' '}
                  <Icon name="arrow-right" size={18} strokeWidth={2.5} />
                </Button>
              </div>
            </form>
          </div>
          <div className="hidden justify-self-center lg:col-span-4 lg:block">
            <Siasat pose="thinking" size="md" decorative />
          </div>
        </div>
      ) : null}

      {phase === 'submitting' ? (
        <div className="grid justify-items-center gap-4 py-16 text-center" role="status">
          <Siasat pose="thinking" size="md" />
          <p className="text-lg font-semibold">Sia sedang membaca pola jawabanmu…</p>
        </div>
      ) : null}

      {phase === 'result' && result ? (
        <div className="grid gap-8">
          <section className="relative isolate overflow-hidden rounded-[32px] border-2 border-navy bg-navy p-7 text-white shadow-[6px_6px_0_0_var(--brand-blue)] sm:p-10">
            <StarField tone="lime" count={5} />
            <div className="relative grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p className="label-mono text-lime">Kecocokan dengan MBD</p>
                <p className="mt-2 font-display text-[clamp(4.5rem,3rem+8vw,9rem)] leading-none font-extrabold tracking-[-0.05em] text-lime">
                  <CountUp value={result.matchPercent} />%
                </p>
                {band ? (
                  <p className="mt-3 text-xl font-bold">
                    {band.label}
                    {band.description ? (
                      <span className="block text-base font-normal text-white/75">
                        {band.description}
                      </span>
                    ) : null}
                  </p>
                ) : null}
                <p className="label-mono mt-8 text-white/70">Arketipe strategismu</p>
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="mt-2 text-[clamp(2.25rem,1.4rem+3.6vw,4.25rem)] leading-[1.02] font-extrabold tracking-[-0.03em] outline-none"
                >
                  {result.result?.archetype ?? 'Strategis Digital'}
                </h2>
                {result.result?.description ? (
                  <p className="mt-4 max-w-2xl text-lead text-white/85">
                    {result.result.description}
                  </p>
                ) : null}
                {result.result?.traits?.length ? (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {result.result.traits.map((trait) => (
                      <li
                        key={trait}
                        className="label-mono rounded-full border-2 border-lime px-3 py-1 text-lime"
                      >
                        {trait}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div className="justify-self-center lg:col-span-4">
                <Siasat
                  pose={isSiasatPose(result.result?.pose) ? result.result.pose : 'celebrating'}
                  size="lg"
                  onDark
                  interactive
                />
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-12">
            <section className="sticker p-6 lg:col-span-5" aria-labelledby="dimensi-judul">
              <h3 id="dimensi-judul" className="text-xl font-bold">
                Kekuatanmu di empat dimensi
              </h3>
              <ul className="mt-5 grid gap-4">
                {DIMENSIONS.map((dimension) => {
                  const value = Math.round((result.normalized[dimension.key] ?? 0) * 100)
                  return (
                    <li key={dimension.key} className="grid gap-1.5">
                      <div className="flex justify-between gap-3 font-semibold">
                        <span>{dimension.label}</span>
                        <span className="font-mono tabular-nums">{value}%</span>
                      </div>
                      <span className="block h-3 overflow-hidden rounded-full bg-ink-100">
                        <m.span
                          className="block h-full origin-left rounded-full bg-blue"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: value / 100 }}
                          transition={{ ...springs.soft, delay: 0.2 }}
                        />
                      </span>
                    </li>
                  )
                })}
              </ul>
            </section>
            <section className="sticker p-6 lg:col-span-7" aria-labelledby="cocok-judul">
              <h3 id="cocok-judul" className="text-xl font-bold">
                Semester dan mata kuliah yang paling nyambung
              </h3>
              {result.result?.semesters?.length ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {result.result.semesters.map((semester) => (
                    <li
                      key={semester}
                      className="label-mono rounded-full bg-navy px-3 py-1.5 text-white"
                    >
                      Semester {semester}
                    </li>
                  ))}
                </ul>
              ) : null}
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {(result.result?.courses ?? []).map((course) => (
                  <li key={course.slug}>
                    <Link
                      href={`/kurikulum/${course.slug}`}
                      className="flex min-h-12 items-center gap-3 rounded-xl border-2 border-navy px-3 font-semibold hover:bg-ink-50"
                    >
                      <span className="font-mono text-xs text-blue">
                        {displayCourseCode(course.code)}
                      </span>
                      {course.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={() => share('download')} disabled={sharing}>
              <Icon name="download" size={18} strokeWidth={2.5} /> Unduh kartu hasil
            </Button>
            <Button variant="secondary" onClick={() => share('share')} disabled={sharing}>
              <Icon name="share" size={18} strokeWidth={2.5} /> Bagikan
            </Button>
            <Button variant="ghost" onClick={start}>
              Ulangi kuis
            </Button>
          </div>

          {leadCapture && !testMode ? (
            <LeadCapture attemptId={result.attemptId} heading={leadHeading} />
          ) : null}

          <div className="flex flex-col gap-5 rounded-[28px] bg-navy p-7 text-white sm:p-9">
            <h3 className="text-title font-bold">
              Siap mulai jadi {result.result?.archetype ?? 'strategis digital'}?
            </h3>
            <PrimaryCta id="quiz-result" tone="dark" placement="quiz-result" />
            <SecondaryActions placement="quiz-result" />
          </div>
          {disclaimer ? <p className="text-sm text-ink-600">{disclaimer}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
