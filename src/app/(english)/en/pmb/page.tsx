import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export const generateMetadata = () => cmsPageMetadata('pmb', '/pmb', undefined, 'en')

export default function AdmissionsPage() {
  return <CmsPage slug='pmb' path='/pmb' locale='en' />
}
