import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export const generateMetadata = () => cmsPageMetadata('kurikulum', '/kurikulum')

export default function CurriculumPage() {
  return <CmsPage slug='kurikulum' path='/kurikulum' />
}
