'use client'

import { m, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useId, type CSSProperties, type ReactNode } from 'react'
import { DEFAULT_BRAND, MASCOT_COLORS } from '@/lib/brand/tokens'
import { SIASAT_POSES, type SiasatPose } from '@/lib/brand/mascot'

/**
 * Pivot, the MBD strategist fox — flat vector PLACEHOLDER art.
 * Every moving part is its own layer so it can animate independently
 * (float, breathing, tail sway, ear twitch, blink, eye-follow, pose loops).
 * Uploaded 3D renders from the CMS replace this per pose with no code change.
 */

export { SIASAT_POSES, type SiasatPose }

const C = {
  orange: MASCOT_COLORS.foxOrange,
  shade: MASCOT_COLORS.foxOrangeShade,
  cream: MASCOT_COLORS.foxCream,
  navy: DEFAULT_BRAND.navy,
  blue: DEFAULT_BRAND.blue,
  blueDeep: '#1557D6',
  lime: DEFAULT_BRAND.lime,
  cyan: DEFAULT_BRAND.cyan,
  blush: '#FF9E73',
  tongue: '#FF8A63',
  white: '#FFFFFF',
}

type Mouth = 'smile' | 'grin' | 'smirk' | 'o' | 'wavy'
type Brows = 'raised' | 'smirk' | 'thinking' | 'worried'
type ArmSpec = { angle: number; length?: number }

type PoseSpec = {
  left: ArmSpec
  right: ArmSpec
  headTilt: number
  lean: number
  look: { x: number; y: number }
  mouth: Mouth
  brows: Brows
}

const POSES: Record<SiasatPose, PoseSpec> = {
  greeting: {
    left: { angle: 14 },
    right: { angle: -125, length: 60 },
    headTilt: 0,
    lean: 0,
    look: { x: 0, y: 0 },
    mouth: 'smile',
    brows: 'raised',
  },
  pointing: {
    left: { angle: 28 },
    right: { angle: -92, length: 52 },
    headTilt: 3,
    lean: 4,
    look: { x: 4, y: 0 },
    mouth: 'smirk',
    brows: 'smirk',
  },
  thinking: {
    left: { angle: -125, length: 34 },
    right: { angle: -10 },
    headTilt: -7,
    lean: 0,
    look: { x: 2, y: -5 },
    mouth: 'o',
    brows: 'thinking',
  },
  celebrating: {
    left: { angle: 118, length: 60 },
    right: { angle: -118, length: 60 },
    headTilt: 0,
    lean: 0,
    look: { x: 0, y: 0 },
    mouth: 'grin',
    brows: 'raised',
  },
  confused: {
    left: { angle: 160 },
    right: { angle: -8 },
    headTilt: 10,
    lean: -2,
    look: { x: -2, y: -1 },
    mouth: 'wavy',
    brows: 'worried',
  },
  tablet: {
    left: { angle: -8 },
    right: { angle: 37, length: 40 },
    headTilt: 4,
    lean: 0,
    look: { x: 0, y: 4 },
    mouth: 'smirk',
    brows: 'smirk',
  },
}

const SHOULDER_LEFT = { x: 124, y: 244 }
const SHOULDER_RIGHT = { x: 196, y: 244 }

export function starPath(cx: number, cy: number, r: number): string {
  const k = r * 0.18
  return [
    `M ${cx} ${cy - r}`,
    `C ${cx + k} ${cy - k}, ${cx + k} ${cy - k}, ${cx + r} ${cy}`,
    `C ${cx + k} ${cy + k}, ${cx + k} ${cy + k}, ${cx} ${cy + r}`,
    `C ${cx - k} ${cy + k}, ${cx - k} ${cy + k}, ${cx - r} ${cy}`,
    `C ${cx - k} ${cy - k}, ${cx - k} ${cy - k}, ${cx} ${cy - r} Z`,
  ].join(' ')
}

const loop = (duration: number, extra: Record<string, unknown> = {}) => ({
  duration,
  repeat: Infinity,
  ease: 'easeInOut' as const,
  ...extra,
})

function Arm({
  shoulder,
  spec,
  animate,
  transition,
  children,
}: {
  shoulder: { x: number; y: number }
  spec: ArmSpec
  animate?: Record<string, number[]>
  transition?: Record<string, unknown>
  children?: ReactNode
}) {
  const length = spec.length ?? 50
  const { x, y } = shoulder
  return (
    <g transform={`rotate(${spec.angle} ${x} ${y})`}>
      <m.g style={{ originX: 0.5, originY: 0 }} animate={animate} transition={transition}>
        <rect x={x - 11} y={y - 6} width={22} height={length + 6} rx={11} fill={C.orange} />
        <circle cx={x} cy={y + length} r={12.5} fill={C.navy} />
        <circle cx={x - 4} cy={y + length - 4} r={3} fill={C.white} opacity={0.18} />
        {children}
      </m.g>
    </g>
  )
}

