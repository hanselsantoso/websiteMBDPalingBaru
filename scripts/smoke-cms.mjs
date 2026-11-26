import assert from 'node:assert/strict'

const args = process.argv.slice(2)
const origin = new URL(args.find(arg => arg !== '--require-content') ?? 'http://127.0.0.1:3000').origin
const contentStatuses = args.includes('--require-content') ? [200] : [200, 404]
const checks = []

async function request(path, allowedStatuses, options) {
  const response = await fetch(new URL(path, origin), {
    redirect: 'manual',
    signal: AbortSignal.timeout(10_000),
    ...options,
  })
  checks.push([options?.method ?? 'GET', path, response.status])
  assert.ok(allowedStatuses.includes(response.status), `${path}: HTTP ${response.status}, expected ${allowedStatuses.join(' or ')}`)
  return response
}

async function api(path, allowedStatuses = [200], options) {
  const response = await request(`/api/v1${path}`, allowedStatuses, options)
  const body = await response.json()
  assert.ok(Object.hasOwn(body, 'data') && Object.hasOwn(body, 'error'), path)
  if (response.ok) assert.equal(body.error, null, path)
  else {
    assert.equal(body.data, null, path)
    assert.equal(typeof body.error?.code, 'string', path)
    assert.match(response.headers.get('cache-control') ?? '', /no-store/, path)
  }
  return body
}

const invalidForm = {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: '{}',
}

async function main() {
  const health = await request('/health?ready=1', [200])
  assert.equal((await health.json()).status, 'ok')
  const admin = await request('/admin', [200, 302, 307])
  if (admin.status !== 200) {
    const next = new URL(admin.headers.get('location'), origin)
    assert.equal(next.origin, origin)
    assert.ok(['/admin/login', '/admin/create-first-user'].includes(next.pathname), next.pathname)
    await request(next.pathname, [200])
  }

  const { data: site } = await api('/site')
  assert.equal(typeof site.settings.siteName, 'string')
  assert.ok(!Object.hasOwn(site.settings, 'integrations'))
  assert.equal(typeof (await api('/branding/mascot')).data.name, 'string')

  for (const path of [
    '/branding', '/curriculum', '/faculty', '/posts', '/post-categories', '/programs',
    '/careers', '/partners', '/testimonials', '/jobs', '/pmb/info', '/quiz', '/search?q=mbd',
  ]) {
    await api(path)
  }
  for (const path of ['/pages/qa-tidak-ada', '/courses/qa-tidak-ada', '/faculty/qa-tidak-ada', '/posts/qa-tidak-ada']) {
    assert.equal((await api(path, [404])).error.code, 'not_found')
  }
  for (const path of ['/pmb/applications', '/pmb/status', '/leads/brochure', '/contact', '/quiz/attempts']) {
    assert.equal((await api(path, [422], invalidForm)).error.code, 'validation_error')
  }
  for (const path of ['/admin/placeholders', '/admin/dashboard/summary', '/admin/media-usage/qa-tidak-ada']) {
    await api(path, [401, 403])
  }
  for (const slug of ['admins', 'roles', 'pmb-applications', 'pmb-documents', 'leads', 'contact-messages', 'quiz-attempts', 'audit-logs']) {
    await request(`/api/${slug}?limit=1`, [401, 403])
  }
  for (const slug of ['pages', 'posts']) {
    await request(`/api/${slug}?draft=true&limit=1`, [401, 403])
  }
  await request('/unduh/brosur', [403])
  for (const path of ['/', '/siasat', '/kurikulum/cetak', '/robots.txt', '/sitemap.xml']) {
    await request(path, [200])
  }
  for (const path of ['/program', '/kurikulum', '/dosen', '/karier', '/blog', '/kontak', '/kuis', '/pmb']) {
    await request(path, contentStatuses)
  }
  for (const path of [
    '/images/brand/mbd-jejak-siasat.webp',
    '/images/mascot/toon/greeting.webp',
    '/images/mascot/animation/siasat-sapaan-sprite-640.webp',
    '/images/mascot/animation/siasat-berpikir-sprite-192.webp',
    '/images/mascot/animation/siasat-berhasil-sprite-384.webp',
  ]) {
    const image = await request(path, [200])
    assert.match(image.headers.get('content-type') ?? '', /^image\/webp/, path)
    assert.ok((await image.arrayBuffer()).byteLength > 0, path)
  }
}

try {
  await main()
  console.log(`Lulus ${checks.length} pemeriksaan CMS dan website di ${origin}`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {
  for (const [method, path, status] of checks) console.log(`${status} ${method} ${path}`)
}
