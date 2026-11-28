type WaveStatus = 'dibuka' | 'akan-datang' | 'ditutup'

type AdmissionWave = {
  status?: string | null
  openDate?: string | null
  closeDate?: string | null
}

const jakartaDay = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Jakarta',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

function dayOf(value?: string | null): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? jakartaDay.format(date) : undefined
}

export function admissionWaveStatus(wave: AdmissionWave, now = new Date()): WaveStatus {
  const today = jakartaDay.format(now)
  const openDay = dayOf(wave.openDate)
  const closeDay = dayOf(wave.closeDate)
  if (wave.status === 'ditutup' || (closeDay && today > closeDay)) return 'ditutup'
  if (wave.status !== 'dibuka' || (openDay && today < openDay)) return 'akan-datang'
  return 'dibuka'
}
