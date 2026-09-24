#!/usr/bin/env bash
# Assemble the document-root tree (TGK-public) from the release stage.
# Replaces Laravel's index.php with the split-layout entry that boots
# /home/goodmshd/TGK-core.

set -euo pipefail

STAGE="${1:-dist/stage}"
OUT="${2:-dist/public-docroot}"

rm -rf "$OUT"
mkdir -p "$OUT"

cp -a "$STAGE/public/." "$OUT/"
cp -f scripts/deploy/public-index.php "$OUT/index.php"

# Never ship a local storage symlink placeholder from the build machine
rm -rf "$OUT/storage" "$OUT/hot"

# Sanity
[[ -f "$OUT/index.php" ]] || { echo "ERROR: missing index.php"; exit 1; }
[[ -f "$OUT/.htaccess" ]] || { echo "ERROR: missing .htaccess"; exit 1; }
[[ -f "$OUT/build/manifest.json" ]] || { echo "ERROR: missing build/manifest.json"; exit 1; }
grep -q 'TGK-core' "$OUT/index.php" || { echo "ERROR: index.php does not point at TGK-core"; exit 1; }

echo "Public docroot ready: $OUT"
