import type { Payload } from 'payload'

const buckets = new Map<string, number[]>()

/** In-memory sliding-window limiter (per server instance). */
export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now()
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)
  if (hits.length >= limit) {
    buckets.set(key, hits)
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) }
  }
  hits.push(now)
  buckets.set(key, hits)
  if (buckets.size > 10_000) {
    for (const [bucketKey, times] of buckets) {
      if (times.every((t) => now - t > windowMs)) buckets.delete(bucketKey)
    }
  }
  return { ok: true, retryAfter: 0 }
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return headers.get('x-real-ip') ?? 'unknown'
}

/** Disabled only when both keys are absent; partial configuration fails closed. */
export async function verifyCaptcha(payload: Payload, token: string | undefined, ip: string): Promise<boolean> {
  try {
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })
    const siteKey = settings.integrations?.turnstileSiteKey?.trim()
    const secret = process.env.TURNSTILE_SECRET_KEY
    if (!secret && !siteKey) return true
    if (!secret || !siteKey || !token) return false
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    })
    const json = (await response.json()) as { success?: boolean }
    return Boolean(json.success)
  } catch {
    return false
  }
}

export type GuardResult = { status: 'ok' } | { status: 'bot' } | { status: 'blocked'; message: string }

/** Rate limit (5/min per IP and form), honeypot, and optional captcha for public forms. */
export async function guardForm(
  payload: Payload,
  options: { form: string; ip: string; honeypot?: string; turnstileToken?: string; limit?: number },
): Promise<GuardResult> {
  if (options.honeypot && options.honeypot.trim().length > 0) return { status: 'bot' }
  const limited = rateLimit(`${options.form}:${options.ip}`, options.limit ?? 5, 60_000)
  if (!limited.ok) {
    return { status: 'blocked', message: `Terlalu banyak percobaan. Coba lagi dalam ${limited.retryAfter} detik.` }
  }
  if (!(await verifyCaptcha(payload, options.turnstileToken, options.ip))) {
    return { status: 'blocked', message: 'Verifikasi keamanan gagal. Muat ulang halaman lalu coba lagi.' }
  }
  return { status: 'ok' }
}
