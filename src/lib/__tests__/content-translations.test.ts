import { describe, expect, it, vi } from 'vitest'

const find = vi.hoisted(() => vi.fn())
vi.mock('../payload', () => ({ getPayloadClient: async () => ({ find }) }))
vi.mock('next/cache', () => ({ unstable_cache: (read: unknown) => read }))

import type { Access } from 'payload'
import { ContentTranslations } from '@/collections/ContentTranslations'
import {
  findEnglishSourceMatches,
  getContentTranslator,
  translateContent,
  translationReadContext,
} from '../content-translations'

describe('CMS content translations', () => {
  it('uses exact translations for English and leaves Indonesian unchanged', async () => {
    find.mockResolvedValueOnce({ docs: [{ source: 'Program', english: 'Degree' }] })
    expect((await getContentTranslator('id'))('Program')).toBe('Program')
    expect(find).not.toHaveBeenCalled()

    const translate = await getContentTranslator('en')
    expect([translate('Program'), translate('program'), translate(' Program')])
      .toEqual(['Degree', 'program', ' Program'])
    expect(find).toHaveBeenCalledWith(expect.objectContaining({
      collection: 'content-translations',
      depth: 0,
      overrideAccess: false,
      select: { source: true, english: true },
    }))
  })

  it('translates nested copy and Lexical text without changing routes, IDs or node types', () => {
    const translate = (text: string) => ({
      Program: 'Degree',
      paragraph: 'changed-paragraph',
      '/program': '/degree',
    })[text] ?? text
    const content = {
      id: 'Program',
      slug: 'Program',
      title: 'Program',
      cta: { label: 'Program', href: '/program', linkType: 'Program' },
      body: {
        root: { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Program' }] }] },
      },
      relationship: { relationTo: 'pages', value: 'Program' },
      careerPaths: [{ title: 'Program' }],
      tags: ['Program'],
    }

    expect(translateContent(content, translate)).toEqual({
      id: 'Program',
      slug: 'Program',
      title: 'Degree',
      cta: { label: 'Degree', href: '/program', linkType: 'Program' },
      body: {
        root: { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Degree' }] }] },
      },
      relationship: { relationTo: 'pages', value: 'Program' },
      careerPaths: [{ title: 'Degree' }],
      tags: ['Degree'],
    })
    expect(content.title).toBe('Program')
  })

  it('limits translation access to authorized editors, readers and the rendering context', async () => {
    function args(payloadAPI: string, context = {}, user: unknown = null) {
      return { req: { payloadAPI, context, user } } as Parameters<Access>[0]
    }

    const { read, create, update, delete: remove } = ContentTranslations.access!
    const renderContext = { translationRead: translationReadContext }
    expect(await read!(args('local'))).toBe(false)
    expect(await read!(args('local', renderContext))).toBe(true)
    expect(await read!(args('REST', renderContext))).toBe(false)

    const reader = args('MCP', {}, {
      collection: 'mcp-content-accounts', active: true, mode: 'reader', _strategy: 'api-key',
    })
    expect(await read!(reader)).toBe(true)
    expect(await create!(reader)).toBe(false)
    const editor = args('MCP', {}, { ...reader.req.user, mode: 'editor' })
    expect(await create!(editor)).toBe(true)
    expect(await update!(editor)).toBe(true)
    expect(await remove!(editor)).toBe(false)
  })

  it('retains raw integration settings and feature flags while translating editorial copy', () => {
    const settings = {
      title: 'Indonesian title',
      integrations: { customHeadScripts: '<script>original</script>', turnstileSiteKey: 'original-key' },
      customScripts: { bodyStart: '<script>original</script>' },
      features: { featureMode: 'original' },
      form: 'pmb', section: 'fees', scope: 'pmb', tone: 'dark',
      openDate: '2026-08-01', closeDate: '2026-10-31',
      turnstileSiteKey: 'original-key',
    }

    expect(translateContent(settings, () => 'translated')).toEqual({ ...settings, title: 'translated' })
  })

  it('finds the source copy for a bounded English search', async () => {
    find.mockClear()
    expect(await findEnglishSourceMatches(' % ')).toEqual([])
    expect(await findEnglishSourceMatches('x')).toEqual([])
    expect(find).not.toHaveBeenCalled()

    find.mockResolvedValueOnce({ docs: [{ source: 'Bisnis digital' }] })
    expect(await findEnglishSourceMatches('  Digital  business  ')).toEqual(['Bisnis digital'])
    expect(find).toHaveBeenCalledWith(expect.objectContaining({
      collection: 'content-translations',
      context: { translationRead: translationReadContext },
      limit: 100,
      overrideAccess: false,
      select: { source: true },
      where: { english: { like: 'Digital business' } },
    }))
  })
})
