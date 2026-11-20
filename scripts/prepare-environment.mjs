import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const site = new URL(process.argv[2] || 'http://localhost:3000')
if (!['http:', 'https:'].includes(site.protocol) || site.username || site.password || site.pathname !== '/' || site.search || site.hash) throw new Error('Provide a public HTTP/HTTPS origin only.')
const files = ['.env', '.secrets/payload-secret', '.secrets/postgres-password', '.secrets/database-url', '.secrets/docker-database-url']
if (files.some((file) => existsSync(path.join(root, file)))) throw new Error('Environment already exists; refusing to overwrite credentials.')
mkdirSync(path.join(root, '.secrets'), { recursive: true, mode: 0o700 })
const password = randomBytes(32).toString('hex')
const secret = randomBytes(48).toString('hex')
const contents = [
  `NEXT_PUBLIC_SITE_URL=${site.origin}\nSITE_HOST=${site.hostname}\nPORT=3000\nPMB_MAX_DOCUMENT_MB=2\nMAX_REQUEST_BYTES=67108864\nPAYLOAD_SECRET_FILE=.secrets/payload-secret\nDATABASE_URL_FILE=.secrets/database-url\nMEDIA_DIR=.local-data/media\nPMB_DOCUMENTS_DIR=.local-data/pmb-documents\n`,
  secret,
  password,
  `postgresql://arus:${password}@127.0.0.1:55432/arus`,
  `postgresql://arus:${password}@db:5432/arus`,
]
files.forEach((file, index) => writeFileSync(path.join(root, file), contents[index], { flag: 'wx', mode: 0o600 }))
console.log('Prepared .env and protected .secrets files. Existing credentials were not changed. Restrict folder ACLs on Windows; never commit or share these files.')
