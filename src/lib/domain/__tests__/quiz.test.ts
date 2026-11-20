import { describe, expect, it } from 'vitest'
import { bandFor, DEFAULT_BANDS, pairKeyOf, scoreQuiz, type QuizQuestionInput } from '../quiz'

const questions: QuizQuestionInput[] = [
  {
    id: 'q1',
    options: [
      { id: 'a', weights: { bisnis: 3, data: 1 } },
      { id: 'b', weights: { teknologi: 2 } },
    ],
  },
  {
    id: 'q2',
    options: [
      { id: 'a', weights: { data: 3 } },
      { id: 'b', weights: { kreatif: 1 } },
    ],
  },
]

describe('scoreQuiz', () => {
  it('reaches 100% when every answer is the strongest option', () => {
    const score = scoreQuiz(questions, { q1: 'a', q2: 'a' })
    expect(score.matchPercent).toBe(100)
    expect(score.answered).toBe(2)
    expect(score.raw).toEqual({ bisnis: 3, data: 4, teknologi: 0, kreatif: 0 })
  })

  it('measures the chosen weight against the best achievable weight', () => {
    // chosen 2 + 1 = 3 out of best 4 + 3 = 7
    expect(scoreQuiz(questions, { q1: 'b', q2: 'b' }).matchPercent).toBe(43)
  })

  it('counts unanswered questions against the match', () => {
    const score = scoreQuiz(questions, { q1: 'a' })
    expect(score.answered).toBe(1)
    expect(score.matchPercent).toBe(57)
  })

  it('breaks ties in dimension order and sorts the pair key', () => {
    const tie: QuizQuestionInput[] = [
      {
        id: 'q',
        options: [{ id: 'x', weights: { kreatif: 2, bisnis: 2, data: 2, teknologi: 2 } }],
      },
    ]
    const score = scoreQuiz(tie, { q: 'x' })
    expect(score.topPair).toEqual(['bisnis', 'data'])
    expect(score.pairKey).toBe('bisnis-data')
    expect(pairKeyOf('kreatif', 'bisnis')).toBe('bisnis-kreatif')
  })

  it('clamps invalid or out-of-range weights to 0–5', () => {
    const odd: QuizQuestionInput[] = [
      { id: 'q', options: [{ id: 'x', weights: { bisnis: 99, data: -3, teknologi: Number.NaN } }] },
    ]
    const score = scoreQuiz(odd, { q: 'x' })
    expect(score.raw).toEqual({ bisnis: 5, data: 0, teknologi: 0, kreatif: 0 })
    expect(score.matchPercent).toBe(100)
  })

  it('ignores answers that do not match an option', () => {
    expect(scoreQuiz(questions, { q1: 'zzz', q2: 'a' }).answered).toBe(1)
  })
})

describe('bandFor', () => {
  it('picks the highest band whose minimum is met', () => {
    expect(bandFor(85, DEFAULT_BANDS)?.label).toBe('Sangat cocok')
    expect(bandFor(60, DEFAULT_BANDS)?.label).toBe('Cocok')
    expect(bandFor(59, DEFAULT_BANDS)?.label).toBe('Cukup cocok')
    expect(bandFor(0, DEFAULT_BANDS)?.label).toBe('Masih menjajaki')
  })

  it('falls back to the lowest band and handles empty lists', () => {
    expect(
      bandFor(10, [
        { min: 50, label: 'A' },
        { min: 20, label: 'B' },
      ])?.label,
    ).toBe('B')
    expect(bandFor(10, [])).toBeNull()
  })
})
