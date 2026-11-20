import type { Metadata } from 'next'
import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata('dosen', '/dosen')
}

export default function FacultyPage() {
  return <CmsPage slug="dosen" path="/dosen" />
}
