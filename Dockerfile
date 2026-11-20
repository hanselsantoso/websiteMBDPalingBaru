# syntax=docker/dockerfile:1.7
FROM node:24.22.3-bookworm-slim AS tooling
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@10.34.3 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

FROM tooling AS build
ARG NEXT_PUBLIC_SITE_URL
ARG PMB_MAX_DOCUMENT_MB=2
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV PMB_MAX_DOCUMENT_MB=$PMB_MAX_DOCUMENT_MB
# A real populated staging database is needed for static content generation.
# BuildKit secret mounts are not stored in the resulting image.
RUN --mount=type=secret,id=payload_secret,required=true \
    --mount=type=secret,id=build_database_url,required=true \
    PAYLOAD_SECRET_FILE=/run/secrets/payload_secret \
    DATABASE_URL_FILE=/run/secrets/build_database_url pnpm build

FROM node:24.22.3-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
RUN mkdir -p /app/.local-data/media /app/.local-data/pmb-documents && chown -R node:node /app/.local-data
USER node
EXPOSE 3000
CMD ["node", "server.js"]
