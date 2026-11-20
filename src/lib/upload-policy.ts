export type UploadPolicy = { maxFiles: 4; maxFileBytes: number; maxTotalFileBytes: number; maxRequestBytes: number }
const TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png'])

export function buildUploadPolicy(maxDocumentMb: number): UploadPolicy {
  if (!Number.isFinite(maxDocumentMb) || maxDocumentMb <= 0 || maxDocumentMb > 100) throw new Error('Batas dokumen belum dikonfigurasi dengan benar.')
  const maxFileBytes = Math.floor(maxDocumentMb * 1024 * 1024)
  return { maxFiles: 4, maxFileBytes, maxTotalFileBytes: 4 * maxFileBytes, maxRequestBytes: 4 * maxFileBytes + 1024 * 1024 }
}

export function validateUploadMetadata(files: readonly { size: number; type: string }[], policy: UploadPolicy): string | null {
  if (files.length > policy.maxFiles) return 'Unggah maksimal empat dokumen.'
  if (files.some((file) => !TYPES.has(file.type))) return 'Unggah dokumen PDF, JPG, atau PNG.'
  if (files.some((file) => !Number.isSafeInteger(file.size) || file.size <= 0 || file.size > policy.maxFileBytes)) return 'Ukuran dokumen melebihi batas atau file kosong.'
  if (files.reduce((total, file) => total + file.size, 0) > policy.maxTotalFileBytes) return 'Ukuran total dokumen melebihi batas.'
  return null
}
