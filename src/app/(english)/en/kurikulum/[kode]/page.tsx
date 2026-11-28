import Page, { pageMetadata, pageStaticParams } from '@/components/pages/CoursePage'

export const generateStaticParams = pageStaticParams
export const generateMetadata = ({ params }: { params: Promise<{ kode: string }> }) => pageMetadata(params, 'en')

export default function LocalizedPage({ params }: { params: Promise<{ kode: string }> }) {
  return <Page params={params} locale='en' />
}
