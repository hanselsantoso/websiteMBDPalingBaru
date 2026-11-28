'use client'

import { useLocale } from '@/components/providers/LocaleProvider'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

export function PrintButton() {
  const en = useLocale() === 'en'
  return (
    <Button className="max-w-full whitespace-normal" onClick={() => window.print()}>
      <Icon name="download" size={18} strokeWidth={2.5} className="shrink-0" /> {en ? 'Print / Save PDF' : 'Cetak / Simpan PDF'}
    </Button>
  )
}
