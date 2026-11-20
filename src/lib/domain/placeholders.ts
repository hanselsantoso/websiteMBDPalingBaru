export const PLACEHOLDER = '[ISI]'

/** True when a value is empty or still contains the `[ISI]` token. */
export function isPlaceholder(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'number') return Number.isNaN(value)
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  return trimmed.length === 0 || trimmed.includes('[ISI')
}

/** Extracts the hint from `[ISI: hint]`, if any. */
export function placeholderHint(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const match = value.match(/\[ISI:\s*([^\]]+)\]/)
  return match ? match[1].trim() : null
}

export type PlaceholderHit = { path: string; value: string }

const SKIP_KEYS = new Set(['id', 'createdAt', 'updatedAt', '_status', 'blockType', 'blockName'])

/** Recursively lists every string field that still contains `[ISI`. */
export function findPlaceholders(input: unknown, basePath = ''): PlaceholderHit[] {
  const hits: PlaceholderHit[] = []
  const walk = (value: unknown, path: string) => {
    if (typeof value === 'string') {
      if (value.includes('[ISI')) hits.push({ path, value })
      return
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, path ? `${path}.${index}` : String(index)))
      return
    }
    if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        if (SKIP_KEYS.has(key)) continue
        walk(child, path ? `${path}.${key}` : key)
      }
    }
  }
  walk(input, basePath)
  return hits
}
