#!/usr/bin/env bash
# =============================================================================
# Server-side deploy for cPanel shared hosting over SSH (no rsync available).
#
# GitHub Actions SCPs a release tarball to the server, then runs this script
# over SSH. It performs a full, idempotent deploy:
#   requirement checks -> extract -> preserve secrets/uploads -> app key ->
#   dependencies -> permissions -> code swap (stale-file cleanup) ->
#   docroot mirror -> storage symlink -> migrations -> optimize caches ->
#   prune old releases -> structure verification.
#
# Because rsync is not installed on this host, "delete stale files" is achieved
# by fully replacing code directories and mirroring the document root each run.
#
# Environment (exported by the deploy workflow before invoking):
#   RELEASE_ARCHIVE  absolute path to the uploaded .tar.gz            (required)
#   CORE_DIR         backend dir      (default: $HOME/TGK-core)
#   PUBLIC_DIR       document root    (default: $HOME/TGK-public)
#   RELEASE_ID       short git sha / timestamp
#   KEEP_RELEASES    number of release tarballs to retain (default: 3)
#   PHP_BIN          php binary to use (default: php; cPanel: ea-php83 etc.)
# =============================================================================

set -euo pipefail

RELEASE_ARCHIVE="${RELEASE_ARCHIVE:?RELEASE_ARCHIVE required}"
CORE_DIR="${CORE_DIR:-$HOME/TGK-core}"
PUBLIC_DIR="${PUBLIC_DIR:-$HOME/TGK-public}"
RELEASE_ID="${RELEASE_ID:-$(date +%Y%m%d%H%M%S)}"
KEEP_RELEASES="${KEEP_RELEASES:-3}"
PHP_BIN="${PHP_BIN:-php}"

RELEASES_DIR="$CORE_DIR/releases"          # retained tarballs (rollback)
STAGING_DIR="$CORE_DIR/.deploy-$RELEASE_ID" # transient extract dir (same FS -> fast mv)

log()  { printf '[deploy] %s\n' "$*"; }
warn() { printf '[deploy][WARN] %s\n' "$*" >&2; }
die()  { printf '[deploy][ERROR] %s\n' "$*" >&2; exit 1; }

cleanup_staging() { rm -rf "$STAGING_DIR" 2>/dev/null || true; }
trap cleanup_staging EXIT

# Resolve a usable PHP binary (cPanel often ships several).
if ! command -v "$PHP_BIN" >/dev/null 2>&1; then
  for cand in ea-php83 ea-php82 /opt/cpanel/ea-php83/root/usr/bin/php \
              /opt/cpanel/ea-php82/root/usr/bin/php php8.3 php8.2 php; do
    if command -v "$cand" >/dev/null 2>&1; then PHP_BIN="$cand"; break; fi
  done
fi
command -v "$PHP_BIN" >/dev/null 2>&1 || die "no php CLI found (set PHP_BIN)"

log "Release:  $RELEASE_ID"
log "Core:     $CORE_DIR"
log "Public:   $PUBLIC_DIR"
log "PHP:      $("$PHP_BIN" -v | head -n1)"

# ---------------------------------------------------------------------------
# 1. Requirement checks (fail early, with actionable messages)
# ---------------------------------------------------------------------------
log "Checking requirements…"

"$PHP_BIN" -r 'exit(version_compare(PHP_VERSION, "8.2.0", ">=") ? 0 : 1);' \
  || die "PHP >= 8.2 required, found $("$PHP_BIN" -r 'echo PHP_VERSION;')"

PHP_MODULES="$("$PHP_BIN" -m)"
MISSING_EXT=()
for ext in pdo_mysql mbstring openssl tokenizer xml ctype json curl fileinfo dom; do
  grep -qi "^${ext}$" <<< "$PHP_MODULES" || MISSING_EXT+=("$ext")
