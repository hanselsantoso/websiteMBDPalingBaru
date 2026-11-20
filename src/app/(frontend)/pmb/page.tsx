import type { Metadata } from 'next'
import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata('pmb', '/pmb')
}

export default function AdmissionsPage() {
  return <CmsPage slug="pmb" path="/pmb" />
}
