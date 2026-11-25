'use client'

import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

export function PrintButton() {
  return (
    <Button className="max-w-full whitespace-normal" onClick={() => window.print()}>
      <Icon name="download" size={18} strokeWidth={2.5} className="shrink-0" /> Cetak / Simpan PDF
    </Button>
  )
}
