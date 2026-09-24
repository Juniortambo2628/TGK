#!/usr/bin/env bash
# Upload a prepared release stage to cPanel over FTP (no SSH required).
#
# Required env:
#   FTP_HOST  FTP_USER  FTP_PASS
# Optional env:
#   FTP_PORT        default 21
#   FTP_SSL         true|false (explicit FTPS / AUTH TLS), default false
#   FTP_CORE_DIR    default TGK-core   (path relative to FTP home; cPanel chroot)
#   FTP_PUBLIC_DIR  default TGK-public
#   STAGE_DIR       default dist/stage
#   PUBLIC_DIR_SRC  default dist/public-docroot
#
# Excludes keep server-only files (.env, live uploads, logs) from being
# overwritten or deleted by mirror --delete-after.

set -euo pipefail

FTP_HOST="${FTP_HOST:?FTP_HOST required}"
FTP_USER="${FTP_USER:?FTP_USER required}"
FTP_PASS="${FTP_PASS:?FTP_PASS required}"
FTP_PORT="${FTP_PORT:-21}"
FTP_SSL="${FTP_SSL:-false}"
FTP_CORE_DIR="${FTP_CORE_DIR:-TGK-core}"
FTP_PUBLIC_DIR="${FTP_PUBLIC_DIR:-TGK-public}"
STAGE_DIR="${STAGE_DIR:-dist/stage}"
PUBLIC_DIR_SRC="${PUBLIC_DIR_SRC:-dist/public-docroot}"

[[ -d "$STAGE_DIR" ]] || { echo "ERROR: stage dir missing: $STAGE_DIR"; exit 1; }
[[ -d "$PUBLIC_DIR_SRC" ]] || { echo "ERROR: public docroot missing: $PUBLIC_DIR_SRC"; exit 1; }
[[ -f "$STAGE_DIR/artisan" ]] || { echo "ERROR: stage is not a Laravel release"; exit 1; }
command -v lftp >/dev/null 2>&1 || { echo "ERROR: lftp not installed"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "ERROR: python3 not installed"; exit 1; }

log() { printf '[ftp-deploy] %s\n' "$*"; }

# URL-encode credentials for lftp open URL (avoids comma/colon password issues)
USER_ENC="$(printf '%s' "$FTP_USER" | python3 -c 'import sys,urllib.parse; print(urllib.parse.quote(sys.stdin.read(), safe=""))')"
PASS_ENC="$(printf '%s' "$FTP_PASS" | python3 -c 'import sys,urllib.parse; print(urllib.parse.quote(sys.stdin.read(), safe=""))')"
PROTO="ftp"
if [[ "$FTP_SSL" == "true" || "$FTP_SSL" == "1" ]]; then
  PROTO="ftps"
fi
URL="${PROTO}://${USER_ENC}:${PASS_ENC}@${FTP_HOST}:${FTP_PORT}"

CMDFILE="$(mktemp)"
trap 'rm -f "$CMDFILE"' EXIT

{
  echo 'set cmd:fail-exit yes'
  echo 'set net:max-retries 2'
  echo 'set net:timeout 45'
  echo 'set ftp:passive-mode true'
  echo 'set ftp:ssl-allow '"$FTP_SSL"
  if [[ "$PROTO" == "ftps" ]]; then
    echo 'set ftp:ssl-force true'
    echo 'set ssl:verify-certificate no'
  fi
  echo "open ${URL}"
  echo 'set cmd:fail-exit no'
  echo "mkdir -p ${FTP_CORE_DIR}"
  echo "mkdir -p ${FTP_PUBLIC_DIR}"
  echo 'set cmd:fail-exit yes'

  # Core: mirror stage, never touch live secrets/uploads/logs
  echo -n 'mirror -R --verbose --parallel=4 --delete-after'
  printf -- ' --exclude-glob .env'
  printf -- ' --exclude-glob .env.*'
  printf -- ' --exclude-glob storage/logs/*'
  printf -- ' --exclude-glob storage/framework/cache/*'
  printf -- ' --exclude-glob storage/framework/sessions/*'
  printf -- ' --exclude-glob storage/framework/views/*'
  printf -- ' --exclude-glob storage/app/public/uploads/*'
  printf -- ' --exclude-glob storage/app/private/*'
  printf -- ' --exclude-glob storage/*.key'
  printf -- ' --exclude-glob public/hot'
  printf -- ' --exclude-glob bootstrap/ssr/*'
  printf -- ' --exclude-glob node_modules/*'
  printf -- ' --exclude-glob .git/*'
  printf -- ' --exclude-glob github-actions-*'
  printf -- ' --exclude-glob *.pem'
  printf ' %s/ %s/\n' "$STAGE_DIR" "$FTP_CORE_DIR"

  # Public docroot: never wipe a live /storage symlink target via mirror
  echo -n 'mirror -R --verbose --parallel=4 --delete-after'
  printf -- ' --exclude-glob storage'
  printf -- ' --exclude-glob storage/*'
  printf -- ' --exclude-glob hot'
  printf ' %s/ %s/\n' "$PUBLIC_DIR_SRC" "$FTP_PUBLIC_DIR"

  echo 'bye'
} > "$CMDFILE"

log "Connecting ${FTP_USER}@${FTP_HOST}:${FTP_PORT} (${PROTO})"
log "Mirroring core  → ${FTP_CORE_DIR}/"
log "Mirroring public → ${FTP_PUBLIC_DIR}/"

if ! lftp -f "$CMDFILE"; then
  echo "ERROR: lftp transfer failed"
  exit 1
fi

# Bootstrap .env only if missing on server (never overwrite)
log "Checking remote .env …"
ENV_REMOTE="${FTP_CORE_DIR}/.env"
if curl --silent --show-error --fail --user "${FTP_USER}:${FTP_PASS}" \
    ${PROTO:+${FTP_SSL:+--ssl-reqd}} \
    "ftp://${FTP_HOST}:${FTP_PORT}/${ENV_REMOTE}" -o /tmp/remote-env-check 2>/dev/null; then
  log "Remote .env present — left untouched"
  rm -f /tmp/remote-env-check
else
  if [[ -f "$STAGE_DIR/.env" ]]; then
    log "Remote .env missing — uploading staged .env"
    curl --silent --show-error --fail \
      --user "${FTP_USER}:${FTP_PASS}" \
      $([ "$PROTO" = "ftps" ] && echo --ssl-reqd || true) \
      --ftp-create-dirs \
      -T "$STAGE_DIR/.env" \
      "ftp://${FTP_HOST}:${FTP_PORT}/${ENV_REMOTE}"
  else
    echo "WARNING: no remote .env and no staged .env — site will 500 until .env exists"
  fi
fi

log "FTP transfer complete"
