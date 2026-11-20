import type { Metadata } from 'next'
import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata('kuis', '/kuis')
}

export default function QuizPage() {
  return <CmsPage slug="kuis" path="/kuis" />
}
