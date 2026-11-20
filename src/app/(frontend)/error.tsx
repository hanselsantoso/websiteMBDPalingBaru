'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Siasat } from '@/components/mascot/Siasat'
import { Button, buttonStyles } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="grid min-h-[70vh] place-items-center bg-white px-6 py-20 text-center">
      <div className="grid max-w-xl justify-items-center gap-5">
        <Siasat pose="confused" size="md" />
        <p className="label-mono text-blue">Terjadi kendala</p>
        <h1 className="text-section font-bold">Ada yang tidak beres di sisi kami.</h1>
        <p className="text-lead text-ink-600">
          Coba muat ulang bagian ini. Kalau masih bermasalah, kabari kami lewat halaman Kontak.
        </p>
        {error.digest ? <p className="label-mono text-ink-500">Kode: {error.digest}</p> : null}
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button onClick={() => unstable_retry()}>
            <Icon name="refresh" size={18} strokeWidth={2.5} /> Coba lagi
          </Button>
          <Link href="/" className={buttonStyles.secondary}>
            Ke Beranda
          </Link>
        </div>
      </div>
    </section>
  )
}
