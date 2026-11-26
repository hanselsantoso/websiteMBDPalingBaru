import NextImage, { type ImageProps } from 'next/image'
import { cmsImageSrc } from '@/lib/media-image'

export default function CmsImage({ src, ...props }: ImageProps) {
  return <NextImage {...props} src={typeof src === 'string' ? cmsImageSrc(src) : src} />
}
