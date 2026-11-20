'use client'

import { useState } from 'react'
import { LEAD_SOURCES, LEAD_STATUSES } from '@/lib/domain/templates'
import './admin.css'

type Lead = { id: string; name: string; status?: string; firstSource?: string; followUpAt?: string; phoneMasked?: string }

export function LeadsBoard() {
  const [leads, setLeads] = useState<Lead[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    if (leads) return
    try {
      const params = new URLSearchParams({ limit: '300', depth: '0', sort: '-updatedAt' })
      for (const field of ['name', 'status', 'firstSource', 'followUpAt', 'phoneMasked']) params.append(`select[${field}]`, 'true')
      const response = await fetch(`/api/leads?${params.toString()}`, { credentials: 'include' })
      const json = (await response.json()) as { docs?: Lead[] }
      setLeads(json.docs ?? [])
    } catch {
      setError('Gagal memuat papan leads.')
    }
  }

  const sourceLabel = (value?: string) => LEAD_SOURCES.find((s) => s.value === value)?.label ?? '—'

  return (
    <details className="ad-board" onToggle={(event) => (event.currentTarget.open ? void load() : undefined)}>
      <summary>Tampilan papan (kanban) per status</summary>
      {error ? <p className="ad-note ad-pad">{error}</p> : null}
      {!leads && !error ? <p className="ad-note ad-pad">Memuat…</p> : null}
      {leads ? (
        <div className="ad-board__cols">
          {LEAD_STATUSES.map((status) => {
            const items = leads.filter((lead) => (lead.status ?? 'baru') === status.value)
            return (
              <section key={status.value} className="ad-board__col" aria-label={status.label}>
                <strong>
                  {status.label} <span className="ad-note">({items.length})</span>
                </strong>
                {items.slice(0, 8).map((lead) => (
                  <a key={lead.id} className="ad-board__card" href={`/admin/collections/leads/${lead.id}`}>
                    <strong>{lead.name}</strong>
                    <br />
                    <span className="ad-note">
                      {sourceLabel(lead.firstSource)} · {lead.phoneMasked ?? 'tanpa nomor'}
                    </span>
                  </a>
                ))}
                {items.length > 8 ? (
                  <a className="ad-note" href={`/admin/collections/leads?where[status][equals]=${status.value}`}>
                    Lihat {items.length - 8} lainnya
                  </a>
                ) : null}
              </section>
            )
          })}
        </div>
      ) : null}
    </details>
  )
}
