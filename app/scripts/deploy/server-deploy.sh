#!/usr/bin/env bash
# Server-side deploy for cPanel shared hosting (no rsync).
# Invoked over SSH after the CI artifact has been SCP'd to $UPLOAD_PATH.
#
# Environment (passed by GitHub Actions):
#   RELEASE_ARCHIVE  absolute path to uploaded .tar.gz
#   CORE_DIR         /home/goodmshd/TGK-core
#   PUBLIC_DIR       /home/goodmshd/TGK-public
#   RELEASE_ID       short git sha
#   KEEP_RELEASES    how many old releases to retain (default 3)

set -euo pipefail

RELEASE_ARCHIVE="${RELEASE_ARCHIVE:?RELEASE_ARCHIVE required}"
CORE_DIR="${CORE_DIR:-$HOME/TGK-core}"
PUBLIC_DIR="${PUBLIC_DIR:-$HOME/TGK-public}"
RELEASE_ID="${RELEASE_ID:-$(date +%Y%m%d%H%M%S)}"
KEEP_RELEASES="${KEEP_RELEASES:-3}"
RELEASES_DIR="$CORE_DIR/releases"
NEW_RELEASE="$RELEASES_DIR/$RELEASE_ID"
PHP_BIN="${PHP_BIN:-php}"

log() { printf '[deploy] %s\n' "$*"; }

log "Starting release $RELEASE_ID"
log "Core:   $CORE_DIR"
log "Public: $PUBLIC_DIR"
log "PHP:    $($PHP_BIN -v | head -n1)"

# ---------------------------------------------------------------------------
# 1. Requirements checklist
# ---------------------------------------------------------------------------
log "Checking requirements…"
command -v "$PHP_BIN" >/dev/null 2>&1 || { echo "ERROR: php CLI not found"; exit 1; }

PHP_MODULES="$("$PHP_BIN" -m)"
for ext in pdo_mysql mbstring openssl tokenizer xml ctype json curl fileinfo; do
  if ! grep -qi "^${ext}$" <<< "$PHP_MODULES"; then
    echo "ERROR: missing PHP extension: $ext"
    exit 1
  fi
done
log "PHP extensions OK"

if ! "$PHP_BIN" -r 'exit(version_compare(PHP_VERSION, "8.2.0", ">=") ? 0 : 1);'; then
  echo "ERROR: PHP >= 8.2 required, found $($PHP_BIN -r 'echo PHP_VERSION;')"
  exit 1
fi

# ---------------------------------------------------------------------------
# 2. Directories
# ---------------------------------------------------------------------------
mkdir -p "$RELEASES_DIR" "$CORE_DIR" "$PUBLIC_DIR"
mkdir -p "$CORE_DIR/storage/framework/"{cache,sessions,views} \
         "$CORE_DIR/storage/app/"{public,private} \
         "$CORE_DIR/bootstrap/cache" \
         "$PUBLIC_DIR"

# ---------------------------------------------------------------------------
# 3. Extract release
# ---------------------------------------------------------------------------
log "Extracting $RELEASE_ARCHIVE → $NEW_RELEASE"
mkdir -p "$NEW_RELEASE"
tar -xzf "$RELEASE_ARCHIVE" -C "$NEW_RELEASE"

if [[ ! -f "$NEW_RELEASE/artisan" ]]; then
  echo "ERROR: artisan not found in release — bad archive?"
  ls -la "$NEW_RELEASE" | head
  exit 1
fi

# ---------------------------------------------------------------------------
# 4. Preserve server-only secrets
# ---------------------------------------------------------------------------
if [[ -f "$CORE_DIR/.env" ]]; then
  log "Preserving existing .env"
  cp -a "$CORE_DIR/.env" "$NEW_RELEASE/.env"
elif [[ -f "$NEW_RELEASE/.env" ]]; then
  log "Using .env shipped with release"
else
  echo "ERROR: no .env found (core or release). Aborting."
  exit 1
fi

# Preserve live storage uploads (media library etc.)
if [[ -d "$CORE_DIR/storage/app" ]]; then
  log "Syncing live storage/app into release"
  mkdir -p "$NEW_RELEASE/storage/app"
  # Copy existing files without deleting anything new in release
  cp -a "$CORE_DIR/storage/app/." "$NEW_RELEASE/storage/app/" 2>/dev/null || true
fi

