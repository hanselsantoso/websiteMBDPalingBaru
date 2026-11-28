import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export const generateMetadata = () => cmsPageMetadata('kontak', '/kontak', undefined, 'en')

export default function ContactPage() {
  return <CmsPage slug='kontak' path='/kontak' locale='en' />
}
