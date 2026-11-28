import Page, { pageMetadata } from '@/components/pages/CurriculumPrintPage'

export const generateMetadata = () => pageMetadata('id')

export default function LocalizedPage() {
  return <Page locale='id' />
}
