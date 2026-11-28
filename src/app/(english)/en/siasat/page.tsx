import Page, { pageMetadata } from '@/components/pages/SiasatPage'

export const generateMetadata = () => pageMetadata('en')

export default function LocalizedPage() {
  return <Page locale='en' />
}