function MouthShape({ mouth }: { mouth: Mouth }) {
  switch (mouth) {
    case 'smile':
      return (
        <g>
          <path d="M 146 200 C 150 217, 170 217, 176 200 Z" fill={C.navy} />
          <path
            d="M 153 209 C 157 215, 166 215, 170 209 C 165 206, 158 206, 153 209 Z"
            fill={C.tongue}
          />
        </g>
      )
    case 'grin':
      return (
        <g>
          <path d="M 141 197 C 145 224, 177 224, 181 197 Z" fill={C.navy} />
          <path
            d="M 150 211 C 155 219, 168 219, 173 211 C 166 207, 157 207, 150 211 Z"
            fill={C.tongue}
          />
        </g>
      )
    case 'o':
      return <ellipse cx={163} cy={205} rx={4.5} ry={5.5} fill={C.navy} />
    case 'wavy':
      return (
        <path
          d="M 146 205 q 4 -5 8 0 t 8 0 t 8 0 t 8 0"
          fill="none"
          stroke={C.navy}
          strokeWidth={3}
          strokeLinecap="round"
        />
      )
    default:
      return (
        <g fill="none" stroke={C.navy} strokeWidth={3} strokeLinecap="round">
          <path d="M 149 202 C 154 208, 164 208, 174 199" />
          <path d="M 174 199 l 3 -1" />
        </g>
      )
  }
}

function BrowShapes({ brows }: { brows: Brows }) {
  const paths: Record<Brows, [string, string]> = {
    raised: ['M 110 120 Q 126 108 142 116', 'M 178 116 Q 194 108 210 120'],
    smirk: ['M 110 118 Q 126 105 142 113', 'M 178 122 Q 194 118 210 124'],
    thinking: ['M 110 116 Q 126 101 142 111', 'M 178 124 Q 194 122 210 126'],
    worried: ['M 110 124 Q 124 116 140 113', 'M 180 113 Q 196 116 210 124'],
  }
  return (
    <g fill="none" stroke={C.navy} strokeWidth={4.5} strokeLinecap="round">
      <path d={paths[brows][0]} />
      <path d={paths[brows][1]} />
    </g>
  )
}

export type SiasatArtProps = {
  pose?: SiasatPose
  /** Run idle loops. False renders the static pose. */
  animated?: boolean
  /** Eyes follow the pointer (desktop, fine pointers only). */
  followPointer?: boolean
  /** Adapts accent colors (stars, question mark) to the background. */
  onDark?: boolean
  /** Mirror horizontally, e.g. to point left. */
  flip?: boolean
  title?: string
  className?: string
}

