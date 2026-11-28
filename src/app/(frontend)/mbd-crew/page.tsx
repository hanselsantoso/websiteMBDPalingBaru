import Page, { pageMetadata } from '@/components/pages/CrewPage'

export const generateMetadata = () => pageMetadata('id')

export default function LocalizedPage() {
  return <Page locale='id' />
}
