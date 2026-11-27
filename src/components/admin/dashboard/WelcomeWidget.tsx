import Link from 'next/link'
import { getPermissions } from '@/access'
import { Icon } from '@/components/ui/Icon'
import { can } from '@/lib/domain/permissions'
import type { WidgetProps } from './summary'
import { SiasatBadge } from './SiasatBadge'
import '../admin.css'

const QUICK_ACTIONS = [
  { module: 'blog', action: 'buat', label: 'Artikel baru', href: '/admin/collections/posts/create' },
  { module: 'dosen', action: 'buat', label: 'Tambah dosen', href: '/admin/collections/faculty/create' },
  { module: 'media', action: 'buat', label: 'Unggah media', href: '/admin/collections/media/create' },
  { module: 'pmb', action: 'lihat', label: 'Pendaftar', href: '/admin/collections/pmb-applications' },
] as const

export async function WelcomeWidget({ req }: WidgetProps) {
  const user = req.user as { name?: string | null; email?: string } | null
  const name = user?.name || user?.email?.split('@')[0] || 'Admin'
  const permissions = await getPermissions(req)
  const actions = QUICK_ACTIONS.filter(item => can(permissions, item.module, item.action))
  return (
    <section className="ad-lte-welcome" aria-labelledby="mbd-dashboard-title">
      <div className="ad-lte-welcome__title">
        <SiasatBadge pose="greeting" />
        <div>
          <h1 id="mbd-dashboard-title">Dashboard</h1>
          <p>Halo, {name}.</p>
        </div>
      </div>
      {actions.length ? (
        <nav className="ad-lte-actions" aria-label="Aksi cepat">
          {actions.map(item => (
            <Link key={item.module} href={item.href} prefetch={false} className={item.module === 'blog' ? 'ad-lte-actions__primary' : undefined}>
              {item.module === 'blog' ? <Icon name="kreatif" size={16} /> : null}
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </section>
  )
}
