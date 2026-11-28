import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export const generateMetadata = () => cmsPageMetadata('program', '/program')

export default function ProgramsPage() {
  return <CmsPage slug='program' path='/program' />
}
