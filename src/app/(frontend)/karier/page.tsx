import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export const generateMetadata = () => cmsPageMetadata('karier', '/karier')

export default function CareersPage() {
  return <CmsPage slug='karier' path='/karier' />
}