done
if [[ ${#MISSING_EXT[@]} -gt 0 ]]; then
  die "missing PHP extensions: ${MISSING_EXT[*]} (enable them in cPanel → Select PHP Version)"
fi
command -v tar >/dev/null 2>&1 || die "tar not found on server"
log "PHP $("$PHP_BIN" -r 'echo PHP_VERSION;') + required extensions OK"

# ---------------------------------------------------------------------------
# 2. Directory skeleton (created if missing)
# ---------------------------------------------------------------------------
log "Ensuring directory skeleton…"
mkdir -p "$CORE_DIR" "$PUBLIC_DIR" "$RELEASES_DIR" \
         "$CORE_DIR/storage/framework/cache/data" \
         "$CORE_DIR/storage/framework/sessions" \
         "$CORE_DIR/storage/framework/views" \
         "$CORE_DIR/storage/app/public" \
         "$CORE_DIR/storage/app/private" \
         "$CORE_DIR/storage/logs" \
         "$CORE_DIR/bootstrap/cache"

# ---------------------------------------------------------------------------
# 3. Extract the uploaded release into a transient staging dir
# ---------------------------------------------------------------------------
log "Extracting release → $STAGING_DIR"
rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR"
tar -xzf "$RELEASE_ARCHIVE" -C "$STAGING_DIR"

[[ -f "$STAGING_DIR/artisan" ]]                     || die "artisan missing from release archive"
[[ -f "$STAGING_DIR/vendor/autoload.php" ]]         || die "vendor/autoload.php missing from release archive"
[[ -f "$STAGING_DIR/public/build/manifest.json" ]]  || die "public/build/manifest.json missing (frontend not built)"

# ---------------------------------------------------------------------------
# 4. Preserve server-only .env (never overwrite live credentials)
# ---------------------------------------------------------------------------
if [[ -f "$CORE_DIR/.env" ]]; then
  log "Preserving existing $CORE_DIR/.env"
  cp -a "$CORE_DIR/.env" "$STAGING_DIR/.env"
elif [[ -f "$STAGING_DIR/.env" ]]; then
  log "Bootstrapping .env from the one shipped in the release (PROD_ENV)"
elif [[ -f "$STAGING_DIR/.env.production.example" ]]; then
  warn "No .env found — seeding from .env.production.example. FILL IN DB/MAIL secrets!"
  cp -a "$STAGING_DIR/.env.production.example" "$STAGING_DIR/.env"
else
  die "no .env available (core, release, or example). Create $CORE_DIR/.env first."
fi

# ---------------------------------------------------------------------------
# 5. Swap code into CORE_DIR (this deletes stale code — rsync --delete stand-in)
#    Everything in the release replaces CORE_DIR, EXCEPT persistent .env/storage.
# ---------------------------------------------------------------------------
log "Swapping application code into $CORE_DIR…"
shopt -s dotglob nullglob
for src in "$STAGING_DIR"/*; do
  name="$(basename "$src")"
  case "$name" in
    .env|storage) continue ;;   # persistent — handled separately
  esac
  rm -rf "${CORE_DIR:?}/$name"
  mv "$src" "$CORE_DIR/$name"
done
shopt -u dotglob nullglob

# .env into place (staging copy holds preserved/bootstrapped value)
cp -a "$STAGING_DIR/.env" "$CORE_DIR/.env"

# storage: keep the live dir; only seed from release if it does not exist yet
if [[ -d "$STAGING_DIR/storage" && ! -d "$CORE_DIR/storage/framework" ]]; then
  cp -a "$STAGING_DIR/storage/." "$CORE_DIR/storage/"
fi
mkdir -p "$CORE_DIR/storage/framework/cache/data" \
         "$CORE_DIR/storage/framework/sessions" \
         "$CORE_DIR/storage/framework/views" \
         "$CORE_DIR/storage/app/public" \
         "$CORE_DIR/storage/app/private" \
         "$CORE_DIR/storage/logs" \
         "$CORE_DIR/bootstrap/cache"

# ---------------------------------------------------------------------------
# 6. Dependencies fallback (CI ships vendor + build; only act if missing)
# ---------------------------------------------------------------------------
if [[ ! -f "$CORE_DIR/vendor/autoload.php" ]]; then
  warn "vendor/ missing after swap — attempting composer install"
  if command -v composer >/dev/null 2>&1; then
    (cd "$CORE_DIR" && composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist)
  else
    die "vendor/ missing and composer not available on server"
  fi
fi

# ---------------------------------------------------------------------------
# 7. Application key (generate only if absent — never rotate a live key)
# ---------------------------------------------------------------------------
cd "$CORE_DIR"
if ! grep -qE '^APP_KEY=base64:.+' .env; then
  log "APP_KEY missing — generating one"
  "$PHP_BIN" artisan key:generate --force --no-interaction || warn "key:generate failed"
else
  log "APP_KEY present — left unchanged"
fi

# ---------------------------------------------------------------------------
# 8. Permissions
# ---------------------------------------------------------------------------
log "Setting permissions…"
chmod -R u+rwX,go+rX "$CORE_DIR" 2>/dev/null || true
find "$CORE_DIR/storage" "$CORE_DIR/bootstrap/cache" -type d -exec chmod 775 {} + 2>/dev/null || true
find "$CORE_DIR/storage" "$CORE_DIR/bootstrap/cache" -type f -exec chmod 664 {} + 2>/dev/null || true
chmod 600 "$CORE_DIR/.env" 2>/dev/null || true

# ---------------------------------------------------------------------------
# 9. Document root mirror (TGK-public) — wipe stale assets, keep /storage link
# ---------------------------------------------------------------------------
log "Mirroring document root $PUBLIC_DIR…"
# Remove everything in docroot except the storage symlink (stale-asset cleanup)
find "$PUBLIC_DIR" -mindepth 1 -maxdepth 1 ! -name storage -exec rm -rf {} + 2>/dev/null || true
# Copy Laravel's public/ into the docroot
cp -a "$CORE_DIR/public/." "$PUBLIC_DIR/"
# Replace the entry point with the split-layout index.php pointing at CORE_DIR
if [[ -f "$CORE_DIR/scripts/deploy/public-index.php" ]]; then
  sed "s|__CORE_PATH__|${CORE_DIR}|g" \
      "$CORE_DIR/scripts/deploy/public-index.php" > "$PUBLIC_DIR/index.php"
else
  die "scripts/deploy/public-index.php template missing from release"
fi
# A local public/storage placeholder must never shadow the real symlink
rm -rf "$PUBLIC_DIR/hot"

# ---------------------------------------------------------------------------
# 10. Public storage symlink (/storage → core storage/app/public)
# ---------------------------------------------------------------------------
log "Ensuring /storage symlink…"
if [[ -L "$PUBLIC_DIR/storage" ]]; then
  current_target="$(readlink -f "$PUBLIC_DIR/storage" 2>/dev/null || true)"
  want_target="$(readlink -f "$CORE_DIR/storage/app/public" 2>/dev/null || true)"
  if [[ "$current_target" != "$want_target" ]]; then
    rm -f "$PUBLIC_DIR/storage"
    ln -sfn "$CORE_DIR/storage/app/public" "$PUBLIC_DIR/storage"
  fi
elif [[ -e "$PUBLIC_DIR/storage" ]]; then
  # A real directory is squatting the symlink path — move it aside then link
  rm -rf "$PUBLIC_DIR/storage"
  ln -sfn "$CORE_DIR/storage/app/public" "$PUBLIC_DIR/storage"
else
  ln -sfn "$CORE_DIR/storage/app/public" "$PUBLIC_DIR/storage"
fi
chmod 775 "$CORE_DIR/storage/app/public" 2>/dev/null || true

# ---------------------------------------------------------------------------
# 11. Laravel: clear caches, run migrations, rebuild caches
# ---------------------------------------------------------------------------
log "Clearing caches…"
for c in config route view cache; do "$PHP_BIN" artisan "$c:clear" >/dev/null 2>&1 || true; done

log "Running migrations…"
MIG_STATE="$("$PHP_BIN" artisan tinker --execute="try { echo Schema::hasTable('migrations') ? DB::table('migrations')->count() : 0; } catch (\Throwable \$e) { echo 'ERR'; }" 2>/dev/null | tr -d '[:space:]')"
case "$MIG_STATE" in
  ERR|"")
    warn "Database unreachable (check DB_* in .env). Skipping migrations." ;;
  0)
    log "Empty schema — bootstrapping with migrate:fresh"
    "$PHP_BIN" artisan migrate:fresh --force --no-interaction || warn "migrate:fresh failed" ;;
  *)
    "$PHP_BIN" artisan migrate --force --no-interaction || warn "migrate failed" ;;
esac

log "Building production caches…"
"$PHP_BIN" artisan storage:link --force >/dev/null 2>&1 || true
"$PHP_BIN" artisan config:cache
"$PHP_BIN" artisan route:cache
"$PHP_BIN" artisan view:cache
"$PHP_BIN" artisan event:cache 2>/dev/null || true

# ---------------------------------------------------------------------------
# 12. Retain release tarball for rollback; prune old ones
# ---------------------------------------------------------------------------
log "Archiving release tarball for rollback (keep $KEEP_RELEASES)…"
cp -a "$RELEASE_ARCHIVE" "$RELEASES_DIR/release-$RELEASE_ID.tar.gz" 2>/dev/null || true
# shellcheck disable=SC2012
ls -1dt "$RELEASES_DIR"/release-*.tar.gz 2>/dev/null | tail -n +"$((KEEP_RELEASES + 1))" | while read -r old; do
  log "Pruning old release $(basename "$old")"
  rm -f "$old"
done
rm -f "$RELEASE_ARCHIVE"

# ---------------------------------------------------------------------------
# 13. Structure verification
# ---------------------------------------------------------------------------
log "Verifying expected structure…"
fail=0
require() { if [[ -e "$1" ]]; then echo "  OK   $1"; else echo "  MISS $1"; fail=1; fi; }

require "$CORE_DIR/artisan"
require "$CORE_DIR/.env"
require "$CORE_DIR/vendor/autoload.php"
require "$CORE_DIR/bootstrap/app.php"
require "$CORE_DIR/bootstrap/cache/config.php"
require "$CORE_DIR/public/build/manifest.json"
require "$CORE_DIR/storage/framework"
require "$PUBLIC_DIR/index.php"
require "$PUBLIC_DIR/.htaccess"
require "$PUBLIC_DIR/build/manifest.json"

# index.php must boot CORE_DIR
grep -q "$CORE_DIR" "$PUBLIC_DIR/index.php" \
  || { echo "  FAIL $PUBLIC_DIR/index.php does not reference $CORE_DIR"; fail=1; }

# /storage must be a symlink to the core public storage
if [[ -L "$PUBLIC_DIR/storage" ]]; then
  echo "  OK   $PUBLIC_DIR/storage -> $(readlink "$PUBLIC_DIR/storage")"
else
  echo "  FAIL $PUBLIC_DIR/storage is not a symlink"; fail=1
fi

[[ "$fail" -eq 0 ]] || die "structure verification failed"

log "Deploy complete: release $RELEASE_ID"
log "Rollback tarballs: $(ls -1 "$RELEASES_DIR"/release-*.tar.gz 2>/dev/null | wc -l | tr -d ' ')"
exit 0
