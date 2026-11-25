# syntax=docker/dockerfile:1.7
FROM node:24.22.3-bookworm-slim AS tooling
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@10.34.3 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN install -d -o node -g node /app/.local-data/media /app/.local-data/pmb-documents

FROM tooling AS build
ARG NEXT_PUBLIC_SITE_URL
ARG PMB_MAX_DOCUMENT_MB=2
ARG CONTENT_REVISION
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV PMB_MAX_DOCUMENT_MB=$PMB_MAX_DOCUMENT_MB
# A real populated staging database is needed for static content generation.
# BuildKit secret mounts are not stored in the resulting image.
RUN --mount=type=secret,id=payload_secret,required=true \
    --mount=type=secret,id=build_database_url,required=true \
    test -n "$CONTENT_REVISION" && PAYLOAD_SECRET_FILE=/run/secrets/payload_secret \
    DATABASE_URL_FILE=/run/secrets/build_database_url pnpm build

FROM node:24.22.3-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
RUN apt-get update && apt-get install -y --no-install-recommends gosu \
    && rm -rf /var/lib/apt/lists/* \
    && install -d -o node -g node /app/.local-data/media /app/.local-data/pmb-documents
COPY ops/runtime-entrypoint.sh /usr/local/bin/arus-entrypoint
RUN chmod 0755 /usr/local/bin/arus-entrypoint
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/arus-entrypoint"]
CMD ["node", "server.js"]
