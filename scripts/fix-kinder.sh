#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
if [ -d "$ROOT/backend" ]; then
  BE="$ROOT/backend"
else
  echo "backend directory not found. Run in repo root."
  exit 1
fi

echo "[1/6] Backup original files"
TS=$(date +%Y%m%d-%H%M%S)
mkdir -p "$BE/.backup-$TS"
cp "$BE/prisma/schema.prisma" "$BE/.backup-$TS/schema.prisma.bak"
cp "$BE/package.json" "$BE/.backup-$TS/package.json.bak" || true

echo "[2/6] Prisma schema: String[] → Json for photos & interests"
SCHEMA="$BE/prisma/schema.prisma"

# Replace 'photos ... String[]' with 'photos ... Json' (allow variable whitespace)
sed -E -i 's/(^ *photos[[:space:]]+)[A-Za-z]+(\[\])/\1Json/g' "$SCHEMA"
# Replace 'interests ... String[]' with 'interests ... Json'
sed -E -i 's/(^ *interests[[:space:]]+)[A-Za-z]+(\[\])/\1Json/g' "$SCHEMA"

echo "[3/6] Install tsx (for ESM-friendly dev)"
cd "$BE"
npm pkg set scripts.dev="tsx watch src/server.ts" >/dev/null 2>&1 || true
npm install -D tsx

echo "[4/6] Prisma generate & migrate"
npx prisma generate
npx prisma migrate dev --name fix_arrays --create-only
# Apply the migration to dev DB for local runs
npx prisma migrate dev --name fix_arrays --skip-generate || true

echo "[5/6] Seed if available"
if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
  npx prisma db seed || true
else
  echo "(no seed file, skipping)"
fi

echo "[6/6] Done. Changes prepared for PR."
