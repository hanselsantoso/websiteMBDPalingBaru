'use client'

import { useAllFormFields } from '@payloadcms/ui'
import { useMemo } from 'react'
import './admin.css'

export function PlaceholderBadge() {
  const [fields] = useAllFormFields()
  const hits = useMemo(
    () =>
      Object.entries(fields ?? {})
        .filter(([, state]) => {
          const value = (state as { value?: unknown })?.value
          if (typeof value === 'string') return value.includes('[ISI')
          if (value && typeof value === 'object') return JSON.stringify(value).includes('[ISI')
          return false
        })
        .map(([path]) => path),
    [fields],
  )
  if (!hits.length) return null
  return (
    <span className="ad-pill ad-pill--amber" title={`Masih berisi [ISI]:\n${hits.slice(0, 15).join('\n')}`} role="status">
      {hits.length} penanda [ISI]
    </span>
  )
}
