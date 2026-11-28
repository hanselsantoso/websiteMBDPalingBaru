import Page, { pageMetadata } from '@/components/pages/SiasatPage'

export const generateMetadata = () => pageMetadata('id')

export default function LocalizedPage() {
  return <Page locale='id' />
}