# ---------------------------------------------------------------------------
# 5. Vendor: prefer release vendor; else composer install
# ---------------------------------------------------------------------------
if [[ ! -d "$NEW_RELEASE/vendor" ]]; then
  log "vendor/ missing from release — running composer install"
  if command -v composer >/dev/null 2>&1; then
    (cd "$NEW_RELEASE" && composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist)
  elif "$PHP_BIN" -r "exit(strpos(file_get_contents('phar://'.getenv('HOME').'/.composer/vendor/bin/composer'),'x')?0:1);" 2>/dev/null; then
    (cd "$NEW_RELEASE" && "$PHP_BIN" "$HOME/.composer/vendor/bin/composer" install --no-dev --optimize-autoloader --no-interaction)
  else
    echo "ERROR: vendor/ missing and composer not available on server."
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# 6. Node assets — only if public/build missing (CI usually ships them)
# ---------------------------------------------------------------------------
if [[ ! -d "$NEW_RELEASE/public/build" ]]; then
  log "public/build missing — attempting npm ci && npm run build"
  if command -v npm >/dev/null 2>&1; then
    (cd "$NEW_RELEASE" && npm ci --omit=dev 2>/dev/null || npm install --omit=dev)
    (cd "$NEW_RELEASE" && npm run build)
  else
    echo "ERROR: public/build missing and npm not available. CI must ship assets."
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# 7. Permissions
# ---------------------------------------------------------------------------
log "Setting permissions…"
chmod -R u+rwX,g+rX "$NEW_RELEASE" || true
chmod -R 775 "$NEW_RELEASE/storage" "$NEW_RELEASE/bootstrap/cache" 2>/dev/null || true
# Document root must be readable by the web user; storage public needs write
chmod -R 775 "$NEW_RELEASE/storage/app" 2>/dev/null || true
find "$NEW_RELEASE/storage" -type d -exec chmod 775 {} + 2>/dev/null || true
find "$NEW_RELEASE/storage" -type f -exec chmod 664 {} + 2>/dev/null || true

# ---------------------------------------------------------------------------
# 8. Switch CORE_DIR → new release (atomic-ish)
# ---------------------------------------------------------------------------
log "Switching $CORE_DIR → release $RELEASE_ID"
# Keep a .env and storage already merged above; swap code dirs
for item in app bootstrap config database public resources routes scripts tests \
            artisan composer.json composer.lock package.json package-lock.json \
            vite.config.js phpunit.xml .env.example .env.production.example; do
  if [[ -e "$NEW_RELEASE/$item" ]]; then
    rm -rf "$CORE_DIR/$item"
    cp -a "$NEW_RELEASE/$item" "$CORE_DIR/$item"
  fi
done

# vendor + public/build (large) — replace fully
rm -rf "$CORE_DIR/vendor" "$CORE_DIR/public/build"
cp -a "$NEW_RELEASE/vendor" "$CORE_DIR/vendor"
cp -a "$NEW_RELEASE/public/build" "$CORE_DIR/public/build"
# bootstrap/ssr optional
if [[ -d "$NEW_RELEASE/bootstrap/ssr" ]]; then
  rm -rf "$CORE_DIR/bootstrap/ssr"
  cp -a "$NEW_RELEASE/bootstrap/ssr" "$CORE_DIR/bootstrap/ssr"
fi

# Ensure .env in core
if [[ ! -f "$CORE_DIR/.env" ]]; then
  cp -a "$NEW_RELEASE/.env" "$CORE_DIR/.env"
fi

# Storage dirs
mkdir -p "$CORE_DIR/storage/framework/"{cache,sessions,views} \
         "$CORE_DIR/storage/app/"{public,private} \
         "$CORE_DIR/bootstrap/cache"
chmod -R 775 "$CORE_DIR/storage" "$CORE_DIR/bootstrap/cache" 2>/dev/null || true

# ---------------------------------------------------------------------------
# 9. Public document root (TGK-public)
# ---------------------------------------------------------------------------
log "Syncing document root $PUBLIC_DIR"
cp -a "$CORE_DIR/public/index.php" "$PUBLIC_DIR/index.php"
cp -a "$CORE_DIR/public/.htaccess" "$PUBLIC_DIR/.htaccess" 2>/dev/null || true

# Static assets from Laravel public/ → docroot
# (build, images, css, js, favicon, robots.txt, storage link, etc.)
if [[ -d "$CORE_DIR/public/build" ]]; then
  rm -rf "$PUBLIC_DIR/build"
  cp -a "$CORE_DIR/public/build" "$PUBLIC_DIR/build"
