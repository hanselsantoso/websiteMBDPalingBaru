import type { Metadata } from 'next'
import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata('karier', '/karier')
}

export default function CareersPage() {
  return <CmsPage slug="karier" path="/karier" />
}
