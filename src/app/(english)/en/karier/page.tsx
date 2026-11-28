import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export const generateMetadata = () => cmsPageMetadata('karier', '/karier', undefined, 'en')

export default function CareersPage() {
  return <CmsPage slug='karier' path='/karier' locale='en' />
}
