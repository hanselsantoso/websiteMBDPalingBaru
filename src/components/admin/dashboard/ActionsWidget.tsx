import { getSummary, type WidgetProps } from './summary'
import '../admin.css'

export async function ActionsWidget({ req }: WidgetProps) {
  const summary = await getSummary(req)
  const items = summary.needsAction.filter((item) => item.count > 0)
  return (
    <section className="ad-widget" aria-label="Perlu tindakan">
      <span className="ad-mono">Perlu tindakan</span>
      <h3>{items.length ? `${items.length} hal menunggu` : 'Semua beres'}</h3>
      {items.length ? (
        <ul className="ad-list">
          {items.map((item) => (
            <li key={item.label}>
              <a href={item.href}>
                <strong>{item.count}</strong> {item.label}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="ad-note">Tidak ada pesan, pendaftar, atau artikel yang tertunda.</p>
      )}
      {summary.topPosts.length ? (
        <>
          <h3 className="ad-spaced">Artikel terpopuler</h3>
          <ul className="ad-list">
            {summary.topPosts.map((post) => (
              <li key={post.slug}>
                <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                  /blog/{post.slug}
                </a>{' '}
                <span className="ad-note">{post.views} tayang</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  )
}
