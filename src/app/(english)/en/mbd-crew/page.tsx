import Page, { pageMetadata } from '@/components/pages/CrewPage'

export const generateMetadata = () => pageMetadata('en')

export default function LocalizedPage() {
  return <Page locale='en' />
}
