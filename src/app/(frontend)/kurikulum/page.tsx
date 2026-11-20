import type { Metadata } from 'next'
import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata('kurikulum', '/kurikulum')
}

export default function CurriculumPage() {
  return <CmsPage slug="kurikulum" path="/kurikulum" />
}
