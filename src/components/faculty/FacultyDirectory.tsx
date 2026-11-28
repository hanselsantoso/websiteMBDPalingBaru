'use client'

import { useMemo, useState } from 'react'
import { FacultyCard } from '@/components/cards/Cards'
import { useLocale } from '@/components/providers/LocaleProvider'
import { SelectField } from '@/components/forms/fields'
import { Icon } from '@/components/ui/Icon'
import { isPlaceholder } from '@/lib/domain/placeholders'

export type DirectoryMember = {
  id: string
  slug: string
  name: string
  titleFront?: string | null
  titleBack?: string | null
  position?: string | null
  expertise: string[]
  photo: {
    url?: string | null
    alt?: string | null
    focalX?: number | null
    focalY?: number | null
  } | null
  courses: { slug: string; name: string }[]
}

export function FacultyDirectory({
  members,
  showPlaceholders,
  heading,
  intro,
}: {
  members: DirectoryMember[]
  showPlaceholders: boolean
  heading?: string | null
  intro?: string | null
}) {
  const locale = useLocale()
  const en = locale === 'en'
  const [query, setQuery] = useState('')
  const [expertise, setExpertise] = useState('')
  const [course, setCourse] = useState('')

  const expertiseOptions = useMemo(
    () =>
      Array.from(
        new Set(members.flatMap((member) => member.expertise).filter((tag) => !isPlaceholder(tag))),
      )
        .sort((a, b) => a.localeCompare(b, locale))
        .map((tag) => ({ value: tag, label: tag })),
    [members, locale],
  )
  const courseOptions = useMemo(() => {
    const map = new Map<string, string>()
    members.forEach((member) => member.courses.forEach((item) => map.set(item.slug, item.name)))
    return [...map.entries()]
      .sort((a, b) => a[1].localeCompare(b[1], locale))
      .map(([value, label]) => ({ value, label }))
  }, [members, locale])

  const q = query.trim().toLowerCase()
  const results = members.filter(
    (member) =>
      (!q || member.name.toLowerCase().includes(q)) &&
      (!expertise || member.expertise.includes(expertise)) &&
      (!course || member.courses.some((item) => item.slug === course)),
  )
  const filtering = Boolean(q || expertise || course)

  return (
    <div className="container-arus">
      {heading ? <h2 className="text-section font-bold">{heading}</h2> : null}
      {intro ? <p className="mt-3 max-w-2xl text-lead text-ink-600">{intro}</p> : null}
      <div className="mt-8 grid gap-4 rounded-[28px] border-2 border-navy bg-ink-50 p-5 md:grid-cols-3">
        <div className="grid gap-1.5">
          <label htmlFor="cari-dosen" className="font-semibold">
            {en ? 'Search by name' : 'Cari nama'}
          </label>
          <div className="relative">
            <Icon
              name="search"
              size={20}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-600"
            />
            <input
              id="cari-dosen"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={en ? "Lecturer’s name" : "Nama dosen"}
              className="h-12 w-full rounded-xl border-2 border-navy bg-white pr-4 pl-12 text-base placeholder:text-ink-500"
            />
          </div>
        </div>
        <SelectField
          id="filter-keahlian"
          label={en ? "Areas of expertise" : "Bidang keahlian"}
          options={expertiseOptions}
          placeholder={en ? "All areas" : "Semua keahlian"}
          value={expertise}
          onChange={(event) => setExpertise(event.target.value)}
        />
        <SelectField
          id="filter-matkul"
          label={en ? "Courses taught" : "Mata kuliah yang diampu"}
          options={courseOptions}
          placeholder={en ? "All courses" : "Semua mata kuliah"}
          value={course}
          onChange={(event) => setCourse(event.target.value)}
        />
      </div>
      <p className="sr-only" aria-live="polite">
        {filtering ? (en ? `${results.length} ${results.length === 1 ? 'lecturer' : 'lecturers'} found.` : `${results.length} dosen ditemukan.`) : ''}
      </p>
      {results.length ? (
        <ul className="mt-12 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((member, index) => (
            <li key={member.id}>
              <FacultyCard
                member={member}
                locale={locale}
                showPlaceholders={showPlaceholders}
                mask={index % 2 === 0 ? 'fin' : 'round'}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 rounded-[28px] border-2 border-dashed border-navy p-10 text-center">
          <p className="text-lg font-semibold">
            {members.length
              ? (en ? "No lecturers match these filters." : 'Tidak ada dosen yang cocok dengan filter ini.')
              : (en ? "Lecturer profiles are coming soon." : 'Profil dosen segera hadir.')}
          </p>
          {filtering ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setExpertise('')
                setCourse('')
              }}
              className="pill mt-4 border-2 border-navy bg-white text-navy"
            >
              {en ? 'Clear filters' : 'Hapus filter'}
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}