export function SiasatArt({
  pose = 'greeting',
  animated = true,
  followPointer = false,
  onDark = false,
  flip = false,
  title,
  className,
}: SiasatArtProps) {
  const spec = POSES[pose]
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const accent = onDark ? C.lime : C.blue
  const accentSoft = onDark ? C.cyan : C.navy

  const eyeX = useSpring(useMotionValue(spec.look.x), { stiffness: 180, damping: 18 })
  const eyeY = useSpring(useMotionValue(spec.look.y), { stiffness: 180, damping: 18 })

  useEffect(() => {
    eyeX.set(spec.look.x)
    eyeY.set(spec.look.y)
  }, [pose, spec.look.x, spec.look.y, eyeX, eyeY])

  useEffect(() => {
    if (!followPointer || !animated || typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return
    let frame = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const dx = (event.clientX / window.innerWidth - 0.5) * 2
        const dy = (event.clientY / window.innerHeight - 0.5) * 2
        eyeX.set(spec.look.x + Math.max(-1, Math.min(1, dx)) * 4 * (flip ? -1 : 1))
        eyeY.set(spec.look.y + Math.max(-1, Math.min(1, dy)) * 3)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [followPointer, animated, spec.look.x, spec.look.y, eyeX, eyeY, flip])

  const a = animated
  type ArmAnimation =
    | { animate: Record<string, number[]>; transition: ReturnType<typeof loop> }
    | undefined
  const rightArmAnim: ArmAnimation =
    pose === 'greeting'
      ? { animate: { rotate: [-12, 16, -12] }, transition: loop(1.1) }
      : pose === 'pointing'
        ? { animate: { y: [0, 5, 0] }, transition: loop(0.9) }
        : pose === 'celebrating'
          ? { animate: { rotate: [0, -10, 0] }, transition: loop(0.7) }
          : pose === 'tablet'
            ? { animate: { rotate: [0, 9, -2, 0] }, transition: loop(1.4) }
            : undefined
  const leftArmAnim: ArmAnimation =
    pose === 'celebrating'
      ? { animate: { rotate: [0, 10, 0] }, transition: loop(0.7) }
      : pose === 'confused'
        ? { animate: { rotate: [0, -8, 0, -8, 0] }, transition: loop(1.6) }
        : undefined

  return (
    <svg
      viewBox="0 0 320 360"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      data-mascot="siasat"
      data-art="placeholder-svg"
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <desc>Ilustrasi sementara (vektor) Pivot, rubah strategis MBD.</desc>
      <defs>
        <clipPath id={`scarf-${uid}`}>
          <path d="M 116 230 C 130 216, 190 216, 204 230 C 206 242, 194 250, 160 251 C 126 250, 114 242, 116 230 Z" />
        </clipPath>
        <clipPath id={`screen-${uid}`}>
          <rect x={130} y={266} width={60} height={36} rx={4} />
        </clipPath>
      </defs>

      <g transform={flip ? 'translate(320 0) scale(-1 1)' : undefined}>
        <g className={a ? 'anim-float' : undefined}>
          <g transform={`rotate(${spec.lean} 160 340)`}>
            {/* Tail */}
            <g>
              <path
                d="M 200 306 C 256 312, 302 272, 302 212 C 302 168, 284 136, 262 124 C 268 152, 262 186, 246 206 C 228 228, 212 252, 204 282 Z"
                fill={C.orange}
              />
              <path
                d="M 246 206 C 228 228, 212 252, 204 282"
                fill="none"
                stroke={C.shade}
                strokeWidth={7}
                opacity={0.35}
                strokeLinecap="round"
              />
              <path
                d="M 262 124 C 284 136, 302 166, 302 196 C 294 190, 288 202, 278 196 C 268 190, 264 200, 254 194 C 260 176, 266 152, 262 124 Z"
                fill={C.cream}
              />
            </g>

            {/* Feet (navy paw socks) */}
            <ellipse cx={134} cy={337} rx={20} ry={11} fill={C.navy} />
            <ellipse cx={186} cy={337} rx={20} ry={11} fill={C.navy} />

            {/* Body */}
            <g>
              <path
                d="M 114 300 C 110 254, 130 226, 160 224 C 190 226, 210 254, 206 300 C 204 326, 186 338, 160 338 C 134 338, 116 326, 114 300 Z"
                fill={C.orange}
              />
              <path
                d="M 114 300 C 112 270, 120 248, 134 236 C 126 258, 124 290, 132 330 C 120 324, 115 312, 114 300 Z"
                fill={C.shade}
                opacity={0.55}
              />
              <ellipse cx={160} cy={298} rx={30} ry={33} fill={C.cream} />
              <path
                d="M 204 262 C 210 280, 210 300, 202 318"
                fill="none"
                stroke={C.cyan}
                strokeWidth={2.5}
                opacity={0.65}
                strokeLinecap="round"
              />
            </g>

            {/* Lanyard + ID card */}
            <g>
              <path
                d="M 146 248 L 156 286 M 174 248 L 164 286"
                stroke={C.lime}
                strokeWidth={5}
                strokeLinecap="round"
              />
              <rect
                x={141}
                y={284}
                width={38}
                height={28}
                rx={5}
                fill={C.white}
                stroke={C.navy}
                strokeWidth={2.5}
              />
              <rect
                x={154}
                y={279}
                width={12}
                height={7}
                rx={2}
                fill={C.lime}
                stroke={C.navy}
                strokeWidth={1.5}
              />
              <text
                x={160}
                y={302.5}
                textAnchor="middle"
                fontFamily="var(--font-mono), 'JetBrains Mono', ui-monospace, monospace"
                fontSize={11}
                fontWeight={700}
                fill={C.navy}
                letterSpacing={0.6}
              >
                MBD
              </text>
            </g>

            {/* Scarf with wave pattern */}
            <path
              d="M 182 244 C 194 258, 198 276, 190 290 L 176 284 C 182 272, 180 260, 172 250 Z"
              fill={C.blueDeep}
            />
            <path
              d="M 116 230 C 130 216, 190 216, 204 230 C 206 242, 194 250, 160 251 C 126 250, 114 242, 116 230 Z"
              fill={C.blue}
            />
            <g clipPath={`url(#scarf-${uid})`}>
              <path
                d="M 112 237 q 7 -6 14 0 t 14 0 t 14 0 t 14 0 t 14 0 t 14 0 t 14 0"
                fill="none"
                stroke={C.cyan}
                strokeWidth={2.4}
                opacity={0.9}
              />
            </g>

            {/* Tablet prop */}
            {pose === 'tablet' ? (
              <g transform="rotate(-6 160 284)">
                <rect x={124} y={260} width={72} height={48} rx={8} fill={C.navy} />
                <rect x={130} y={266} width={60} height={36} rx={4} fill={C.blue} />
                <g clipPath={`url(#screen-${uid})`}>
                  <g>
                    <path
                      d="M 133 290 q 7 -10 14 0 t 14 0 t 14 0 t 12 0"
                      fill="none"
                      stroke={C.lime}
                      strokeWidth={3}
                      strokeLinecap="round"
                    />
                  </g>
                </g>
              </g>
            ) : null}

            {/* Head */}
            <g transform={`rotate(${spec.headTilt} 160 222)`}>
              <g>
                {/* Ears */}
                <g>
                  <path
                    d="M 98 116 C 92 84, 94 54, 104 38 C 122 50, 140 70, 148 96 Z"
                    fill={C.orange}
                  />
                  <path
                    d="M 106 104 C 103 82, 105 62, 110 52 C 122 62, 132 76, 137 94 Z"
                    fill={C.navy}
                  />
                </g>
                <g>
                  <path
                    d="M 222 116 C 228 84, 226 54, 216 38 C 198 50, 180 70, 172 96 Z"
                    fill={C.orange}
                  />
                  <path
                    d="M 214 104 C 217 82, 215 62, 210 52 C 198 62, 188 76, 183 94 Z"
                    fill={C.navy}
                  />
                </g>

                {/* Cheek fluff */}
                <path d="M 76 168 L 56 180 L 76 187 L 63 200 L 90 198 Z" fill={C.orange} />
                <path d="M 244 168 L 264 180 L 244 187 L 257 200 L 230 198 Z" fill={C.orange} />

                {/* Head shape */}
                <path
                  d="M 160 74 C 216 74, 250 106, 252 148 C 253 170, 246 186, 234 197 C 221 210, 193 222, 160 222 C 127 222, 99 210, 86 197 C 74 186, 67 170, 68 148 C 70 106, 104 74, 160 74 Z"
                  fill={C.orange}
                />
                <path
                  d="M 146 80 L 153 94 L 160 84 L 167 94 L 174 80"
                  fill="none"
                  stroke={C.shade}
                  strokeWidth={3}
                  strokeLinejoin="round"
                  opacity={0.5}
                />
                {/* Cream mask */}
                <path
                  d="M 92 178 C 106 160, 136 158, 160 172 C 184 158, 214 160, 228 178 C 234 198, 208 220, 160 221 C 112 220, 86 198, 92 178 Z"
                  fill={C.cream}
                />
                {/* Blush */}
                <ellipse cx={102} cy={192} rx={10} ry={6} fill={C.blush} opacity={0.55} />
                <ellipse cx={218} cy={192} rx={10} ry={6} fill={C.blush} opacity={0.55} />
                {/* Cyan rim light */}
                <path
                  d="M 236 110 C 248 126, 254 150, 246 178"
                  fill="none"
                  stroke={C.cyan}
                  strokeWidth={3}
                  opacity={0.75}
                  strokeLinecap="round"
                />

                {/* Eyes (follow + blink) */}
                <m.g style={{ x: eyeX, y: eyeY }}>
                  {[128, 192].map((cx) => (
                    <g key={cx}>
                      <ellipse cx={cx} cy={156} rx={15} ry={18} fill={C.navy} />
                      <path d={starPath(cx + 6, 149, 5.5)} fill={C.white} />
                      <circle cx={cx - 6} cy={164} r={2.3} fill={C.white} opacity={0.9} />
                    </g>
                  ))}
                </m.g>

                {/* Glasses */}
                <g fill="none" stroke={C.navy} strokeWidth={3.5}>
                  <circle cx={128} cy={156} r={25} fill={C.white} fillOpacity={0.12} />
                  <circle cx={192} cy={156} r={25} fill={C.white} fillOpacity={0.12} />
                  <path d="M 153 154 Q 160 148 167 154" strokeLinecap="round" />
                  <path d="M 103 151 L 86 145 M 217 151 L 234 145" strokeLinecap="round" />
                </g>
                <path
                  d="M 112 142 q 6 -6 14 -6"
                  fill="none"
                  stroke={C.white}
                  strokeWidth={2.5}
                  opacity={0.6}
                  strokeLinecap="round"
                />

                <BrowShapes brows={spec.brows} />

                {/* Nose */}
                <path
                  d="M 151 182 C 156 178, 164 178, 169 182 C 167 191, 163 194, 160 194 C 157 194, 153 191, 151 182 Z"
                  fill={C.navy}
                />
                <ellipse cx={157} cy={183} rx={2.2} ry={1.4} fill={C.white} opacity={0.7} />

                <MouthShape mouth={spec.mouth} />
              </g>
            </g>

            {/* Arms (front layer) */}
            <Arm
              shoulder={SHOULDER_LEFT}
              spec={spec.left}
              animate={a ? leftArmAnim?.animate : undefined}
              transition={leftArmAnim?.transition}
            />
            <Arm
              shoulder={SHOULDER_RIGHT}
              spec={spec.right}
              animate={a ? rightArmAnim?.animate : undefined}
              transition={rightArmAnim?.transition}
            >
              {pose === 'pointing' ? (
                <rect
                  x={SHOULDER_RIGHT.x - 4}
                  y={SHOULDER_RIGHT.y + (spec.right.length ?? 50) + 6}
                  width={8}
                  height={16}
                  rx={4}
                  fill={C.navy}
                />
              ) : null}
              {pose === 'tablet' ? (
                <g>
                  <rect
                    x={SHOULDER_RIGHT.x - 2.5}
                    y={SHOULDER_RIGHT.y + (spec.right.length ?? 50) - 2}
                    width={5}
                    height={24}
                    rx={2.5}
                    fill={C.lime}
                    stroke={C.navy}
                    strokeWidth={1.5}
                  />
                </g>
              ) : null}
            </Arm>

            {/* Pose extras */}
            {pose === 'greeting' ? (
              <g
                className={a ? 'anim-twinkle' : undefined}
                fill="none"
                stroke={accentSoft}
                strokeWidth={3}
                strokeLinecap="round"
              >
                <path d="M 270 168 q 10 8 6 22" />
                <path d="M 282 160 q 14 12 8 32" />
              </g>
            ) : null}

            {pose === 'thinking' ? (
              <g>
                <circle cx={228} cy={112} r={5} fill={C.white} stroke={C.navy} strokeWidth={2.5} />
                <circle cx={242} cy={90} r={8} fill={C.white} stroke={C.navy} strokeWidth={2.5} />
                <path
                  d="M 244 58 C 240 44, 254 32, 266 38 C 272 26, 292 28, 294 42 C 306 44, 308 62, 296 66 C 292 78, 270 78, 264 70 C 254 76, 240 70, 244 58 Z"
                  fill={C.white}
                  stroke={C.navy}
                  strokeWidth={2.5}
                />
                {[
                  { x: 262, y: 54, r: 8, fill: C.blue, delay: 0 },
                  { x: 282, y: 55, r: 5.5, fill: C.navy, delay: 0.5 },
                ].map((star) => (
                  <path
                    key={star.x}
                    d={starPath(star.x, star.y, star.r)}
                    fill={star.fill}
                    className={a ? 'anim-twinkle' : undefined}
                    style={
                      a ? ({ '--twinkle-delay': `${star.delay}s` } as CSSProperties) : undefined
                    }
                  />
                ))}
              </g>
            ) : null}

            {pose === 'confused' ? (
              <g className={a ? 'anim-float' : undefined}>
                <text
                  x={248}
                  y={96}
                  fontFamily="var(--font-display), 'Bricolage Grotesque', system-ui, sans-serif"
                  fontSize={56}
                  fontWeight={800}
                  fill={accent}
                >
                  ?
                </text>
              </g>
            ) : null}

            {pose === 'celebrating' ? (
              <g>
                {[
                  { x: 60, y: 110, r: 9, fill: accent },
                  { x: 262, y: 104, r: 10, fill: C.cyan },
                  { x: 92, y: 60, r: 7, fill: C.orange },
                  { x: 236, y: 54, r: 7, fill: accent },
                  { x: 40, y: 190, r: 6, fill: C.cyan },
                  { x: 284, y: 186, r: 6, fill: C.orange },
                ].map((star, index) => (
                  <path
                    key={index}
                    d={starPath(star.x, star.y, star.r)}
                    fill={star.fill}
                    className={a ? 'anim-twinkle' : undefined}
                    style={
                      a ? ({ '--twinkle-delay': `${index * 0.25}s` } as CSSProperties) : undefined
                    }
                  />
                ))}
              </g>
            ) : null}
          </g>
        </g>
      </g>
    </svg>
  )
}
