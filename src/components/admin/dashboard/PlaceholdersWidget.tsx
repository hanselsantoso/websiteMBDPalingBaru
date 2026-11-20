import { getPlaceholderItems, type WidgetProps } from './summary'
import '../admin.css'

export async function PlaceholdersWidget({ req }: WidgetProps) {
  const items = await getPlaceholderItems(req)
  const grouped = new Map<string, { label: string; title: string; href: string; count: number }>()
  for (const item of items) {
    const key = item.href
    const entry = grouped.get(key) ?? { label: item.label, title: item.title, href: item.href, count: 0 }
    entry.count += 1
    grouped.set(key, entry)
  }
  const rows = [...grouped.values()].sort((a, b) => b.count - a.count)
  return (
    <section className="ad-widget" aria-label="Pelacak penanda [ISI]">
      <span className="ad-mono">Pelacak penanda</span>
      <h3>{items.length} isian masih berisi [ISI]</h3>
      <p className="ad-note">Data yang perlu dilengkapi tim program studi sebelum peluncuran.</p>
      <ul className="ad-list">
        {rows.slice(0, 14).map((row) => (
          <li key={row.href}>
            <a href={row.href}>
              <span className="ad-pill ad-pill--amber">{row.count}</span> {row.label}: {row.title}
            </a>
          </li>
        ))}
      </ul>
      {rows.length > 14 ? <p className="ad-note">dan {rows.length - 14} dokumen lainnya.</p> : null}
    </section>
  )
}
