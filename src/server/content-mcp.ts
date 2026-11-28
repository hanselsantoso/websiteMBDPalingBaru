import type { MCPPluginConfig, SanitizedMCPPluginConfig } from '@payloadcms/plugin-mcp'
import { APIError, getAccessResults, UnauthorizedError } from 'payload'
import {
  MCP_CONTENT_ACCOUNTS,
  MCP_CONTENT_COLLECTIONS,
  MCP_CONTENT_GLOBALS,
  mcpContentMode,
} from '@/lib/domain/mcp-content'

type CollectionMCPItem = Extract<SanitizedMCPPluginConfig['items'][number], { type: 'collectionTool' }>

type GlobalMCPItem = Extract<SanitizedMCPPluginConfig['items'][number], { type: 'globalTool' }>

type CollectionWriteData = { _status?: string; deletedAt?: unknown; isActive?: boolean }

const DRAFT_COLLECTIONS = new Set(['pages', 'posts', 'faculty'])
const READ_COLLECTION_TOOLS = new Set(['find', 'count', 'getCollectionSchema'])
const READ_GLOBAL_TOOLS = new Set(['find', 'getGlobalSchema'])
const WRITE_COLLECTION_TOOLS = new Set(['create', 'update'])
const apiKeyPrefix = MCP_CONTENT_ACCOUNTS + ' API-Key '

function restrictCollectionWrites(item: CollectionMCPItem): CollectionMCPItem {
  if (!WRITE_COLLECTION_TOOLS.has(item.configKey)) return item
  const draftOnly = DRAFT_COLLECTIONS.has(item.collectionSlug)

  return {
    ...item,
    tool: {
      ...item.tool,
      handler: async (args) => {
        const input = args.input as {
          id?: string | number
          data?: CollectionWriteData
          documents?: { data: CollectionWriteData; file?: { source?: string } }[]
          draft?: boolean
          file?: { source?: string }
          publishAllLocales?: boolean
          unpublishAllLocales?: boolean
          trash?: boolean
        }
        if (item.configKey === 'update' && (input.id === undefined || input.trash)) {
          throw new APIError('Gunakan ID dokumen untuk memperbarui satu entri.', 400)
        }
        const files = [input.file, ...input.documents?.map(({ file }) => file) ?? []]
        if (files.some((file) => file && (item.collectionSlug !== 'media' || file.source !== 'base64'))) {
          throw new APIError('Lampirkan file base64 melalui koleksi Media.', 400)
        }
        const writes = [input.data, ...(input.documents?.map(({ data }) => data) ?? [])]
        if (writes.some((data) => data && 'deletedAt' in data)) {
          throw new APIError('Kelola arsip dan penghapusan melalui panel admin.', 403)
        }
        if (item.collectionSlug === 'curriculum-versions' && writes.some((data) => data?.isActive === true)) {
          throw new APIError('Aktifkan versi kurikulum melalui panel admin.', 403)
        }
        if (draftOnly && (input.draft !== true || input.publishAllLocales !== undefined
          || input.unpublishAllLocales !== undefined
          || writes.some((data) => data?._status !== undefined && data._status !== 'draft'))) {
          throw new APIError('Halaman, artikel, dan profil dosen harus disimpan dengan draft: true.', 403)
        }
        const originalQuery = args.req.query
        if (draftOnly) args.req.query = { ...originalQuery, draft: true }
        try {
          return await item.tool.handler(item.configKey === 'update'
            ? { ...args, input: { ...input, overrideLock: false } }
            : args)
        } finally {
          args.req.query = originalQuery
        }
      },
    },
  }
}

function restrictGlobalWrites(item: GlobalMCPItem): GlobalMCPItem {
  if (item.configKey !== 'update') return item
  return {
    ...item,
    tool: {
      ...item.tool,
      handler: (args) => {
        const input = args.input as { data: Record<string, unknown> }
        if (item.globalSlug === 'pmb-settings' && ('documentUploadEnabled' in input.data || 'maxDocumentMb' in input.data)) {
          throw new APIError('Atur kebijakan unggah dokumen melalui panel admin.', 403)
        }
        return item.tool.handler({ ...args, input: { ...input, overrideLock: false } })
      },
    },
  }
}

export const contentMcpConfig: MCPPluginConfig = {
  mcp: {
    serverOptions: {
      serverInfo: { name: 'MBD Content', version: '1.0.0' },
      options: {
        instructions: [
          'Kelola konten program studi Manajemen Bisnis Digital ISTTS melalui Payload CMS.',
          'Mulai dengan getConfigInfo. Editor memakai skema tool dan membaca dokumen sebelum menulis.',
          'Simpan halaman, artikel, dan profil dosen dengan draft: true. Perbarui satu dokumen berdasarkan ID.',
          'Perubahan pada master tanpa draf langsung berlaku. Unggah file Media kecil melalui base64.',
        ].join(' '),
      },
    },
  },
  hooks: {
    afterToolCall: [({ response, toolName }) => {
      if (!response.structuredContent && response.doc) {
        return { ...response, structuredContent: response.doc }
      }
      if (!response.doc && (toolName === 'findDocuments' || toolName === 'findGlobal')) {
        return { ...response, isError: true }
      }
      return response
    }],
  },
  overrideGetAuthorizedMCP: async ({ req, pluginConfig, overrideAccess }) => {
    const authorization = req.headers.get('Authorization')
    const key = authorization?.slice(apiKeyPrefix.length)
    if (overrideAccess || new URL(req.url!).searchParams.has('overrideAccess')
      || !authorization?.startsWith(apiKeyPrefix) || !key || /\s/.test(key)) {
      throw new UnauthorizedError(req.t)
    }

    const headers = new Headers({ Authorization: authorization, DisableAutologin: 'true' })
    req.user = (await req.payload.auth({ headers, req })).user
    const mode = mcpContentMode(req.user)
    if (!mode) throw new UnauthorizedError(req.t)

    const permissions = await getAccessResults({ req })
    const items: typeof pluginConfig.items = []
    for (const item of pluginConfig.items) {
      if (item.type === 'collectionTool' && Object.hasOwn(MCP_CONTENT_COLLECTIONS, item.collectionSlug)
        && (READ_COLLECTION_TOOLS.has(item.configKey) || (mode === 'editor' && WRITE_COLLECTION_TOOLS.has(item.configKey)))
        && (!item.tool.access || await item.tool.access({ slug: item.collectionSlug, permissions, req }))) {
        items.push(restrictCollectionWrites(item))
      }
      if (item.type === 'globalTool' && Object.hasOwn(MCP_CONTENT_GLOBALS, item.globalSlug)
        && (READ_GLOBAL_TOOLS.has(item.configKey) || (mode === 'editor' && item.configKey === 'update'))
        && (!item.tool.access || await item.tool.access({ slug: item.globalSlug, permissions, req }))) {
        items.push(restrictGlobalWrites(item))
      }
      if (item.type === 'tool' && item.configKey === 'getConfigInfo'
        && (!item.tool.access || await item.tool.access({ permissions, req }))) {
        items.push(item)
      }
    }
    return { items, overrideAccess: false }
  },
}
