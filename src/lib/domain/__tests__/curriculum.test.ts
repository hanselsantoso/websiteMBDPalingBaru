import { describe, expect, it } from 'vitest'
import seed from '../../../../seed/curriculum-2024.json'
import {
  courseSlug,
  displayCourseCode,
  programTotals,
  semesterTotals,
  slugify,
  syllabusCompleteness,
} from '../curriculum'

type SeedCourse = {
  semester: number
  code?: string | null
  name: string
  credits: number
  tags: string[]
}
const courses = seed.courses as SeedCourse[]

describe('Kurikulum 2024 seed', () => {
  it('has exactly 38 courses totalling 131 SKS', () => {
    expect(courses).toHaveLength(38)
    expect(programTotals(courses)).toEqual({ count: 38, credits: 131 })
  })

  it('matches the authoritative credits per semester', () => {
    expect(semesterTotals(courses).map((row) => row.credits)).toEqual([
      18, 19, 21, 19, 21, 20, 7, 6,
    ])
  })

  it('preserves the source codes, including BD009, BD007 and BD603', () => {
    const codes = courses.map((course) => course.code).filter(Boolean)
    expect(codes).toEqual(expect.arrayContaining(['BD009', 'BD007', 'BD603']))
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('keeps Agama without a code and shows [ISI] for it', () => {
    const agama = courses.find((course) => course.name === 'Agama')
    expect(agama).toBeDefined()
    expect(agama?.code ?? null).toBeNull()
    expect(displayCourseCode(agama?.code)).toBe('[ISI]')
  })

  it('produces unique URL slugs for every course', () => {
    const slugs = courses.map((course) => courseSlug(course.code, course.name))
    expect(new Set(slugs).size).toBe(38)
    expect(slugs).toContain('bd009')
    expect(slugs).toContain('agama')
  })

  it('starts every syllabus as [ISI] placeholders (0% complete)', () => {
    expect(syllabusCompleteness(seed.syllabusPlaceholders)).toBe(0)
  })
})

describe('curriculum helpers', () => {
  it('slugifies Indonesian text', () => {
    expect(slugify('  Pengantar Manajemen Bisnis Digital ')).toBe(
      'pengantar-manajemen-bisnis-digital',
    )
    expect(slugify('Ekonomi & Bisnis (Lanjut)')).toBe('ekonomi-bisnis-lanjut')
  })

  it('falls back to the name when the code is a placeholder', () => {
    expect(courseSlug('[ISI]', 'Agama')).toBe('agama')
    expect(courseSlug(' BD101 ', 'X')).toBe('bd101')
  })

  it('scores a complete syllabus as 100%', () => {
    expect(
      syllabusCompleteness({
        description: 'Deskripsi nyata',
        cpmk: [{ text: 'Mampu menganalisis data' }],
        weeklyPlan: Array.from({ length: 14 }, (_, i) => ({ topic: `Topik ${i + 1}` })),
        assessment: [
          { component: 'UTS', weight: 40 },
          { component: 'UAS', weight: 60 },
        ],
        references: [{ text: 'Buku A' }],
        tools: [{ name: 'Python' }],
      }),
    ).toBe(100)
  })
})
