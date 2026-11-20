import { readFileSync } from 'node:fs'

type Environment = Record<string, string | undefined>

function secretValue(env: Environment, name: string): string {
  const direct = env[name]?.trim()
  if (direct) return direct
  const file = env[`${name}_FILE`]
  if (!file) return ''
  try { return readFileSync(file, 'utf8').trim() } catch { throw new Error(`${name}_FILE tidak dapat dibaca.`) }
}

export function readServerEnvironment(env: Environment = process.env) {
  const secret = secretValue(env, 'PAYLOAD_SECRET')
  if (secret.length < 32) throw new Error('PAYLOAD_SECRET wajib berisi minimal 32 karakter acak.')
  const databaseURL = secretValue(env, 'DATABASE_URL')
  try {
    const url = new URL(databaseURL)
    if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.hostname || !url.pathname.slice(1)) throw new Error()
  } catch { throw new Error('DATABASE_URL wajib berupa URL PostgreSQL dengan nama database.') }
  let site: URL
  try { site = new URL(env.NEXT_PUBLIC_SITE_URL ?? '') } catch { throw new Error('NEXT_PUBLIC_SITE_URL wajib berupa origin situs.') }
  if (!['http:', 'https:'].includes(site.protocol) || site.username || site.password || site.search || site.hash || site.pathname !== '/') {
    throw new Error('NEXT_PUBLIC_SITE_URL wajib berupa origin HTTP/HTTPS tanpa path atau kredensial.')
  }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(site.hostname)
  if (env.NODE_ENV === 'production' && !local && site.protocol !== 'https:') throw new Error('Origin produksi wajib menggunakan HTTPS.')
  return { secret, databaseURL, siteURL: site.origin }
}
