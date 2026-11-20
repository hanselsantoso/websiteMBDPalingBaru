'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { useEffect, useState } from 'react'
import './admin.css'

type Usage = { where: string; title: string; href: string }

export function MediaUsage() {
  const { id } = useDocumentInfo()
  const [state, setState] = useState<{ loading: boolean; items: Usage[]; error?: string }>({ loading: true, items: [] })

  useEffect(() => {
    if (!id) {
      setState({ loading: false, items: [] })
      return
    }
    let cancelled = false
    fetch(`/api/v1/admin/media-usage/${id}`, { credentials: 'include' })
      .then((response) => response.json())
      .then((json: { data?: Usage[]; error?: { message: string } }) => {
        if (!cancelled) setState({ loading: false, items: json.data ?? [], error: json.error?.message })
      })
      .catch(() => !cancelled && setState({ loading: false, items: [], error: 'Gagal memuat pemakaian.' }))
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="ad-field">
      <span className="ad-label">Dipakai di</span>
      {state.loading ? <p className="ad-note">Memeriksa…</p> : null}
      {state.error ? <p className="ad-note">{state.error}</p> : null}
      {!state.loading && !state.error && state.items.length === 0 ? (
        <p className="ad-note">{id ? 'Belum dipakai. Aman dihapus.' : 'Simpan media untuk melihat pemakaian.'}</p>
      ) : null}
      <ul className="ad-list">
        {state.items.map((item) => (
          <li key={`${item.href}-${item.title}`}>
            <a href={item.href}>
              {item.where}: {item.title}
            </a>
          </li>
        ))}
      </ul>
      {state.items.length ? <p className="ad-note">Media yang sedang dipakai tidak dapat dihapus. Ganti filenya di tempat tersebut dulu.</p> : null}
    </div>
  )
}
