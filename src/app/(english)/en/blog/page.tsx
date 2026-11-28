import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export const generateMetadata = () => cmsPageMetadata('blog', '/blog', undefined, 'en')

export default function BlogPage() {
  return <CmsPage slug='blog' path='/blog' locale='en' />
}
