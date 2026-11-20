import type { Metadata } from 'next'
import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata('program', '/program')
}

export default function ProgramsPage() {
  return <CmsPage slug="program" path="/program" />
}
