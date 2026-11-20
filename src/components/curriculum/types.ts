export type TrackCourse = {
  id: string
  code: string | null
  name: string
  nameSource?: string | null
  credits: number
  semester: number
  tags: string[]
  slug: string
}

export type TrackSemester = { number: number; title: string; description?: string | null }

export function toTrackCourses(courses: Record<string, any>[]): TrackCourse[] {
  return courses.map((course) => ({
    id: String(course.id),
    code: course.code ?? null,
    name: String(course.name),
    nameSource: course.nameSource ?? null,
    credits: Number(course.credits) || 0,
    semester: Number(course.semester) || 0,
    tags: (course.tags as string[]) ?? [],
    slug: String(course.slug ?? ''),
  }))
}

export function toTrackSemesters(version: Record<string, any> | null): TrackSemester[] {
  const fromVersion = ((version?.semesters as Record<string, any>[]) ?? []).map((semester) => ({
    number: Number(semester.number),
    title: String(semester.title ?? ''),
    description: semester.description ?? null,
  }))
  return [1, 2, 3, 4, 5, 6, 7, 8].map(
    (number) => fromVersion.find((semester) => semester.number === number) ?? { number, title: `Semester ${number}`, description: null },
  )
}
