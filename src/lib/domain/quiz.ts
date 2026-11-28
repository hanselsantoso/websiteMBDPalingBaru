export const DIMENSIONS = [
  { key: 'bisnis', label: 'Bisnis dan Strategi', short: 'Bisnis' },
  { key: 'data', label: 'Data dan Analitik', short: 'Data' },
  { key: 'teknologi', label: 'Teknologi dan AI', short: 'Teknologi' },
  { key: 'kreatif', label: 'Kreatif dan Produk', short: 'Kreatif' },
] as const

export type DimensionKey = (typeof DIMENSIONS)[number]['key']
export type DimensionScores = Record<DimensionKey, number>
export const QUIZ_ASSESSMENT_VERSION = 'mbd-v1' as const
export const QUIZ_ASSESSMENT_MARKER_PREFIX = 'Asesmen MBD v'

export type QuizAssessmentReview = {
  id: string
  dimension: DimensionKey
  question: string
  selected: string
  bestAnswer: string
  explanation: string
  points: number
}

export const PAIR_KEYS = [
  'bisnis-data',
  'bisnis-teknologi',
  'bisnis-kreatif',
  'data-teknologi',
  'data-kreatif',
  'teknologi-kreatif',
] as const

export type PairKey = (typeof PAIR_KEYS)[number]

export type QuizOptionInput = {
  id: string
  weights?: Partial<Record<DimensionKey, number | null>> | null
}

export type QuizQuestionInput = {
  id: string
  options: QuizOptionInput[]
}

export type QuizScore = {
  raw: DimensionScores
  max: DimensionScores
  normalized: DimensionScores
  matchPercent: number
  topPair: [DimensionKey, DimensionKey]
  pairKey: PairKey
  answered: number
  total: number
}

const ORDER = DIMENSIONS.map((d) => d.key)

const zero = (): DimensionScores => ({ bisnis: 0, data: 0, teknologi: 0, kreatif: 0 })

const clampWeight = (value: unknown): number => {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.min(5, Math.max(0, n))
}

export function pairKeyOf(a: DimensionKey, b: DimensionKey): PairKey {
  const [first, second] = [a, b].sort((x, y) => ORDER.indexOf(x) - ORDER.indexOf(y))
  return `${first}-${second}` as PairKey
}

/**
 * Scores answers against the four program dimensions.
 *
 * - raw: sum of chosen option weights per dimension
 * - max: best achievable weight per dimension (per question, the highest option weight)
 * - matchPercent: chosen total weight / best achievable total weight per question
 * - topPair: two strongest dimensions by normalized score, ties broken by dimension order
 */
export function scoreQuiz(
  questions: QuizQuestionInput[],
  answers: Record<string, string>,
): QuizScore {
  const raw = zero()
  const max = zero()
  let chosenTotal = 0
  let bestTotal = 0
  let answered = 0

  for (const question of questions) {
    const options = question.options ?? []
    if (!options.length) continue

    for (const key of ORDER) {
      max[key] += Math.max(0, ...options.map((o) => clampWeight(o.weights?.[key])))
    }
    bestTotal += Math.max(
      0,
      ...options.map((o) => ORDER.reduce((sum, key) => sum + clampWeight(o.weights?.[key]), 0)),
    )

    const chosen = options.find((o) => o.id === answers[question.id])
    if (!chosen) continue
    answered += 1
    for (const key of ORDER) {
      const weight = clampWeight(chosen.weights?.[key])
      raw[key] += weight
      chosenTotal += weight
    }
  }

  const normalized = zero()
  for (const key of ORDER) normalized[key] = max[key] > 0 ? raw[key] / max[key] : 0

  const ranked = [...ORDER].sort(
    (a, b) => normalized[b] - normalized[a] || ORDER.indexOf(a) - ORDER.indexOf(b),
  )
  const topPair: [DimensionKey, DimensionKey] = [ranked[0], ranked[1]]
  const matchPercent = bestTotal > 0 ? Math.round((chosenTotal / bestTotal) * 100) : 0

  return {
    raw,
    max,
    normalized,
    matchPercent: Math.min(100, Math.max(0, matchPercent)),
    topPair,
    pairKey: pairKeyOf(topPair[0], topPair[1]),
    answered,
    total: questions.length,
  }
}

export type ScoreBand = { min: number; label: string; description?: string | null }

/** Picks the band with the highest `min` that does not exceed the percentage. */
export function bandFor<T extends ScoreBand>(percent: number, bands: T[]): T | null {
  const sorted = [...bands].sort((a, b) => b.min - a.min)
  return sorted.find((band) => percent >= band.min) ?? sorted[sorted.length - 1] ?? null
}

export const DEFAULT_BANDS: ScoreBand[] = [
  { min: 80, label: 'Sangat cocok', description: 'Minat kamu nyambung banget dengan MBD.' },
  { min: 60, label: 'Cocok', description: 'Banyak hal di MBD yang sejalan dengan minatmu.' },
  { min: 40, label: 'Cukup cocok', description: 'Ada irisan yang menarik untuk kamu jelajahi.' },
  { min: 0, label: 'Masih menjajaki', description: 'Wajar kok. Coba ngobrol dulu dengan tim kami.' },
]
