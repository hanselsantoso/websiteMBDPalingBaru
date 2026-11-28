import { PublicLayout, publicLayoutMetadata } from '@/components/layout/PublicLayout'
import '@/app/(frontend)/styles.css'

export const viewport = { themeColor: '#071A3D', width: 'device-width', initialScale: 1 }
export const generateMetadata = () => publicLayoutMetadata('en')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PublicLayout locale='en'>{children}</PublicLayout>
}
