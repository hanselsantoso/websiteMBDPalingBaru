'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { useState } from 'react'
import './admin.css'

export function TemplateTestButton() {
  const { id } = useDocumentInfo()
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!id) return <p className="ad-note">Simpan template untuk mengirim tes.</p>

  const send = async () => {
    setBusy(true)
    setStatus(null)
    try {
      const response = await fetch(`/api/v1/admin/message-templates/${id}/test`, { method: 'POST', credentials: 'include' })
      const json = (await response.json()) as { data?: { sentTo: string }; error?: { message: string } }
      setStatus(json.data ? `Tes dikirim ke ${json.data.sentTo}. Bila email belum dikonfigurasi, pesan tercatat di log server.` : json.error?.message ?? 'Gagal mengirim tes.')
    } catch {
      setStatus('Gagal mengirim tes. Periksa koneksi.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ad-field">
      <button type="button" className="ad-btn" onClick={send} disabled={busy}>
        {busy ? 'Mengirim…' : 'Kirim tes ke email saya'}
      </button>
      {status ? (
        <p className="ad-note" role="status">
          {status}
        </p>
      ) : null}
    </div>
  )
}
