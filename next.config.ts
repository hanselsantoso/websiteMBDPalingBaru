import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildUploadPolicy } from './src/lib/upload-policy'
import { CREW_PATH } from './src/lib/brand/crew'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const site = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined
const uploadMb = Number(process.env.PMB_MAX_DOCUMENT_MB || 2)
if (!Number.isFinite(uploadMb) || uploadMb <= 0 || uploadMb > 100) throw new Error('PMB_MAX_DOCUMENT_MB harus lebih dari 0 dan maksimal 100.')

const nextConfig: NextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      { source: '/siasat', destination: CREW_PATH, permanent: true },
      { source: '/en/siasat', destination: '/en' + CREW_PATH, permanent: true },
    ]
  },
  outputFileTracingIncludes: {
    // Payload inspects uploaded files through the Node entry point of strtok3.
    '/api/**': ['./node_modules/.pnpm/strtok3@*/node_modules/strtok3/lib/**/*.js'],
  },
  turbopack: { root: dirname },
  webpack: (config) => {
    config.resolve.extensionAlias = { '.cjs': ['.cts', '.cjs'], '.js': ['.ts', '.tsx', '.js', '.jsx'], '.mjs': ['.mts', '.mjs'] }
    return config
  },
  images: {
    remotePatterns: site ? [{ protocol: site.protocol.slice(0, -1) as 'http' | 'https', hostname: site.hostname, port: site.port, pathname: '/api/media/file/**' }] : [],
  },
  allowedDevOrigins: site ? [site.hostname] : [],
  experimental: {
    cpus: 2,
    serverActions: { allowedOrigins: site ? [site.host] : [], bodySizeLimit: buildUploadPolicy(uploadMb).maxRequestBytes },
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
