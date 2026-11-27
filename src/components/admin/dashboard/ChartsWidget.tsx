import { getSummary, type WidgetProps } from './summary'
import '../admin.css'

function LineChart({ points }: { points: { date: string; count: number }[] }) {
  const width = 320
  const height = 120
  const peak = Math.max(0, ...points.map((p) => p.count))
  if (!peak) return <p className="ad-note">Belum ada lead dalam 30 hari terakhir.</p>
  const step = points.length > 1 ? width / (points.length - 1) : width
  const coords = points.map((p, i) => [i * step, height - 8 - (p.count / peak) * (height - 24)] as const)
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L ${width} ${height} L 0 ${height} Z`
  const total = points.reduce((sum, p) => sum + p.count, 0)
  return (
    <figure className="ad-chart-figure">
      <svg className="ad-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Lead per hari, 30 hari terakhir: total ${total}`}>
        {[16, 64, 112].map((y) => <line key={y} x1={0} x2={width} y1={y} y2={y} className="ad-chart__grid" />)}
        <path d={area} fill="currentColor" opacity={0.12} />
        <path d={line} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinejoin="round" />
      </svg>
      <figcaption className="ad-note">
        {points[0]?.date} – {points[points.length - 1]?.date} · puncak {peak} lead/hari
      </figcaption>
      <details className="ad-chart-data">
        <summary>Rincian per hari</summary>
        <dl>
          {points.map(({ date, count }) => (
            <div key={date}>
              <dt><time dateTime={date}>{date}</time></dt>
              <dd>{count}</dd>
            </div>
          ))}
        </dl>
      </details>
    </figure>
  )
}

function Bars({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  if (!rows.length) return <p className="ad-note">Belum ada data.</p>
  return (
    <div className="ad-bars">
      {rows.map((row) => (
        <div key={row.label} className="ad-bar">
          <span>{row.label}</span>
          <strong>{row.value}</strong>
          <span className="ad-bar__track" aria-hidden="true">
            <span className="ad-bar__fill" style={{ width: `${Math.round((row.value / max) * 100)}%` }} />
          </span>
        </div>
      ))}
    </div>
  )
}

export async function ChartsWidget({ req }: WidgetProps) {
  const summary = await getSummary(req)
  if (!summary.leadsPerDay || !summary.leadSources || !summary.funnel) {
    return (
      <section className="ad-widget" aria-label="Grafik">
        <h3>Grafik leads</h3>
        <p className="ad-note">Grafik leads tersedia untuk peran dengan akses Leads.</p>
      </section>
    )
  }
  return (
    <section className="ad-widget" aria-label="Grafik leads dan corong pendaftaran">
      <span className="ad-mono">30 hari terakhir</span>
      <h3>Leads dan corong pendaftaran</h3>
      <div className="ad-charts">
        <div className="ad-chart-panel">
          <h4>Lead per hari</h4>
          <LineChart points={summary.leadsPerDay} />
        </div>
        <div className="ad-chart-panel">
          <h4>Sumber lead</h4>
          <Bars rows={summary.leadSources.map((s) => ({ label: s.label, value: s.count }))} />
        </div>
        <div className="ad-chart-panel ad-chart-panel--funnel">
          <h4>Corong pendaftaran</h4>
          <Bars rows={summary.funnel} />
        </div>
      </div>
    </section>
  )
}
