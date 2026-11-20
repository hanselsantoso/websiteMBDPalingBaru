# Arus Digital self-hosted target

This isolated target was approved on 20 November 2026. The source Make project at F:/laragon/www/WEB-MBD-FIX remains unchanged. Follow the approved design and implementation plan in docs/superpowers.

- Use Next.js and Payload in one application. Configure public Payload packages here; never patch or inspect Figma package internals.
- Preserve the 32 collections, four globals, domain relationships, string document IDs, public URLs and private PMB documents.
- No public signup. Use official Payload admin authentication, not custom password/session code.
- Read the available payload-framework skill. Before schema/access/data changes, find the required payload-data-modeling/content/auth instructions; report unavailable tooling and do not invent source data mutation paths.
- Source data export/import requires authorized official tooling. Never copy platform secrets, SSO sessions or private exports into Git.
- Keep secrets server-side and outside commits/logs. No dummy values to bypass runtime requirements.
- Use the versions in .mise.toml and pnpm. Run targeted checks then the relevant suite before completion claims.
- All user-facing mutations validate and allowlist fields server-side. Apply collection/field access, authenticated user context, and overrideAccess: false.
- Keep frontend under src/app/(frontend). Target admin/API integration may be generated using the official Payload version; never edit source Make managed routes.
- CMS images remain Media relationships; CMS assets take priority over the two authorized local mascot fallbacks.
- Existing data changes that delete/rename fields, alter types/cardinality or add required/unique constraints need impact review before mutation.
- Keep Verify production delivery pending until production build, route classification, all generated routes, integration flows and fresh content edits have real evidence.
- Follow Native execution with a final independent reviewer. Record progress and rulings in this plan's .superpowers ledger.
