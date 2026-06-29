#!/bin/sh
set -e

echo "Deploying Prisma database migrations..."
npx prisma migrate deploy

echo "Starting Next.js application..."
node server.js
