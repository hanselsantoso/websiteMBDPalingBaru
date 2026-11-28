import Page, { pageMetadata, pageStaticParams } from '@/components/pages/CmsCatchAllPage'

export const generateStaticParams = pageStaticParams
export const generateMetadata = ({ params }: { params: Promise<{ path: string[] }> }) => pageMetadata(params, 'id')

export default function LocalizedPage({ params }: { params: Promise<{ path: string[] }> }) {
  return <Page params={params} locale='id' />
}
