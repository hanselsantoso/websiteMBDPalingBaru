/** Shared SVG geometry for the Arus Digital signature patterns. */

/** Curved shark dorsal fin in a 100×100 box (base on the bottom edge). */
export const FIN_PATH = 'M 2 98 C 30 94, 52 72, 60 4 C 68 38, 82 72, 98 98 Z'

/** Concave four-pointed star in a 100×100 box. */
export const STAR_PATH =
  'M 50 0 C 54 38, 62 46, 100 50 C 62 54, 54 62, 50 100 C 46 62, 38 54, 0 50 C 38 46, 46 38, 50 0 Z'

/** Smooth sine wave spanning two periods over `width`, filled down to `height`. */
export function wavePath(width: number, height: number, amplitude: number, baseline: number, periods = 2): string {
  const step = width / (periods * 2)
  let d = `M 0 ${baseline}`
  for (let i = 0; i < periods * 2; i++) {
    const x0 = i * step
    const dir = i % 2 === 0 ? -1 : 1
    d += ` C ${x0 + step * 0.36} ${baseline + dir * amplitude}, ${x0 + step * 0.64} ${baseline + dir * amplitude}, ${x0 + step} ${baseline}`
  }
  return `${d} L ${width} ${height} L 0 ${height} Z`
}
