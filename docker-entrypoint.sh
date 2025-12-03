#!/bin/sh
set -e

echo "Waiting for database..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.1
done
echo "Database started"

echo "Running Prisma migrations..."
npx prisma migrate deploy
npx prisma generate

echo "Starting backend..."
exec "$@"
