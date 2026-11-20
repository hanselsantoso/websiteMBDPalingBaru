/** Spring presets for Framer Motion, defined once and reused everywhere. */
export const springs = {
  snappy: { type: 'spring', stiffness: 520, damping: 34, mass: 0.7 },
  soft: { type: 'spring', stiffness: 170, damping: 24 },
  bouncy: { type: 'spring', stiffness: 380, damping: 15 },
} as const

export const easeSoft = [0.25, 1, 0.5, 1] as const
export const easeSnappy = [0.2, 0, 0, 1] as const

export const durations = {
  micro: 0.18,
  reveal: 0.65,
} as const