fi
# Copy remaining public files/dirs except index.php/.htaccess handled above
(
  cd "$CORE_DIR/public"
  find . -mindepth 1 -maxdepth 1 ! -name index.php ! -name .htaccess ! -name build | while read -r entry; do
    base=$(basename "$entry")
    if [[ -L "$entry" ]]; then
      target=$(readlink "$entry")
      # Recreate symlink relative to core storage
      rm -rf "$PUBLIC_DIR/$base"
      ln -sfn "$target" "$PUBLIC_DIR/$base" || true
    elif [[ -d "$entry" ]]; then
      rm -rf "$PUBLIC_DIR/$base"
      cp -a "$entry" "$PUBLIC_DIR/$base"
    else
      cp -a "$entry" "$PUBLIC_DIR/$base"
    fi
  done
)

# storage: → docroot /storage must resolve to core storage/app/public
rm -rf "$PUBLIC_DIR/storage"
mkdir -p "$CORE_DIR/storage/app/public"
ln -sfn "$CORE_DIR/storage/app/public" "$PUBLIC_DIR/storage"
chmod 775 "$CORE_DIR/storage/app/public" 2>/dev/null || true

# ---------------------------------------------------------------------------
# 10. Laravel optimize + migrations
# ---------------------------------------------------------------------------
log "Running artisan…"
cd "$CORE_DIR"

# DB may need migrate; fail soft if migrate not allowed (then warn)
"$PHP_BIN" artisan config:clear || true
"$PHP_BIN" artisan route:clear || true
"$PHP_BIN" artisan view:clear || true
"$PHP_BIN" artisan cache:clear || true

if "$PHP_BIN" artisan migrate --force --no-interaction; then
  log "Migrations OK"
else
  echo "WARNING: migrate failed (check DB credentials / privileges). Continuing…"
fi

"$PHP_BIN" artisan storage:link --force 2>/dev/null || true
"$PHP_BIN" artisan config:cache
"$PHP_BIN" artisan route:cache
"$PHP_BIN" artisan view:cache
"$PHP_BIN" artisan event:cache 2>/dev/null || true

# ---------------------------------------------------------------------------
# 11. Cleanup old releases (SCP/tar replacement for rsync prune)
# ---------------------------------------------------------------------------
log "Cleaning old releases (keep $KEEP_RELEASES)…"
if [[ -d "$RELEASES_DIR" ]]; then
  # shellcheck disable=SC2012
  ls -1dt "$RELEASES_DIR"/*/ 2>/dev/null | tail -n +"$((KEEP_RELEASES + 1))" | while read -r old; do
    log "Removing $old"
    rm -rf "$old"
  done
fi

# Remove stray upload archive
rm -f "$RELEASE_ARCHIVE"

# ---------------------------------------------------------------------------
# 12. Post-deploy confirmation
# ---------------------------------------------------------------------------
log "Verifying expected structure…"
fail=0
require_path() {
  if [[ ! -e "$1" ]]; then
    echo "MISSING: $1"
    fail=1
  else
    echo "OK: $1"
  fi
}

require_path "$CORE_DIR/artisan"
require_path "$CORE_DIR/.env"
require_path "$CORE_DIR/vendor/autoload.php"
require_path "$CORE_DIR/public/build/manifest.json"
require_path "$CORE_DIR/bootstrap/app.php"
require_path "$CORE_DIR/storage/framework"
require_path "$CORE_DIR/bootstrap/cache/config.php"
require_path "$PUBLIC_DIR/index.php"
require_path "$PUBLIC_DIR/.htaccess"
require_path "$PUBLIC_DIR/build/manifest.json"
require_path "$PUBLIC_DIR/storage"

# index.php must point at core
if ! grep -q "$CORE_DIR" "$PUBLIC_DIR/index.php"; then
  echo "ERROR: $PUBLIC_DIR/index.php does not reference $CORE_DIR"
  fail=1
fi

# storage symlink target
if [[ -d "$PUBLIC_DIR/storage" ]]; then
  echo "OK: storage present in docroot"
fi

if [[ "$fail" -ne 0 ]]; then
  echo "ERROR: structure verification failed"
  exit 1
fi

log "Deploy complete: $RELEASE_ID"
log "Releases retained: $(ls -1d "$RELEASES_DIR"/*/ 2>/dev/null | wc -l)"
exit 0
