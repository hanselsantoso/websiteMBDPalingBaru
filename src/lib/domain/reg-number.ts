export const REG_PREFIX = 'MBD'

const REG_PATTERN = /^MBD-(\d{4})-(\d{4})$/

export function formatRegNumber(year: number, sequence: number): string {
  if (!Number.isInteger(year) || year < 2000 || year > 9999) {
    throw new Error(`Tahun pendaftaran tidak valid: ${year}`)
  }
  if (!Number.isInteger(sequence) || sequence < 1 || sequence > 9999) {
    throw new Error(`Nomor urut pendaftaran harus 1-9999, didapat ${sequence}`)
  }
  return `${REG_PREFIX}-${year}-${String(sequence).padStart(4, '0')}`
}

export function parseRegNumber(value: string): { year: number; sequence: number } | null {
  const match = REG_PATTERN.exec(value.trim().toUpperCase())
  if (!match) return null
  return { year: Number(match[1]), sequence: Number(match[2]) }
}

export function isValidRegNumber(value: string): boolean {
  const parsed = parseRegNumber(value)
  return parsed !== null && parsed.sequence > 0
}

/** Next sequential number for `year`, given existing registration numbers. */
export function nextRegNumber(year: number, existing: Iterable<string>): string {
  let highest = 0
  for (const value of existing) {
    const parsed = parseRegNumber(value)
    if (parsed && parsed.year === year && parsed.sequence > highest) highest = parsed.sequence
  }
  return formatRegNumber(year, highest + 1)
}

/** Calendar year in Asia/Jakarta (UTC+7), used as the registration-number year. */
export function jakartaYear(date: Date = new Date()): number {
  return new Date(date.getTime() + 7 * 60 * 60 * 1000).getUTCFullYear()
}
