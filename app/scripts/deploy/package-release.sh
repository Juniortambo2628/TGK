#!/usr/bin/env bash
# Package a production release tarball for cPanel deploy (runs in CI).
# Excludes secrets, dev deps, and git metadata.

set -euo pipefail

OUT_DIR="${1:-dist}"
RELEASE_ID="${2:-$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)}"
STAGE="$OUT_DIR/stage"
ARCHIVE="$OUT_DIR/release-$RELEASE_ID.tar.gz"

rm -rf "$STAGE"
mkdir -p "$STAGE" "$OUT_DIR"

# Copy application (no vendor/node_modules — CI installs vendor into stage)
tar \
  --exclude='./.git' \
  --exclude='./node_modules' \
  --exclude='./vendor' \
  --exclude='./dist' \
  --exclude='./.env' \
  --exclude='./.env.*' \
  --exclude='./.env.production' \
  --exclude='./github-actions-*' \
  --exclude='./storage/*.key' \
  --exclude='./storage/framework/sessions/*' \
  --exclude='./storage/framework/cache/*' \
  --exclude='./storage/framework/views/*' \
  --exclude='./storage/logs/*' \
  --exclude='./public/hot' \
  --exclude='./bootstrap/ssr' \
  --exclude='./.phpunit.cache' \
  --exclude='./.idea' \
  --exclude='./.vscode' \
  --exclude='./tests' \
  --exclude='./phpunit.xml' \
  --exclude='./.phpunit.result.cache' \
  -cf - . | tar -xf - -C "$STAGE"

# Ship production .env template as .env so server has one if none exists yet.
# Server deploy script prefers existing $CORE_DIR/.env over this.
if [[ -f .env.production ]]; then
  cp .env.production "$STAGE/.env"
fi

# Composer production install into stage
if [[ ! -d "$STAGE/vendor" ]]; then
  echo "Installing production composer deps…"
  composer install --working-dir="$STAGE" --no-dev --optimize-autoloader --no-interaction --prefer-dist
fi

# Ship built assets from CI (public/build already produced by npm run build)
if [[ -d public/build ]]; then
  mkdir -p "$STAGE/public/build"
  cp -a public/build/. "$STAGE/public/build/"
fi

# Ensure storage skeleton exists in archive
mkdir -p "$STAGE/storage/framework/"{cache,sessions,views} \
         "$STAGE/storage/app/"{public,private} \
         "$STAGE/storage/logs" \
         "$STAGE/bootstrap/cache"

# Deploy script for server
mkdir -p "$STAGE/scripts/deploy"
cp scripts/deploy/server-deploy.sh "$STAGE/scripts/deploy/server-deploy.sh"
chmod +x "$STAGE/scripts/deploy/server-deploy.sh"

# Never ship SSH keys or private keys
find "$STAGE" -type f \( -name 'github-actions-*' -o -name 'id_rsa*' -o -name 'id_ed25519*' -o -name '*.pem' \) -delete 2>/dev/null || true

tar -czf "$ARCHIVE" -C "$STAGE" .
echo "Created $ARCHIVE ($(du -h "$ARCHIVE" | cut -f1))"

# Basic sanity
LISTING="$(mktemp)"
trap 'rm -f "$LISTING"' EXIT
tar -tzf "$ARCHIVE" > "$LISTING"
grep -q 'artisan' "$LISTING" || { echo "ERROR: archive missing artisan"; exit 1; }
grep -q 'public/build/manifest.json' "$LISTING" || { echo "ERROR: archive missing public/build/manifest.json"; exit 1; }
grep -q 'vendor/autoload.php' "$LISTING" || { echo "ERROR: archive missing vendor/autoload.php"; exit 1; }

echo "ARCHIVE_PATH=$ARCHIVE" >> "${GITHUB_OUTPUT:-/dev/null}"
