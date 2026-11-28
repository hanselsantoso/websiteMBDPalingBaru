# Seed data

Starter content for S1 Manajemen Bisnis Digital lives in Payload. Use the
project's Payload CLI (`pnpm exec payload …`) from the project root. On the
standalone target, complete the [local setup and migration](../docs/operations/deployment-preparation.md#persiapan-lingkungan-lokal)
before running content commands.

## Files

| File | What it holds | How it is applied |
| --- | --- | --- |
| `01-roles.json` | The six system roles (`super-admin`, `admin`, `editor`, `penulis`, `staf-pmb`, `staf-marketing`) with their permission matrices. | Ready-made `createDocuments` input for the `roles` collection. |
| `curriculum-2024.json` | Source of truth for **Kurikulum 2024**: the version document, 8 semester descriptions, the **38 courses (131 SKS)** and the `[ISI]` syllabus placeholders. | Reference data; converted into `createDocuments` inputs for `curriculum-versions` and `courses` (see below). |
| `quiz-kemampuan-mbd-v1.json` | 12 case prompts, choices, and a scoring rubric for four abilities. | Source for the assessment at `/kuis`. The CLI receives prompts and choices. The server applies the rubric after submission. |
| `pmb-guide.json` | One-time source snapshot for MBD 2027/2028. It includes admissions tracks, waves, required documents, fees, scholarship cards, FAQs, two blog tags and two sample articles from campus news. | Apply through the existing Payload collections and global below. |

`pnpm test` checks `curriculum-2024.json`: 38 courses, 131 SKS, credits per semester
18/19/21/19/21/20/7/6, the codes `BD009`, `BD007` and `BD603`, and Agama without a code.
Do not change codes or credits without confirmation from the study program.

## Rules

- **Idempotent:** read before writing. Look records up by a stable key and create only
  what is missing; never re-run a whole batch blindly.
- **No environment IDs:** IDs differ per environment. Resolve relationships at apply time
  by stable keys: role `key`, curriculum version `name`, course/page/post/faculty `slug`,
  admin `email`.
- **Placeholders stay literal:** unknown facts are stored as `[ISI]` or `[ISI: hint]`.
  The dashboard widget "Pelacak penanda [ISI]" lists every remaining placeholder.
- **Verify every write** with a fresh `countDocuments` or `findDocuments` call.

## Workflow

1. Check the database connection and applied migrations. The original Figma
   Make project used `figma make verify-bootstrap` to check its managed backend.
2. Discover the installed CLI contract: `pnpm exec payload --help` and
   `pnpm exec payload <operation> --help`.
3. Inspect the target schema, for example
   `pnpm exec payload getCollectionSchema --input '{"slug":"courses"}'`.

### Roles

```sh
pnpm exec payload findDocuments --input '{"slug":"roles","limit":20,"select":{"key":true}}'
# Create only the roles whose `key` is missing (trim 01-roles.json to those entries if needed):
pnpm exec payload createDocuments --input @seed/01-roles.json
pnpm exec payload countDocuments --input '{"slug":"roles"}'   # expect 6
```

Assign a role to an administrator by looking both up by stable keys
(`roles.key`, `admins.email`), then `updateDocument` the admin's `role` with the role ID
returned by that lookup.

### Kurikulum 2024

1. Check for the version: `findDocuments` on `curriculum-versions` where `name` equals
   `Kurikulum 2024`. If it is missing, create it from `version` in the JSON.
2. Read the version ID from that lookup. For each entry in `courses`, build a document
   from the course fields plus `syllabusPlaceholders`, with `version` set to that ID.
   Agama has no `code`; leave the field out so the admin shows `[ISI]`.
3. Before creating, list existing courses for the version
   (`findDocuments` with `where: { version: { equals: <id> } }`, `select: { slug: true }`)
   and create only the missing slugs.
4. Verify: `countDocuments` on `courses` returns 38, and the sum of `credits` from
   `findDocuments` (`select: { credits: true }`, `limit: 100`) is 131.

The public total is hidden by default: **Pengaturan situs → Fitur → Tampilkan total SKS
program di situs** (`features.showTotalSks`) stays off until the program confirms it.

### Kuis kemampuan MBD

Prepare the two CLI inputs in the target environment before building the site.

```sh
node scripts/prepare-quiz-assessment.mjs findDocuments > /tmp/quiz-find.json
node scripts/prepare-quiz-assessment.mjs createDocuments > /tmp/quiz-create.json
pnpm exec payload findDocuments --input @/tmp/quiz-find.json
```

Compare existing documents with the generated input by the `helpText` marker.
Keep only missing markers in `quiz-create.json` and run the create command if
there are missing entries. Run the find command again and confirm all 12
active documents have the expected prompts and choices.

```sh
pnpm exec payload createDocuments --input @/tmp/quiz-create.json
pnpm exec payload findDocuments --input @/tmp/quiz-find.json
```

Keep the marker, prompt and choices of each case aligned with its rubric.
Review changes as a new assessment version. An incomplete or mismatched set
shows the unavailable state. After a fresh build, open `/kuis?uji=1` and
finish a test attempt. Verify the four ability scores and all 12 explanations.

### PMB dan Blog MBD

The PMB snapshot was checked on 28 November 2026. The public admissions
announcement gives specific 2026 dates for Prestasi I and II. The academic
portal lists its monthly schedule under the same 2027/2028 intake with
different years. The page shows the announcement dates with a note. Leave
Reguler dates for the admissions team to confirm.

Use the installed Payload CLI or the Admin Panel for the initial import.
Match records by the identities below. Create missing rows and preserve
existing admissions relationships and newer edits. For the page, merge
matching blocks by their anchor and preserve unrelated blocks.

| Snapshot field | Payload Admin | Identity |
| --- | --- | --- |
| `tracks` | Penerimaan → Jalur PMB | Name |
| `waves` | Penerimaan → Gelombang PMB | Name |
| `settings` | Penerimaan → Pengaturan PMB | Global |
| `header`, `sections` | Konten → Halaman → PMB | Page slug and block anchors. Edit scholarship cards in Pilihan beasiswa. |
| `faq` | FAQ | Question with scope `pmb` |
| `blog.tags`, `blog.posts` | Konten → Tag blog and Blog | Slug. Assign the tag by its Payload ID. |

`sources` and each article's `source` record provenance for editing. They
are excluded from public page links. Convert the sample article paragraphs
to Payload Lexical content or paste them into the editor. Review drafts
before publishing on a live environment. Use the admin records for
subsequent updates. The website reads Payload on its existing cache and
invalidation lifecycle.

### Other starter content

Lecturer profiles (placeholders), blog categories and tags, FAQs, PMB waves and tracks,
message templates, quiz questions and results, career paths, programs, testimonials,
the system pages (`beranda`, `kurikulum`, `dosen`, `program`, `karier`, `blog`, `pmb`,
`kuis`, `kontak`, `kebijakan-privasi`, `syarat-ketentuan`, `halaman-404`) and three
starter articles were created with the same CLI and are now maintained in `/admin`.
To copy them to another environment, export with `findDocuments` (depth 0), replace
relationship IDs with stable keys, and re-create them following the rules above.

Review before launch: the starter article dates (11–13 November 2026), the unapproved
testimonials, and every `[ISI]` placeholder.
