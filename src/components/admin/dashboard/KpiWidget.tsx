import { Icon } from '@/components/ui/Icon'
import { getSummary, type WidgetProps } from './summary'
import '../admin.css'

export async function KpiWidget({ req }: WidgetProps) {
  const summary = await getSummary(req)
  const applications = summary.applicationsByStatus?.reduce((sum, item) => sum + item.count, 0) ?? null
  const cards = [
    ...(summary.leadsThisWeek !== null ? [{ label: 'Lead baru', value: String(summary.leadsThisWeek), hint: '7 hari terakhir', tone: 'blue', icon: 'data' }] : []),
    ...(applications !== null
      ? [
          {
            label: 'Pendaftar PMB',
            value: String(applications),
            hint: (summary.applicationsByStatus ?? [])
              .filter((s) => s.count > 0)
              .map((s) => `${s.label} ${s.count}`)
              .join(' · ') || 'Belum ada pendaftar',
            tone: 'green',
            icon: 'komunitas',
          },
        ]
      : []),
    { label: 'Unduhan brosur', value: String(summary.brochureDownloads), hint: '30 hari terakhir', tone: 'cyan', icon: 'download' },
    { label: 'Kuis selesai', value: String(summary.quizCompletions), hint: '30 hari terakhir', tone: 'purple', icon: 'check' },
    ...(summary.syllabus
      ? [{ label: 'Kelengkapan silabus', value: `${summary.syllabus.average}%`, hint: `${summary.syllabus.complete} dari ${summary.syllabus.total} mata kuliah lengkap`, tone: 'slate', icon: 'beasiswa' }]
      : []),
    { label: 'Sisa penanda [ISI]', value: String(summary.placeholders), hint: 'Isian yang perlu dilengkapi', tone: 'amber', icon: 'target' },
  ]
  return (
    <section className="ad-lte-metrics" aria-label="Ringkasan KPI">
      <div className="ad-kpis">
        {cards.map((card) => (
          <div key={card.label} className={`ad-lte-metric ad-lte-metric--${card.tone}`}>
            <div className="ad-lte-metric__main">
              <div><strong className="ad-kpi__value">{card.value}</strong><span>{card.label}</span></div>
              <Icon name={card.icon} size={48} strokeWidth={1.6} />
            </div>
            <span className="ad-note">{card.hint}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
