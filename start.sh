#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL no está definida"
  exit 1
fi

echo "DATABASE_URL detectada"
pnpm prisma migrate deploy
node server.js