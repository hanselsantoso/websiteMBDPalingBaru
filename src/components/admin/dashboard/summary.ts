import type { PayloadRequest } from 'payload'
import { cache } from 'react'
import { getPermissions } from '@/access'
import { dashboardSummary } from '@/server/dashboard'
import { collectPlaceholders } from '@/server/placeholders'

export type WidgetProps = { req: PayloadRequest; user?: { name?: string | null; email?: string } | null }

/** Memoized per request so several widgets share one set of queries. */
export const getSummary = cache(async (req: PayloadRequest) => dashboardSummary(req.payload, await getPermissions(req), req))

export const getPlaceholderItems = cache(async (req: PayloadRequest) =>
  collectPlaceholders(req.payload, await getPermissions(req), req),
)
