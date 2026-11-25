import { getSummary, type WidgetProps } from './summary'
import '../admin.css'

export async function KpiWidget({ req }: WidgetProps) {
  const summary = await getSummary(req)
  const applications = summary.applicationsByStatus?.reduce((sum, item) => sum + item.count, 0) ?? null
  const cards: { label: string; value: string; hint: string; tone?: 'amber' }[] = [
    ...(summary.leadsThisWeek !== null ? [{ label: 'Lead baru minggu ini', value: String(summary.leadsThisWeek), hint: '7 hari terakhir' }] : []),
    ...(applications !== null
      ? [
          {
            label: 'Pendaftar PMB',
            value: String(applications),
            hint: (summary.applicationsByStatus ?? [])
              .filter((s) => s.count > 0)
              .map((s) => `${s.label} ${s.count}`)
              .join(' · ') || 'Belum ada pendaftar',
          },
        ]
      : []),
    { label: 'Unduhan brosur', value: String(summary.brochureDownloads), hint: '30 hari terakhir' },
    { label: 'Kuis selesai', value: String(summary.quizCompletions), hint: '30 hari terakhir' },
    ...(summary.syllabus
      ? [{ label: 'Kelengkapan silabus', value: `${summary.syllabus.average}%`, hint: `${summary.syllabus.complete} dari ${summary.syllabus.total} mata kuliah lengkap` }]
      : []),
    { label: 'Sisa penanda [ISI]', value: String(summary.placeholders), hint: 'Lihat daftar di bawah', tone: summary.placeholders > 0 ? 'amber' : undefined },
  ]
  return (
    <section className="ad-widget" aria-label="Ringkasan KPI">
      <span className="ad-mono">Ringkasan</span>
      <h3>Kinerja situs prodi</h3>
      <div className="ad-kpis">
        {cards.map((card) => (
          <div key={card.label} className={`ad-kpi ${card.tone === 'amber' ? 'ad-kpi--amber' : ''}`}>
            <span className="ad-mono">{card.label}</span>
            <span className="ad-kpi__value">{card.value}</span>
            <span className="ad-note">{card.hint}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
