import { describe, expect, it } from 'vitest'
import { buildUploadPolicy, validateUploadMetadata } from '../upload-policy'

describe('PMB upload policy', () => {
  it('permits four files exactly at the configured limit and rejects a fifth', () => {
    const policy = buildUploadPolicy(2)
    const files = Array.from({ length: 4 }, () => ({ size: 2097152, type: 'application/pdf' }))
    expect(policy).toEqual({ maxFiles: 4, maxFileBytes: 2097152, maxTotalFileBytes: 8388608, maxRequestBytes: 9437184 })
    expect(validateUploadMetadata(files, policy)).toBeNull()
    expect(validateUploadMetadata([...files, files[0]], policy)).not.toBeNull()
  })
  it('rejects an oversized file, unsupported format and invalid configuration', () => {
    const policy = buildUploadPolicy(2)
    expect(validateUploadMetadata([{ size: 2097153, type: 'application/pdf' }], policy)).not.toBeNull()
    expect(validateUploadMetadata([{ size: 100, type: 'application/javascript' }], policy)).not.toBeNull()
    expect(() => buildUploadPolicy(0)).toThrow()
    expect(() => buildUploadPolicy(Number.NaN)).toThrow()
  })
})
