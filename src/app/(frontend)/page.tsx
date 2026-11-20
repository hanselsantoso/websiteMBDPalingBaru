import type { Metadata } from 'next'
import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata('beranda', '/')
}

export default function HomePage() {
  return <CmsPage slug="beranda" path="/" />
}
