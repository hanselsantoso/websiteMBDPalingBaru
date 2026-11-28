import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'

export const generateMetadata = () => cmsPageMetadata('kontak', '/kontak')

export default function ContactPage() {
  return <CmsPage slug='kontak' path='/kontak' />
}
