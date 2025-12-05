#!/bin/sh
set -e

if [ "$NODE_ENV" = "production" ]; then
  echo "Environment: PRODUCTION"

  echo "Waiting for database..."
  while ! nc -z -w 1 "${DB_HOST:-db}" "${DB_PORT:-5432}"; do
    sleep 0.2
  done
  echo "Database started"

  echo "Waiting for Redis..."
  while ! nc -z -w 1 "${REDIS_HOST:-redis}" "${REDIS_PORT:-6379}"; do
    sleep 0.2
  done
  echo "Redis started"

fi

  echo "Running Prisma migrations..."
  npx prisma migrate deploy

  echo "Generating Prisma Client..."
  npx prisma generate

  echo "Starting backend..."
  exec "$@"