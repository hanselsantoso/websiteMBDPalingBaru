import Link from 'next/link'
import { DataTable } from '@/components/ui/DataTable'
import type { ReactNode } from 'react'
import { Star } from '@/components/patterns/Patterns'
import { Icon } from '@/components/ui/Icon'
import { PendingChip, TextOr } from '@/components/ui/Isi'
import { displayCourseCode } from '@/lib/domain/curriculum'
import { isPlaceholder } from '@/lib/domain/placeholders'
import { cn } from '@/lib/utils'

type Doc = Record<string, any>

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="label-mono mb-3 flex items-center gap-2 text-blue">{children}</h3>
}

/** Presentational syllabus body, shared by the full course page and the side drawer. */
export function CourseDetailBody({ course, showPlaceholders }: { course: Doc; showPlaceholders: boolean }) {
  const cpmk = ((course.cpmk as Doc[]) ?? []).filter((item) => showPlaceholders || !isPlaceholder(item.text))
  const weekly = ((course.weeklyPlan as Doc[]) ?? []).filter((item) => showPlaceholders || !isPlaceholder(item.topic))
  const assessment = ((course.assessment as Doc[]) ?? []).filter((item) => showPlaceholders || !isPlaceholder(item.component))
  const references = ((course.references as Doc[]) ?? []).filter((item) => showPlaceholders || !isPlaceholder(item.text))
  const tools = ((course.tools as Doc[]) ?? []).filter((item) => showPlaceholders || !isPlaceholder(item.name))
  const prerequisites = ((course.prerequisites as Doc[]) ?? []).filter((item) => item && typeof item === 'object')
  const lecturers = ((course.lecturers as Doc[]) ?? []).filter((item) => item && typeof item === 'object')
  const rps = course.rps && typeof course.rps === 'object' ? course.rps : null
  const empty = <p className="text-ink-600">Informasi menyusul.</p>

  return (
    <div className="grid gap-10">
      <section>
        <SectionTitle>Deskripsi</SectionTitle>
        <p className="max-w-[65ch] text-lg leading-relaxed">
          <TextOr value={course.description || course.shortDescription} show={showPlaceholders} fallback="Deskripsi menyusul." hint="deskripsi mata kuliah" />
        </p>
      </section>

      <section>
        <SectionTitle>Capaian pembelajaran (CPMK)</SectionTitle>
        {cpmk.length ? (
          <ol className="grid gap-3">
            {cpmk.map((item, index) => (
              <li key={item.id ?? index} className="flex gap-3">
                <span className="label-mono mt-1 shrink-0 text-blue">CPMK {index + 1}</span>
                <span>{isPlaceholder(item.text) ? <PendingChip hint="capaian pembelajaran" /> : item.text}</span>
              </li>
            ))}
          </ol>
        ) : (
          empty
        )}
      </section>

      <section>
        <SectionTitle>Rencana mingguan</SectionTitle>
        {weekly.length ? (
          <DataTable
            label="Rencana mingguan"
            columns={[{ label: 'Minggu' }, { label: 'Topik' }, { label: 'Metode' }, { label: 'CPMK' }]}
            rows={weekly.map((row, index) => ({
              id: row.id ?? index,
              values: [
                row.week ?? index + 1,
                ...[row.topic, row.method, row.outcome].map(value => isPlaceholder(value) ? '' : value ?? ''),
              ],
              cells: [
                row.week ?? index + 1,
                isPlaceholder(row.topic) ? <PendingChip key="topic" hint="topik pertemuan" /> : row.topic,
                isPlaceholder(row.method) ? '—' : row.method,
                isPlaceholder(row.outcome) ? '—' : row.outcome,
              ],
            }))}
          />
        ) : (
          empty
        )}
      </section>

      <section>
        <SectionTitle>Penilaian</SectionTitle>
        {assessment.length ? (
          <ul className="grid gap-3">
            {assessment.map((row, index) => (
              <li key={row.id ?? index} className="grid gap-1.5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-semibold">{isPlaceholder(row.component) ? <PendingChip hint="komponen penilaian" /> : row.component}</span>
                  <span className="font-mono text-sm tabular-nums">{isPlaceholder(row.component) ? '—' : `${row.weight ?? 0}%`}</span>
                </div>
                {!isPlaceholder(row.component) ? (
                  <span className="block h-2.5 overflow-hidden rounded-full bg-ink-100">
                    <span className="block h-full origin-left rounded-full bg-blue" style={{ transform: `scaleX(${Math.min(100, Number(row.weight) || 0) / 100})` }} />
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          empty
        )}
      </section>

      <div className="grid gap-10 md:grid-cols-2">
        <section>
          <SectionTitle>Prasyarat</SectionTitle>
          {prerequisites.length ? (
            <ul className="grid gap-2">
              {prerequisites.map((item) => (
                <li key={item.id}>
                  <Link href={`/kurikulum/${item.slug}`} className="inline-flex min-h-10 items-center gap-2 font-semibold underline decoration-navy/30 underline-offset-4 hover:decoration-blue">
                    <span className="font-mono text-xs text-blue">{displayCourseCode(item.code)}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-600">Tidak ada prasyarat.</p>
          )}
        </section>
        <section>
          <SectionTitle>Tools dan software</SectionTitle>
          {tools.length ? (
            <ul className="flex flex-wrap gap-2">
              {tools.map((tool, index) => (
                <li key={tool.id ?? index} className="rounded-full border-2 border-navy px-3 py-1 text-sm font-semibold">
                  {isPlaceholder(tool.name) ? <PendingChip hint="tools" /> : tool.name}
                </li>
              ))}
            </ul>
          ) : (
            empty
          )}
        </section>
      </div>

      <section>
        <SectionTitle>Buku dan referensi</SectionTitle>
        {references.length ? (
          <ul className="grid gap-2">
            {references.map((ref, index) => (
              <li key={ref.id ?? index} className="flex gap-3">
                <Star className="mt-1.5 size-3.5 shrink-0 text-blue" />
                <span>{isPlaceholder(ref.text) ? <PendingChip hint="referensi" /> : ref.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          empty
        )}
      </section>

      <section>
        <SectionTitle>Dosen pengampu</SectionTitle>
        {lecturers.length ? (
          <ul className="flex flex-wrap gap-3">
            {lecturers.map((lecturer) => (
              <li key={lecturer.id}>
                <Link href={`/dosen/${lecturer.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-navy px-4 font-semibold hover:bg-navy hover:text-white">
                  <TextOr value={lecturer.name} show={showPlaceholders} hint="nama dosen" />
                </Link>
              </li>
            ))}
          </ul>
        ) : showPlaceholders ? (
          <PendingChip hint="dosen pengampu" />
        ) : (
          empty
        )}
      </section>

      {rps?.url ? (
        <a href={rps.url} className={cn('pill w-fit border-2 border-navy bg-white text-navy hover:bg-ink-50')} target="_blank" rel="noopener">
          <Icon name="download" size={18} strokeWidth={2.5} />
          Unduh RPS / silabus (PDF)
        </a>
      ) : null}
    </div>
  )
}
