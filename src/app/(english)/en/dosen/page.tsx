import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export const generateMetadata = () => cmsPageMetadata('dosen', '/dosen', undefined, 'en')

export default function FacultyPage() {
  return <CmsPage slug='dosen' path='/dosen' locale='en' />
}
