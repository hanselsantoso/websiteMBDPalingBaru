import type { CSSProperties } from 'react'

type TextStyleOptions = Record<string, Record<string, { label: string; css: Record<string, string> }>>

export const ARTICLE_TEXT_STATE: TextStyleOptions = {
  fontFamily: {
    'font-sans': { label: 'Font · Sans-serif', css: { 'font-family': 'system-ui, sans-serif' } },
    'font-serif': { label: 'Font · Serif', css: { 'font-family': 'Georgia, serif' } },
    'font-mono': { label: 'Font · Monospace', css: { 'font-family': 'ui-monospace, monospace' } },
  },
  fontSize: {
    'size-14': { label: 'Ukuran · 14 px', css: { 'font-size': '0.875rem' } },
    'size-16': { label: 'Ukuran · 16 px', css: { 'font-size': '1rem' } },
    'size-20': { label: 'Ukuran · 20 px', css: { 'font-size': '1.25rem' } },
    'size-24': { label: 'Ukuran · 24 px', css: { 'font-size': '1.5rem' } },
    'size-30': { label: 'Ukuran · 30 px', css: { 'font-size': '1.875rem' } },
  },
  textColor: {
    'color-blue': { label: 'Warna · Biru', css: { color: '#1646a3' } },
    'color-green': { label: 'Warna · Hijau', css: { color: '#126247' } },
    'color-red': { label: 'Warna · Merah', css: { color: '#a52337' } },
  },
}

export function articleTextStyle(state: unknown): CSSProperties {
  if (!state || typeof state !== 'object') return {}
  const options = state as Record<string, unknown>
  const { fontFamily, fontSize, textColor } = ARTICLE_TEXT_STATE
  const style: CSSProperties = {}
  if (typeof options.fontFamily === 'string' && Object.hasOwn(fontFamily, options.fontFamily)) {
    style.fontFamily = fontFamily[options.fontFamily].css['font-family']
  }
  if (typeof options.fontSize === 'string' && Object.hasOwn(fontSize, options.fontSize)) {
    style.fontSize = fontSize[options.fontSize].css['font-size']
  }
  if (typeof options.textColor === 'string' && Object.hasOwn(textColor, options.textColor)) {
    style.color = textColor[options.textColor].css.color
  }
  return style
}
