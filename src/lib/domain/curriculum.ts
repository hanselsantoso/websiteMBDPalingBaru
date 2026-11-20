export const COURSE_TAGS = [
  'AI',
  'Data',
  'Bisnis',
  'E-Commerce',
  'Fintech',
  'Teknologi',
  'Kreatif',
  'Umum',
  'Enrichment',
  'Capstone',
] as const

export type CourseTag = (typeof COURSE_TAGS)[number]

export const SEMESTER_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8] as const

export type CourseLike = {
  code?: string | null
  name: string
  credits: number
  semester: number
}

export type SemesterTotal = { semester: number; count: number; credits: number }

export function semesterTotals(courses: CourseLike[]): SemesterTotal[] {
  return SEMESTER_NUMBERS.map((semester) => {
    const rows = courses.filter((c) => Number(c.semester) === semester)
    return {
      semester,
      count: rows.length,
      credits: rows.reduce((sum, c) => sum + (Number(c.credits) || 0), 0),
    }
  })
}

export function programTotals(courses: CourseLike[]): { count: number; credits: number } {
  return {
    count: courses.length,
    credits: courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0),
  }
}

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** URL segment for /kurikulum/:kode. Courses without a code fall back to their name. */
export function courseSlug(code: string | null | undefined, name: string): string {
  const trimmed = code?.trim()
  if (trimmed && !trimmed.includes('[ISI')) return slugify(trimmed)
  return slugify(name)
}

export function displayCourseCode(code: string | null | undefined): string {
  const trimmed = code?.trim()
  return trimmed ? trimmed : '[ISI]'
}

type SyllabusLike = {
  description?: string | null
  cpmk?: { text?: string | null }[] | null
  weeklyPlan?: { topic?: string | null }[] | null
  assessment?: { component?: string | null; weight?: number | null }[] | null
  references?: { text?: string | null }[] | null
  tools?: { name?: string | null }[] | null
}

const filled = (value: string | null | undefined) =>
  typeof value === 'string' && value.trim().length > 0 && !value.includes('[ISI')

/** Percentage (0-100) of syllabus sections that contain real (non-placeholder) content. */
export function syllabusCompleteness(course: SyllabusLike): number {
  const assessment = (course.assessment ?? []).filter((a) => filled(a.component))
  const assessmentTotal = assessment.reduce((sum, a) => sum + (Number(a.weight) || 0), 0)
  const checks = [
    filled(course.description),
    (course.cpmk ?? []).some((c) => filled(c.text)),
    (course.weeklyPlan ?? []).filter((w) => filled(w.topic)).length >= 14,
    assessment.length > 0 && assessmentTotal === 100,
    (course.references ?? []).some((r) => filled(r.text)),
    (course.tools ?? []).some((t) => filled(t.name)),
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function assessmentTotal(rows: { weight?: number | null }[] | null | undefined): number {
  return (rows ?? []).reduce((sum, r) => sum + (Number(r.weight) || 0), 0)
}
