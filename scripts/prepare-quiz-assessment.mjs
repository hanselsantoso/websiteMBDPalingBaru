import { readFileSync } from 'node:fs'

const rubric = JSON.parse(readFileSync(new URL('../seed/quiz-kemampuan-mbd-v1.json', import.meta.url), 'utf8'))
const documents = rubric.map(({ code, text, options }, index) => ({
  data: {
    text,
    helpText: `Asesmen MBD v1 · ${code}`,
    options: options.map(({ label }) => ({ label })),
    isActive: true,
    sortOrder: index + 1,
  },
}))
const slug = 'quiz-questions'
const where = { helpText: { in: documents.map(({ data }) => data.helpText) } }

const command = process.argv[2]
if (command === 'findDocuments') {
  process.stdout.write(JSON.stringify({ slug, where, depth: 0, limit: documents.length + 1 }))
} else if (command === 'createDocuments') {
  process.stdout.write(JSON.stringify({ slug, documents }))
} else {
  console.error('Pilih findDocuments atau createDocuments.')
  process.exitCode = 1
}
