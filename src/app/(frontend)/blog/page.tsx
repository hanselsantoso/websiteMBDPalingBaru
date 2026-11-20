import type { Metadata } from 'next'
import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata('blog', '/blog')
}

export default function BlogPage() {
  return <CmsPage slug="blog" path="/blog" />
}
