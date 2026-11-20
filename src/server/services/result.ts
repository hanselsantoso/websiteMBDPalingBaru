export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string; fieldErrors?: Record<string, string> }

export const success = <T>(data: T): ServiceResult<T> => ({ ok: true, data })

export const failure = (code: string, message: string, fieldErrors?: Record<string, string>): ServiceResult<never> => ({
  ok: false,
  code,
  message,
  fieldErrors,
})

export const GENERIC_ERROR = 'Maaf, kami belum bisa menyimpan datamu. Periksa koneksi lalu coba lagi.'
