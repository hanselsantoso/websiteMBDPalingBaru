/** Shared (server + client) mascot constants. */
export const SIASAT_POSES = ['greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet'] as const
export type SiasatPose = (typeof SIASAT_POSES)[number]

export function isSiasatPose(value: unknown): value is SiasatPose {
  return typeof value === 'string' && (SIASAT_POSES as readonly string[]).includes(value)
}
