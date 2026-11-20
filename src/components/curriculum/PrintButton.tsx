'use client'

import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

export function PrintButton() {
  return (
    <Button onClick={() => window.print()}>
      <Icon name="download" size={18} strokeWidth={2.5} /> Cetak / Simpan sebagai PDF
    </Button>
  )
}
