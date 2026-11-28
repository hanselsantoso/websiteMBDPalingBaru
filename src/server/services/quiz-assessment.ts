import type { Payload, Where } from 'payload'
import rubric from '../../../seed/quiz-kemampuan-mbd-v1.json'
import { QUIZ_ASSESSMENT_MARKER_PREFIX, QUIZ_ASSESSMENT_VERSION, scoreQuiz, type DimensionKey, type QuizAssessmentReview } from '@/lib/domain/quiz'

type RubricCase = {
  code: string
  dimension: DimensionKey
  text: string
  options: { label: string; points: number }[]
  explanation: string
}

const cases = rubric as RubricCase[]
const marker = (code: string) => `${QUIZ_ASSESSMENT_MARKER_PREFIX}1 · ${code}`
const markers = cases.map((item) => marker(item.code))

export const LEGACY_QUIZ_WHERE: Where = {
  isActive: { equals: true },
  or: [{ helpText: { exists: false } }, { helpText: { not_like: `${QUIZ_ASSESSMENT_MARKER_PREFIX}%` } }],
}

type AssessmentQuestion = {
  id: string
  text: string
  dimension: DimensionKey
  explanation: string
  options: { id: string; label: string; points: number }[]
}

/** Publish or score a complete, known rubric. An edited item requires a new reviewed version. */
export async function loadAssessmentQuiz(payload: Payload): Promise<AssessmentQuestion[]> {
  const { docs } = await payload.find({
    collection: 'quiz-questions',
    where: { isActive: { equals: true }, helpText: { in: markers } },
    limit: markers.length + 1,
    depth: 0,
    overrideAccess: false,
  })
  if (docs.length !== cases.length) return []

  const questions: AssessmentQuestion[] = []
  for (const item of cases) {
    const matches = docs.filter((doc) => doc.helpText === marker(item.code))
    const question = matches[0]
    if (matches.length !== 1 || question.text !== item.text || question.options?.length !== item.options.length) return []
    const options = question.options.flatMap(({ label }) => {
      const choice = item.options.findIndex((option) => option.label === label)
      if (choice === -1) return []
      return [{
        id: `${QUIZ_ASSESSMENT_VERSION}:${item.code}:${choice}`,
        label,
        points: item.options[choice].points,
      }]
    })
    if (options.length !== item.options.length || new Set(options.map((option) => option.label)).size !== options.length) return []

    questions.push({
      id: String(question.id),
      text: question.text,
      dimension: item.dimension,
      explanation: item.explanation,
      options,
    })
  }
  return questions
}

export function evaluateAssessment(questions: AssessmentQuestion[], answers: Record<string, string>) {
  if (questions.length !== cases.length || Object.keys(answers).length !== questions.length) return null

  const review: QuizAssessmentReview[] = []
  for (const question of questions) {
    const selected = question.options.find((option) => option.id === answers[question.id])
    const best = question.options.find((option) => option.points === 5)
    if (!selected || !best) return null
    review.push({
      id: question.id,
      dimension: question.dimension,
      question: question.text,
      selected: selected.label,
      bestAnswer: best.label,
      explanation: question.explanation,
      points: selected.points,
    })
  }

  const score = scoreQuiz(
    questions.map(({ id, dimension, options }) => ({
      id,
      options: options.map(({ id: optionId, points }) => ({ id: optionId, weights: { [dimension]: points } })),
    })),
    answers,
  )
  return { score, assessment: { version: QUIZ_ASSESSMENT_VERSION, review } }
}
