import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export const generateMetadata = () => cmsPageMetadata('kuis', '/kuis')

export default function QuizPage() {
  return <CmsPage slug='kuis' path='/kuis' />
}
