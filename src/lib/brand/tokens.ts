/**
 * Arus Digital design tokens. The CMS can override the four brand colors;
 * neutrals (ink) are always derived from navy so they stay coherent.
 */

export type BrandColors = {
  blue: string
  navy: string
  lime: string
  cyan: string
}

export const DEFAULT_BRAND: BrandColors = {
  blue: '#1A6BFF',
  navy: '#071A3D',
  lime: '#C6F432',
  cyan: '#2EE6F6',
}

export const MASCOT_COLORS = {
  foxOrange: '#FF7A2F',
  foxOrangeShade: '#E8622A',
  foxCream: '#FFF3E3',
} as const

export const INK_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const
export type InkStep = (typeof INK_STEPS)[number]

/** Share of navy mixed into white for each ink step. */
const INK_WEIGHTS: Record<InkStep, number> = {
  '50': 0.04,
  '100': 0.08,
  '200': 0.16,
  '300': 0.3,
  '400': 0.45,
  '500': 0.58,
  '600': 0.7,
  '700': 0.8,
  '800': 0.9,
  '900': 0.96,
}

export const HEX_PATTERN = /^#(?:[0-9a-fA-F]{6})$/

export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_PATTERN.test(value.trim())
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.trim().replace('#', '')
  return [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16)) as [number, number, number]
}

export function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b]
    .map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`
}

/** sRGB mix: `weight` of colorA, the rest colorB. */
export function mix(colorA: string, colorB: string, weight: number): string {
  const a = hexToRgb(colorA)
  const b = hexToRgb(colorB)
  return rgbToHex([0, 1, 2].map((i) => a[i] * weight + b[i] * (1 - weight)) as [number, number, number])
}

export function relativeLuminance(hex: string): number {
  const channel = (v: number) => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  const [r, g, b] = hexToRgb(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground)
  const b = relativeLuminance(background)
  const [light, dark] = a > b ? [a, b] : [b, a]
  return Math.round(((light + 0.05) / (dark + 0.05)) * 100) / 100
}

export function isLightColor(hex: string): boolean {
  return relativeLuminance(hex) > 0.45
}

export function buildInkScale(navy: string): Record<InkStep, string> {
  return Object.fromEntries(
    INK_STEPS.map((step) => [step, mix(navy, '#FFFFFF', INK_WEIGHTS[step])]),
  ) as Record<InkStep, string>
}

export function resolveBrandColors(input?: Partial<Record<keyof BrandColors, unknown>> | null): BrandColors {
  return {
    blue: isHexColor(input?.blue) ? input.blue.trim() : DEFAULT_BRAND.blue,
    navy: isHexColor(input?.navy) ? input.navy.trim() : DEFAULT_BRAND.navy,
    lime: isHexColor(input?.lime) ? input.lime.trim() : DEFAULT_BRAND.lime,
    cyan: isHexColor(input?.cyan) ? input.cyan.trim() : DEFAULT_BRAND.cyan,
  }
}

type TokenName = keyof BrandColors | 'white' | `ink-${InkStep}`

export type ContrastPair = {
  fg: TokenName
  bg: TokenName
  min: number
  usage: string
}

/** Every text/background pair used by the UI, with the WCAG AA threshold it must meet. */
export const CONTRAST_PAIRS: ContrastPair[] = [
  { fg: 'navy', bg: 'white', min: 4.5, usage: 'Teks utama di latar terang' },
  { fg: 'white', bg: 'navy', min: 4.5, usage: 'Teks putih di bagian gelap' },
  { fg: 'blue', bg: 'white', min: 4.5, usage: 'Tautan dan teks biru di latar terang' },
  { fg: 'white', bg: 'blue', min: 4.5, usage: 'Label putih di tombol biru' },
  { fg: 'lime', bg: 'navy', min: 4.5, usage: 'Sorotan lime di latar navy' },
  { fg: 'navy', bg: 'lime', min: 4.5, usage: 'Label navy di tombol lime' },
  { fg: 'cyan', bg: 'navy', min: 4.5, usage: 'Aksen cyan di latar navy' },
  { fg: 'ink-600', bg: 'white', min: 4.5, usage: 'Teks sekunder di latar terang' },
  { fg: 'ink-700', bg: 'ink-50', min: 4.5, usage: 'Teks sekunder di permukaan abu' },
  { fg: 'navy', bg: 'ink-100', min: 4.5, usage: 'Teks di chip dan tag' },
  { fg: 'ink-200', bg: 'navy', min: 4.5, usage: 'Teks redup di bagian gelap' },
  { fg: 'lime', bg: 'blue', min: 3, usage: 'Lime di latar biru (hanya teks besar atau dekorasi)' },
]

export type ContrastResult = ContrastPair & {
  foreground: string
  background: string
  ratio: number
  pass: boolean
}

export function tokenValue(name: TokenName, colors: BrandColors): string {
  if (name === 'white') return '#FFFFFF'
  if (name.startsWith('ink-')) return buildInkScale(colors.navy)[name.slice(4) as InkStep]
  return colors[name as keyof BrandColors]
}

export function evaluateBrandContrast(colors: BrandColors = DEFAULT_BRAND): ContrastResult[] {
  return CONTRAST_PAIRS.map((pair) => {
    const foreground = tokenValue(pair.fg, colors)
    const background = tokenValue(pair.bg, colors)
    const ratio = contrastRatio(foreground, background)
    return { ...pair, foreground, background, ratio, pass: ratio >= pair.min }
  })
}

/** Throws when any required pair fails. Used by tests and at config load. */
export function assertBrandContrast(colors: BrandColors = DEFAULT_BRAND): void {
  const failures = evaluateBrandContrast(colors).filter((r) => !r.pass)
  if (failures.length) {
    const detail = failures
      .map((f) => `${f.fg} di ${f.bg}: ${f.ratio}:1 (minimal ${f.min}:1, ${f.usage})`)
      .join('; ')
    throw new Error(`Kontras warna tidak memenuhi WCAG AA: ${detail}`)
  }
}

/** CSS custom properties consumed by the Tailwind theme in styles.css. */
export function brandCssVariables(colors: BrandColors): string {
  const ink = buildInkScale(colors.navy)
  const vars = [
    `--brand-blue:${colors.blue}`,
    `--brand-navy:${colors.navy}`,
    `--brand-lime:${colors.lime}`,
    `--brand-cyan:${colors.cyan}`,
    ...INK_STEPS.map((step) => `--brand-ink-${step}:${ink[step]}`),
  ]
  return `:root{${vars.join(';')}}`
}
