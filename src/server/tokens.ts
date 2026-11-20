import { safeEqual, signValue } from '@/lib/preview'

export function signDownload(
  secret: string,
  fileId: string,
  ttlMinutes = 30,
): { exp: number; sig: string } {
  const exp = Date.now() + ttlMinutes * 60 * 1000
  return { exp, sig: signValue(secret, `download|${fileId}|${exp}`) }
}

export function verifyDownload(secret: string, fileId: string, exp: string, sig: string): boolean {
  const expiresAt = Number(exp)
  if (!fileId || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return false
  return safeEqual(signValue(secret, `download|${fileId}|${expiresAt}`), sig)
}

/** Signature for cache-invalidation requests sent by Payload hooks outside a Next.js request. */
export function signRevalidation(secret: string, body: string): string {
  return signValue(secret, `revalidate|${body}`)
}

export function verifyRevalidation(secret: string, body: string, signature: string): boolean {
  return Boolean(signature) && safeEqual(signRevalidation(secret, body), signature)
}
