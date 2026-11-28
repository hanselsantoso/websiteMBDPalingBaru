import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const require = createRequire(import.meta.url)
const root = fileURLToPath(new URL('..', import.meta.url))
const fixedPages = [
  '/', '/program', '/kurikulum', '/kurikulum/cetak', '/dosen', '/karier', '/blog',
  '/pmb', '/kuis', '/kontak', '/mbd-crew',
]
const profiles = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
}
const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    output: { type: 'string', default: 'output/handoff-bilingual' },
    manifest: { type: 'string' },
    playwright: { type: 'string' },
    browser: { type: 'string' },
    workers: { type: 'string', default: '4' },
    'mobile-all': { type: 'boolean' },
    'full-page': { type: 'boolean' },
    help: { type: 'boolean', short: 'h' },
  },
})

if (values.help) {
  console.log(`Usage: node scripts/capture-screenshots.mjs <origin> [options]
  --output <directory>    Output directory (default: output/handoff-bilingual)
  --manifest <file>       Next.js prerender-manifest.json, including unlisted HTML pages
  --playwright <path>     Explicit path to the playwright or playwright-core package
  --browser <path>        Explicit path to a Chromium executable
  --workers <count>       Browser workers (default: 4)
  --mobile-all            Capture every discovered page on mobile
  --full-page             Capture the entire document instead of the first viewport`)
  process.exit(0)
}

const origin = new URL(positionals[0] ?? 'http://localhost:3000')
const workers = Number(values.workers)
if (positionals.length > 1 || !/^https?:$/.test(origin.protocol) || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) {
  throw new Error('Provide one HTTP(S) origin without a username, password, path, query, or fragment.')
}
if (!Number.isInteger(workers) || workers < 1 || workers > 12) {
  throw new Error('--workers must be between 1 and 12.')
}

const output = path.resolve(root, values.output)
const normalizePath = (route) => route.replace(/\/+$/, '') || '/'
const basePath = (route) => normalizePath(route.replace(/^\/en(?=\/|$)/, ''))
const languagePath = (route, language) => language === 'en' ? `/en${route === '/' ? '' : route}` : route
const routeGroup = (route) => route === '/kurikulum/cetak' ? null : /^\/(blog|dosen|kurikulum)\/[^/]+$/.exec(route)?.[1]

function isPublicPage(route) {
  return /^\/(?:[a-z0-9%_-]+\/)*[a-z0-9%_-]*$/i.test(route)
    && !/^\/(?:api|admin|internal|pratinjau|unduh|health|_next|_not-found|_global-error)(?:\/|$)/.test(route)
    && route !== '/blog/data' && route !== '/beranda' && route !== '/siasat'
}

function decodeXml(value) {
  return value.replace(/&(?:amp|apos|gt|lt|quot);/g, (entity) => ({
    '&amp;': '&', '&apos;': "'", '&gt;': '>', '&lt;': '<', '&quot;': '"',
  })[entity])
}

async function discoverRoutes() {
  const routes = new Set(fixedPages)
  const sitemap = await fetch(new URL('/sitemap.xml', origin), { signal: AbortSignal.timeout(15_000) })
  if (!sitemap.ok) throw new Error(`Sitemap returned HTTP ${sitemap.status}.`)
  const xml = await sitemap.text()
  if (!/<urlset(?:\s|>)/.test(xml)) throw new Error('Expected a sitemap URL set.')

  for (const [, entry] of xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)) {
    const route = basePath(new URL(decodeXml(entry), origin).pathname)
    if (isPublicPage(route)) routes.add(route)
  }

  if (values.manifest) {
    const manifest = JSON.parse(await readFile(path.resolve(root, values.manifest), 'utf8'))
    if (!manifest.routes || typeof manifest.routes !== 'object') throw new Error('Expected a Next.js prerender manifest.')
    for (const route of Object.keys(manifest.routes).map(basePath)) {
      if (isPublicPage(route)) routes.add(route)
    }
  }

  return [...routes].sort()
}

function buildShots(routes) {
  const representatives = new Set()
  return routes.flatMap((route) => {
    const group = routeGroup(route)
    const mobile = values['mobile-all'] || !group || !representatives.has(group)
    if (group) representatives.add(group)
    return ['id', 'en'].flatMap((language) => {
      const pathname = languagePath(route, language)
      const filename = (route === '/' ? 'beranda' : route.slice(1)) + '.jpg'
      return (mobile ? ['desktop', 'mobile'] : ['desktop']).map((device) => ({
        route: pathname,
        language,
        device,
        file: [language, device, filename].join('/'),
      }))
    })
  })
}

