# VPS compatibility evidence

Checked 20 November 2026 against the public npm registry. The exact source versions are available: Next.js 16.4.2, React 19.3.1, Payload 4.0.0-beta.7, TypeScript 6.0.3, Vitest 5.1.0. The PostgreSQL adapter 4.0.0-beta.7 declares Payload 4.0.0-beta.7 as its peer.

Payload requires Node >=24.22.1. The interactive shell provides Node 22.13.1, so target commands use mise with the existing pinned Node 24.22.1 and pnpm 10.34.3. A local official mise executable is checksum-verified and excluded from Git. No machine-wide shell profile or Node default is changed.

Package availability is not full integration proof. Database/storage/bootstrap, plugin compatibility and production build remain pending until exercised.

The source workspace had an invalid esbuild approval placeholder in pnpm-workspace.yaml. The target explicitly allows esbuild's required build step; package identity is unchanged.

## External prerequisites

- Docker is not installed/on PATH in the current execution environment.
- No live PostgreSQL service has been identified for this target.
- Payload data export/import tooling and the required data/auth modeling skills are not available in the current catalog. Source data mutations and gated schema/auth changes remain pending.
- VPS access, domain and email provider have not been supplied. Secret values must never be pasted into ordinary chat.

Registry references: https://registry.npmjs.org/next/16.4.2, https://registry.npmjs.org/payload/4.0.0-beta.7, https://registry.npmjs.org/@payloadcms%2fdb-postgres/4.0.0-beta.7.
