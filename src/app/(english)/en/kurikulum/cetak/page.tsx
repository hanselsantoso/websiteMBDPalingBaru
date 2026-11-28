import Page, { pageMetadata } from '@/components/pages/CurriculumPrintPage'

export const generateMetadata = () => pageMetadata('en')

export default function LocalizedPage() {
  return <Page locale='en' />
}
