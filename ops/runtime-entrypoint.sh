#!/bin/sh
set -eu

# Compose file-backed secrets keep their host permissions. Resolve them at
# startup, before handing control to the unprivileged application user.
if [ -n "${PAYLOAD_SECRET_FILE:-}" ]; then
  PAYLOAD_SECRET=$(cat "$PAYLOAD_SECRET_FILE")
  export PAYLOAD_SECRET
  unset PAYLOAD_SECRET_FILE
fi
if [ -n "${DATABASE_URL_FILE:-}" ]; then
  DATABASE_URL=$(cat "$DATABASE_URL_FILE")
  export DATABASE_URL
  unset DATABASE_URL_FILE
fi

# Named volumes may have been initialized by a previous tooling image.
chown node:node /app/.local-data/media /app/.local-data/pmb-documents
exec gosu node "$@"
