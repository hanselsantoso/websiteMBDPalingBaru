import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const cli = fileURLToPath(new URL('../node_modules/payload/bin.js', import.meta.url))
const defaultFile = fileURLToPath(new URL('../seed/content-translations.en.json', import.meta.url))
const slug = 'content-translations'
const batchSize = 50
const lookupSize = 100

function runPayload(command, body) {
  const child = spawnSync(process.execPath, [cli, command, '--input', '-', '--json'], {
    cwd: root,
    input: JSON.stringify({ slug, overrideAccess: true, depth: 0, ...body }),
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  })
  if (child.error) throw child.error
  try {
    return JSON.parse(child.stdout)
  } catch {
    throw new Error(`Payload ${command} did not return JSON (exit ${child.status}). Check the target configuration and migrations.`)
  }
}

function sourceKey(source) {
  return createHash('sha256').update(source).digest('hex')
}

function readSeed(file) {
  const seed = JSON.parse(readFileSync(file, 'utf8'))
  if (!Array.isArray(seed)) throw new Error('The seed file must contain an array.')
  const rows = new Map()
  for (const [index, row] of seed.entries()) {
    const { source, english } = row ?? {}
    if (typeof source !== 'string' || !source.trim() || typeof english !== 'string' || !english.trim()) {
      throw new Error(`Seed row ${index + 1} requires nonempty source and english strings.`)
    }
    const key = sourceKey(source)
    const previous = rows.get(key)
    if (previous && (previous.source !== source || previous.english !== english)) {
      throw new Error(`Seed row ${index + 1} conflicts with an earlier translation for the same source.`)
    }
    rows.set(key, { source, english })
  }
  return rows
}

function findExistingKeys(keys) {
  const existing = new Set()
  for (let offset = 0; offset < keys.length; offset += lookupSize) {
    const batch = keys.slice(offset, offset + lookupSize)
    const { success, result } = runPayload('findDocuments', {
      limit: lookupSize,
      pagination: false,
      select: { sourceKey: true },
      where: { sourceKey: { in: batch } },
    })
    if (!success || !Array.isArray(result?.docs)) {
      throw new Error('Payload could not list translation keys. Check the target configuration and migrations.')
    }
    for (const { sourceKey } of result.docs) existing.add(sourceKey)
  }
  return existing
}

try {
  const { values } = parseArgs({
    options: {
      apply: { type: 'boolean', default: false },
      file: { type: 'string', default: defaultFile },
    },
  })
  const seed = readSeed(values.file)
  const existing = findExistingKeys([...seed.keys()])
  const missing = [...seed].filter(([key]) => !existing.has(key))
  console.log(`${seed.size} seed translations, ${seed.size - missing.length} already present, ${missing.length} missing.`)
  if (values.apply && missing.length) {
    for (let offset = 0; offset < missing.length; offset += batchSize) {
      const batch = missing.slice(offset, offset + batchSize)
      const { success, result } = runPayload('createDocuments', {
        documents: batch.map(([, data]) => ({ data })),
        returning: false,
      })
      if (!success || result?.docs?.length !== batch.length) {
        const current = findExistingKeys(batch.map(([key]) => key))
        const failed = batch.filter(([key]) => !current.has(key))
        if (failed.length) {
          const issues = (result?.errors ?? []).map(({ index, message }) => `row ${offset + index + 1}: ${message}`)
          throw new Error(`${failed.length} translations were not created in the current batch.${issues.length ? ` ${issues.join(' ')}` : ''}`)
        }
      }
    }
    const verified = findExistingKeys(missing.map(([key]) => key))
    const remaining = missing.filter(([key]) => !verified.has(key)).length
    if (remaining) throw new Error(`${remaining} translations are missing after import.`)
    console.log(`Verified ${missing.length} newly imported translations. Existing entries were preserved.`)
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
