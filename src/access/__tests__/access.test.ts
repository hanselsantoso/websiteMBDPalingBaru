import type { PayloadRequest } from 'payload'
import { describe, expect, it } from 'vitest'
import { getPermissions, publicOr, write } from '../index'

const request = (user: Record<string, unknown> | null) =>
  ({ user, context: {}, payload: {} }) as unknown as PayloadRequest
const writer = {
  id: 'w1',
  collection: 'admins',
  role: {
    key: 'penulis',
    permissions: { blog: { actions: ['lihat', 'buat', 'ubah'], scope: 'own' } },
  },
}
const editor = {
  id: 'e1',
  collection: 'admins',
  role: {
    key: 'editor',
    permissions: { blog: { actions: ['lihat', 'buat', 'ubah', 'terbitkan'] } },
  },
}

const published = { _status: { equals: 'published' } }

describe('access guards', () => {
  it('limits anonymous visitors to published records', async () => {
    expect(await publicOr('blog')({ req: request(null) } as never)).toEqual(published)
    expect(
      await publicOr('blog')({ req: { ...request(null), query: { draft: 'true' } } } as never),
    ).toBe(false)
  })

  it('lets authors see their own drafts plus published records', async () => {
    expect(
      await publicOr('blog', { ownerField: 'author' })({ req: request(writer) } as never),
    ).toEqual({
      or: [{ author: { equals: 'w1' } }, published],
    })
  })

  it('gives full read access to roles with all scope', async () => {
    expect(await publicOr('blog')({ req: request(editor) } as never)).toBe(true)
  })

  it('blocks publishing without the publish permission', async () => {
    const update = write('blog', 'ubah', { publishGate: true, ownerField: 'author' })
    expect(await update({ req: request(writer), data: { _status: 'published' } } as never)).toBe(
      false,
    )
    expect(await update({ req: request(writer), data: { title: 'Tanpa status' } } as never)).toBe(
      false,
    )
    expect(await update({ req: request(writer), data: { _status: 'draft' } } as never)).toEqual({
      author: { equals: 'w1' },
    })
    expect(await update({ req: request(editor), data: { _status: 'published' } } as never)).toBe(
      true,
    )
  })

  it('treats deactivated and non-admin users as having no permissions', async () => {
    expect(await getPermissions(request({ ...editor, status: 'nonaktif' }))).toEqual({
      isSuperAdmin: false,
      roleKey: null,
      matrix: {},
    })
    expect(await getPermissions(request({ id: 'u', collection: 'users' }))).toBeNull()
  })
})