function loadChromium() {
  const qaPackage = path.join(root, '.local-data', 'visual-qa', 'node_modules', 'playwright-core')
  const packages = values.playwright ? [path.resolve(values.playwright)] : ['playwright', 'playwright-core', qaPackage]
  for (const name of packages) {
    let resolved
    try {
      resolved = require.resolve(name)
    } catch (error) {
      if (error.code !== 'MODULE_NOT_FOUND') throw error
      continue
    }
    return require(resolved).chromium
  }
  throw new Error('Install playwright or playwright-core, or pass --playwright with its package path.')
}

async function launchBrowser(chromium) {
  if (values.browser) {
    const executablePath = path.resolve(values.browser)
    await access(executablePath)
    return chromium.launch({ executablePath, headless: true })
  }

  const attempts = []
  for (const channel of [undefined, 'msedge', 'chrome']) {
    try {
      return await chromium.launch({ channel, headless: true })
    } catch (error) {
      attempts.push(`${channel ?? 'chromium'}: ${error.message.split('\n')[0]}`)
    }
  }
  throw new Error(`No Chromium browser could launch. ${attempts.join(' | ')}`)
}

async function capture(page, shot) {
  const runtimeErrors = []
  const onError = (error) => runtimeErrors.push(error.message)
  page.on('pageerror', onError)
  try {
    const response = await page.goto(new URL(shot.route, origin).href, { waitUntil: 'networkidle', timeout: 30_000 })
    const current = new URL(page.url())
    if (!response?.ok() || current.origin !== origin.origin || normalizePath(current.pathname) !== shot.route) {
      throw new Error(`HTTP ${response?.status() ?? 'unknown'} at ${current.pathname}.`)
    }

    await page.evaluate(async (fullPage) => {
      const images = [...document.images].filter((image) => {
        const { width, height, top } = image.getBoundingClientRect()
        return width > 0 && height > 0 && (fullPage || top < innerHeight)
      })
      await Promise.race([
        Promise.allSettled([document.fonts.ready, ...images.map((image) => image.decode())]),
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ])
    }, values['full-page'] ?? false)

    const imageStats = await page.evaluate((fullPage) => {
      const images = [...document.images].filter((image) => {
        const { width, height, top } = image.getBoundingClientRect()
        return width > 0 && height > 0 && (fullPage || top < innerHeight)
      })
      return { visibleImages: images.length, unloadedImages: images.filter((image) => !image.naturalWidth).length }
    }, values['full-page'] ?? false)

    const file = path.join(output, shot.file)
    await mkdir(path.dirname(file), { recursive: true })
    await page.screenshot({ path: file, type: 'jpeg', quality: 83, fullPage: values['full-page'] })
    return {
      ...shot,
      httpStatus: response.status(),
      htmlLanguage: await page.locator('html').getAttribute('lang'),
      title: await page.title(),
      ...imageStats,
      runtimeErrors,
    }
  } finally {
    page.off('pageerror', onError)
  }
}

const routes = await discoverRoutes()
const shots = buildShots(routes)
const results = []
const browser = await launchBrowser(loadChromium())
try {
  let nextShot = 0
  await Promise.all(Array.from({ length: Math.min(workers, shots.length) }, async () => {
    const contexts = await Promise.all(Object.entries(profiles).map(async ([device, profile]) => [
      device, await browser.newContext({ ...profile, reducedMotion: 'reduce', serviceWorkers: 'block' }),
    ]))
    try {
      const byDevice = Object.fromEntries(contexts)
      while (nextShot < shots.length) {
        const shot = shots[nextShot++]
        const page = await byDevice[shot.device].newPage()
        try {
          results.push(await capture(page, shot))
          console.log(`${shot.device} ${shot.route} -> ${shot.file}`)
        } catch (error) {
          results.push({ ...shot, error: error.message })
          console.error(`${shot.device} ${shot.route}: ${error.message}`)
        } finally {
          await page.close()
        }
      }
    } finally {
      await Promise.all(contexts.map(([, context]) => context.close()))
    }
  }))
} finally {
  await browser.close()
}

results.sort((a, b) => a.file.localeCompare(b.file))
await mkdir(output, { recursive: true })
await writeFile(path.join(output, 'capture-manifest.json'), `${JSON.stringify({ origin: origin.origin, routes, profiles, results }, null, 2)}\n`)

const failures = results.filter((result) => result.error || result.runtimeErrors?.length || result.unloadedImages > 0)
const captures = results.filter((result) => !result.error).length
console.log(`Captured ${captures}/${shots.length} screenshots for ${routes.length * 2} public routes. ${failures.length} need review.`)
if (failures.length) process.exitCode = 1
