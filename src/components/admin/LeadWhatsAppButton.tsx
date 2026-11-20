'use client'

import { useFormFields } from '@payloadcms/ui'
import { waLink } from '@/lib/domain/phone'
import './admin.css'

export function LeadWhatsAppButton() {
  const phone = useFormFields(([fields]) => fields?.phone?.value as string | undefined)
  const name = useFormFields(([fields]) => (fields?.name?.value as string | undefined) ?? '')
  const message = `Halo ${name.split(' ')[0] || 'Kak'}, kami dari tim PMB S1 Manajemen Bisnis Digital ISTTS. Terima kasih sudah menghubungi kami. Ada yang bisa kami bantu?`
  const href = waLink(phone, message)

  return (
    <div className="ad-field">
      {href ? (
        <a className="ad-btn ad-btn--wa" href={href} target="_blank" rel="noopener noreferrer">
          Hubungi via WhatsApp
        </a>
      ) : (
        <p className="ad-note">Tombol WhatsApp muncul bila nomor tersedia. Nomor tersamar untuk peran tanpa izin ekspor.</p>
      )}
    </div>
  )
}
