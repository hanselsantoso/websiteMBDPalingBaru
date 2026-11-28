import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export const generateMetadata = () => cmsPageMetadata('blog', '/blog')

export default function BlogPage() {
  return <CmsPage slug='blog' path='/blog' />
}
