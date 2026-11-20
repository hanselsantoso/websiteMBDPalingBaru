'use client'

import { useFormFields } from '@payloadcms/ui'
import './admin.css'

export function ReplyByEmailButton() {
  const email = useFormFields(([fields]) => fields?.email?.value as string | undefined)
  const name = useFormFields(([fields]) => (fields?.name?.value as string | undefined) ?? '')
  const message = useFormFields(([fields]) => (fields?.message?.value as string | undefined) ?? '')
  if (!email) return null
  const subject = encodeURIComponent('Balasan dari S1 Manajemen Bisnis Digital ISTTS')
  const body = encodeURIComponent(
    `Halo ${name},\n\nTerima kasih sudah menghubungi kami.\n\n\n---\nPesan Anda:\n${message.slice(0, 800)}`,
  )
  return (
    <div className="ad-field">
      <a className="ad-btn" href={`mailto:${email}?subject=${subject}&body=${body}`}>
        Balas lewat email
      </a>
      <p className="ad-note">Setelah membalas, ubah status menjadi “Dibalas”.</p>
    </div>
  )
}
