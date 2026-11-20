'use client'

function cssVar(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

function wave(
  ctx: CanvasRenderingContext2D,
  width: number,
  baseline: number,
  amplitude: number,
  color: string,
  height: number,
) {
  ctx.beginPath()
  ctx.moveTo(0, baseline)
  const step = width / 4
  for (let i = 0; i < 4; i++) {
    const x0 = i * step
    const dir = i % 2 === 0 ? -1 : 1
    ctx.bezierCurveTo(
      x0 + step * 0.36,
      baseline + dir * amplitude,
      x0 + step * 0.64,
      baseline + dir * amplitude,
      x0 + step,
      baseline,
    )
  }
  ctx.lineTo(width, height)
  ctx.lineTo(0, height)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  const k = r * 0.18
  ctx.beginPath()
  ctx.moveTo(cx, cy - r)
  ctx.bezierCurveTo(cx + k, cy - k, cx + k, cy - k, cx + r, cy)
  ctx.bezierCurveTo(cx + k, cy + k, cx + k, cy + k, cx, cy + r)
  ctx.bezierCurveTo(cx - k, cy + k, cx - k, cy + k, cx - r, cy)
  ctx.bezierCurveTo(cx - k, cy - k, cx - k, cy - k, cx, cy - r)
  ctx.fillStyle = color
  ctx.fill()
}

/** Renders the shareable 1080×1350 result card in the browser. */
export async function renderShareCard({
  archetype,
  match,
  band,
}: {
  archetype: string
  match: number
  band: string
}): Promise<Blob | null> {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1350
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  try {
    await document.fonts?.ready
  } catch {
    // fonts API unavailable; system fonts are fine
  }
  const navy = cssVar('--brand-navy', '#071A3D')
  const blue = cssVar('--brand-blue', '#1A6BFF')
  const lime = cssVar('--brand-lime', '#C6F432')
  const cyan = cssVar('--brand-cyan', '#2EE6F6')
  const display = cssVar('--font-bricolage', 'sans-serif')
  const mono = cssVar('--font-jetbrains', 'monospace')

  ctx.fillStyle = navy
  ctx.fillRect(0, 0, 1080, 1350)
  star(ctx, 900, 170, 42, lime)
  star(ctx, 980, 300, 18, cyan)
  star(ctx, 120, 1000, 22, lime)
  wave(ctx, 1080, 1150, 30, cyan, 1350)
  wave(ctx, 1080, 1190, 34, blue, 1350)
  wave(ctx, 1080, 1240, 26, navy, 1350)

  ctx.fillStyle = lime
  ctx.font = `600 34px ${mono}`
  ctx.fillText('ARKETIPE STRATEGISKU', 90, 190)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = `800 116px ${display}`
  const lines = wrapLines(ctx, archetype, 900).slice(0, 3)
  lines.forEach((line, index) => ctx.fillText(line, 90, 320 + index * 120))

  const top = 320 + lines.length * 120 + 140
  ctx.fillStyle = lime
  ctx.font = `800 230px ${display}`
  ctx.fillText(`${match}%`, 82, top + 120)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `600 36px ${mono}`
  ctx.fillText('KECOCOKAN DENGAN MBD', 90, top + 190)
  ctx.font = `700 56px ${display}`
  ctx.fillText(band, 90, top + 270)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = `700 40px ${display}`
  ctx.fillText('Arus Digital', 90, 1300)
  ctx.font = `500 26px ${mono}`
  ctx.fillText('S1 MANAJEMEN BISNIS DIGITAL · ISTTS', 380, 1298)

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'))
}
