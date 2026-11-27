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
