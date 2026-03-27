#!/bin/sh
set -e

echo "Applying Prisma migrations..."
pnpm prisma migrate deploy

echo "Starting Next.js..."
node server.js