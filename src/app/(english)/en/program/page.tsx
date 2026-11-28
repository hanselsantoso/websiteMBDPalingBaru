import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export const generateMetadata = () => cmsPageMetadata('program', '/program', undefined, 'en')

export default function ProgramsPage() {
  return <CmsPage slug='program' path='/program' locale='en' />
}
