import Page, { pageMetadata } from '@/components/pages/HomePage'

export const generateMetadata = () => pageMetadata('id')

export default function LocalizedPage() {
  return <Page locale='id' />
}
