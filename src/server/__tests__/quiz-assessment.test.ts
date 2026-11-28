import type { Payload } from 'payload'
import { describe, expect, it, vi } from 'vitest'
import rubric from '../../../seed/quiz-kemampuan-mbd-v1.json'
import { fetchQuiz } from '@/lib/queries'
import { evaluateAssessment, loadAssessmentQuiz } from '@/server/services/quiz-assessment'

function questionDocuments() {
  return rubric.map(({ code, text, options }) => ({
    id: code,
    text,
    helpText: `Asesmen MBD v1 · ${code}`,
    options: options.map(({ label }, index) => ({ id: `${code}-${index}`, label })),
  }))
}

function quizPayload(docs = questionDocuments()) {
  return { find: vi.fn().mockResolvedValue({ docs }) } as unknown as Payload
}

describe('MBD ability assessment', () => {
  it('scores all 12 cases against the four independently measured abilities', async () => {
    const questions = await loadAssessmentQuiz(quizPayload())
    const answers = (points: number, dataPoints = points) => Object.fromEntries(
      questions.map(({ id, dimension, options }) => [
        id,
        options.find((option) => option.points === (dimension === 'data' ? dataPoints : points))!.id,
      ]),
    )
    const full = evaluateAssessment(questions, answers(5))
    expect(full?.score).toMatchObject({
      raw: { bisnis: 15, data: 15, teknologi: 15, kreatif: 15 },
      max: { bisnis: 15, data: 15, teknologi: 15, kreatif: 15 },
      matchPercent: 100,
    })
    expect(evaluateAssessment(questions, answers(0))?.score.matchPercent).toBe(0)
    const dataGap = evaluateAssessment(questions, answers(5, 0))
    expect(dataGap?.score).toMatchObject({
      normalized: { bisnis: 1, data: 0, teknologi: 1, kreatif: 1 },
      matchPercent: 75,
    })
    expect(dataGap?.assessment.review.filter(({ dimension, points }) => dimension === 'data' && points === 0)).toHaveLength(3)
    expect(evaluateAssessment(questions, answers(3, 1))?.score.matchPercent).toBe(50)
  })

  it('rejects incomplete answers, stale options and edited or duplicated rubric cases', async () => {
    const questions = await loadAssessmentQuiz(quizPayload())
    const answers = Object.fromEntries(questions.map(({ id, options }) => [id, options[0].id]))
    const { [questions[0].id]: omitted, ...incomplete } = answers
    expect(omitted).toBeTruthy()
    expect(evaluateAssessment(questions, incomplete)).toBeNull()
    expect(evaluateAssessment(questions, { ...answers, [questions[0].id]: 'old-option' })).toBeNull()
    expect(evaluateAssessment(questions, { ...answers, extra: 'old-option' })).toBeNull()
    const docs = questionDocuments()
    expect(await loadAssessmentQuiz(quizPayload(docs.slice(1)))).toEqual([])
    expect(await loadAssessmentQuiz(quizPayload([docs[1], ...docs.slice(1)]))).toEqual([])
    docs[0].options[0].label += ' edited'
    expect(await loadAssessmentQuiz(quizPayload(docs))).toEqual([])
  })

  it('returns public prompts and choices without disclosing the rubric', async () => {
    const payload = quizPayload()
    const questions = await fetchQuiz(payload, true)
    expect(questions).toHaveLength(12)
    expect(questions[0]).toEqual({
      id: rubric[0].code,
      text: rubric[0].text,
      options: rubric[0].options.map(({ label }, index) => ({ id: `mbd-v1:${rubric[0].code}:${index}`, label })),
    })
    expect(payload.find).toHaveBeenCalledWith(expect.objectContaining({ overrideAccess: false }))
  })

  it('keeps an answer tied to its rubric choice when a CMS row is edited or reordered', async () => {
    const docs = questionDocuments()
    const before = await loadAssessmentQuiz(quizPayload(docs))
    const answers = Object.fromEntries(before.map(({ id, options }) => [
      id,
      options.find(({ points }) => points === 5)!.id,
    ]))

    const [first, second] = docs[0].options
    docs[0].options[0] = { ...first, label: second.label }
    docs[0].options[1] = { ...second, label: first.label }
    const after = await loadAssessmentQuiz(quizPayload(docs))

    expect(after[0].options.map(({ label }) => label)).toEqual(docs[0].options.map(({ label }) => label))
    expect(evaluateAssessment(after, answers)?.score.matchPercent).toBe(100)
  })
})
