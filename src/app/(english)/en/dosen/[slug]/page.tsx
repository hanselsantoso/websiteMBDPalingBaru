import Page, { pageMetadata, pageStaticParams } from '@/components/pages/FacultyProfilePage'

export const generateStaticParams = pageStaticParams
export const generateMetadata = ({ params }: { params: Promise<{ slug: string }> }) => pageMetadata(params, 'en')

export default function LocalizedPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Page params={params} locale='en' />
}
