import type { Metadata } from 'next'
import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata('kontak', '/kontak')
}

export default function ContactPage() {
  return <CmsPage slug="kontak" path="/kontak" />
}
