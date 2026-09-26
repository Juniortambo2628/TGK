# Production deployment — goodkenyan.org / goodkenyan.com (cPanel + SSH)

Automated deploy: **push to `main` → CI (tests + autofix) → SSH deploy to cPanel.**

- **Canonical domain:** `https://goodkenyan.org`
- **Second domain:** `goodkenyan.com` → **301-redirects** to `goodkenyan.org`
  (redirect lives in `public/.htaccess`, so it applies no matter how the vhosts
  are configured). Both domains share one document root.
- **Transport:** SSH (key-based). Port **22** is open on the new GoDaddy server and
  SSL is fixed. FTP is no longer used.
- **No rsync on the host** — stale-file cleanup is done by fully replacing code
  directories and mirroring the document root on every deploy.

---

## Server layout

| Role | Filesystem path |
|------|-----------------|
| Document root (both domains) | `/home/a040j9v5l2vz/TGK-public` |
| Laravel application (backend) | `/home/a040j9v5l2vz/TGK-core` |
| Public uploads (`/storage` URL) | `/home/a040j9v5l2vz/TGK-core/storage/app/public` → symlink `TGK-public/storage` |
| Rollback tarballs | `/home/a040j9v5l2vz/TGK-core/releases/release-<sha>.tar.gz` (last 3 kept) |

`TGK-public/index.php` is generated from `scripts/deploy/public-index.php` at
deploy time with the backend path substituted in, so it boots
`/home/a040j9v5l2vz/TGK-core`.

> These paths are the deploy script's defaults (`$HOME/TGK-core`, `$HOME/TGK-public`).
> Only set the `DEPLOY_CORE_DIR` / `DEPLOY_PUBLIC_DIR` secrets if you move them.

---

## The two workflows

### 1. `.github/workflows/ci.yml` — CI (test & autofix)
Runs on every push/PR to `main`:
- Composer + npm install
- **Laravel Pint** autofix, committed back as `style: … [skip ci]` (push events only)
- `npm run build` and assert `public/build/manifest.json` + SSR bundle
- `php artisan test` (PHPUnit, sqlite)

### 2. `.github/workflows/deploy.yml` — Deploy (cPanel SSH)
Triggered automatically **only when CI succeeds on `main`** (via `workflow_run`),
or manually from the Actions tab. It:
1. Checks out latest `main` (includes the Pint autofix commit)
2. Verifies required deploy secrets are present
3. `npm ci && npm run build` (fresh production assets)
4. Writes `.env.production` from the `PROD_ENV` secret (uploaded only if the
   server has no `.env` yet — a live `.env` is never overwritten)
5. `package-release.sh` → `dist/release-<sha>.tar.gz` (composer `--no-dev`,
   built assets, no secrets/keys/tests)
6. Loads the SSH key, pins the host key
7. **SCP** the tarball + `server-deploy.sh` to the server, then run the deploy
   over SSH
8. HTTPS smoke check of `/`, `/sitemap.xml`, `/robots.txt`

`server-deploy.sh` on the server does the heavy lifting: requirement checks →
extract → preserve `.env`/uploads → **app key** → dependency fallback →
permissions → code swap (stale cleanup) → docroot mirror → **storage symlink** →
smart migrations → cache build → prune old releases → structure verification.

---

## GitHub configuration

**Repo → Settings → Secrets and variables → Actions**

### Secrets (Secrets tab)

| Secret | Required | Value |
|--------|----------|-------|
| `SSH_HOST` | **yes** | `107.180.118.78` |
| `SSH_USER` | **yes** | `a040j9v5l2vz` |
| `SSH_PRIVATE_KEY` | **yes** | Full contents of `github-actions-TGK` (the private key, including the BEGIN/END lines) |
| `PROD_ENV` | recommended | Full contents of your production `.env` (see below). Uploaded only when the server has no `.env`. |
| `SSH_PORT` | no | `22` (default) |
| `DEPLOY_CORE_DIR` | no | Override backend path (default `~/TGK-core`) |
| `DEPLOY_PUBLIC_DIR` | no | Override docroot path (default `~/TGK-public`) |
| `DEPLOY_PHP_BIN` | no | PHP CLI on the server if `php` isn't 8.2+ (e.g. `ea-php83`) |

### Variables (Variables tab)

| Variable | Required | Value |
|----------|----------|-------|
| `DEPLOY_URL` | no | `https://goodkenyan.org` (default used if unset) |
| `KEEP_RELEASES` | no | Rollback tarballs to keep (default `3`) |

> The old FTP secrets (`FTP_*`, `CORE_PATH_REMOTE`) are no longer used and can be deleted.

---

## SSH key

Generated at the repo root (both files are **gitignored**):

```bash
ssh-keygen -t ed25519 -C "github-actions-TGK" -f github-actions-TGK -N ""
#  github-actions-TGK      → private key → paste into the SSH_PRIVATE_KEY secret
#  github-actions-TGK.pub  → public key  → add to the server (below)
```

Add the **public** key to the server (you said you've already reused it — this is
the reference):

```bash
# In cPanel → Terminal (or SSH in with the cPanel password once):
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "ssh-ed25519 AAAA...github-actions-TGK" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

---

## First-time server bootstrap (once)

In **cPanel → Terminal**:

```bash
# 1. Directory skeleton (server-deploy.sh also creates these, but pre-creating is safe)
mkdir -p ~/TGK-core/storage/app/public ~/TGK-core/storage/app/private \
         ~/TGK-core/storage/framework/{cache/data,sessions,views} \
         ~/TGK-core/storage/logs ~/TGK-core/bootstrap/cache ~/TGK-public

# 2. Public uploads symlink (deploy re-checks/creates this every run too)
ln -sfn ~/TGK-core/storage/app/public ~/TGK-public/storage
```

Then in cPanel:
1. **Domains** → point **both** `goodkenyan.org` and `goodkenyan.com` document
   roots to `/home/a040j9v5l2vz/TGK-public`. (The `.com → .org` redirect is
   handled in `.htaccess`.)
2. **MultiPHP Manager / Select PHP Version** → PHP **8.2+** (8.3 recommended)
   with extensions: `pdo_mysql`, `mbstring`, `openssl`, `ctype`, `json`, `curl`,
   `fileinfo`, `tokenizer`, `xml`, `dom`.
3. **MySQL Databases** → create the DB + user, note the account-prefixed full
   names (e.g. `a040j9v5l2vz_TGK-site`, `a040j9v5l2vz_TGKADM`), grant ALL.
4. **Create `~/TGK-core/.env`** (see below) — or set the `PROD_ENV` secret and let
   the first deploy upload it.
5. **SSL** — issue/enable AutoSSL for both domains so HTTPS works before the first
   smoke check.

---

## Production `.env`

Base it on `.env.production.example`. Set a real `APP_KEY` (the deploy generates
one automatically if it's blank), fill DB + mail secrets, then either paste it
into `~/TGK-core/.env` on the server **or** store it as the `PROD_ENV` secret.

Key values for this server:

```env
APP_URL=https://goodkenyan.org
DB_DATABASE=a040j9v5l2vz_TGK-site      # confirm exact prefixed name in cPanel
DB_USERNAME=a040j9v5l2vz_TGKADM
DB_PASSWORD=********
MAIL_HOST=mail.goodkenyan.com
MAIL_PORT=465
MAIL_SCHEME=smtps
MAIL_USERNAME=system@goodkenyan.com
MAIL_PASSWORD=********
MAIL_FROM_ADDRESS="system@goodkenyan.com"
SESSION_SECURE_COOKIE=true
```

> The live `~/TGK-core/.env` is **never** overwritten by a deploy. To change
> production config, edit it on the server (or update `PROD_ENV` and remove the
> server `.env` if you want the secret re-seeded).

---

## Secrets hygiene

Gitignored (verified — nothing sensitive has ever been committed):
`.env`, `.env.production`, `.env.*.local`, `github-actions-*`, `*.pem`,
`id_rsa*`, `id_ed25519*`, `known_hosts`, `dist/`, `/vendor`, `/public/build`.

Production credentials live only in: the server `~/TGK-core/.env`, your local
gitignored `.env.production`, and the GitHub `SSH_PRIVATE_KEY` / `PROD_ENV` secrets.

---

## Manual / emergency deploy (from your machine)

```bash
cd app
export SSH_HOST=107.180.118.78 SSH_USER=a040j9v5l2vz SSH_PORT=22
KEY=../github-actions-TGK
SHA=$(git rev-parse --short HEAD)

npm ci && npm run build
./scripts/deploy/package-release.sh dist "$SHA"

scp -i "$KEY" -P "$SSH_PORT" dist/release-$SHA.tar.gz "$SSH_USER@$SSH_HOST:release.tar.gz"
scp -i "$KEY" -P "$SSH_PORT" scripts/deploy/server-deploy.sh "$SSH_USER@$SSH_HOST:deploy.sh"
ssh -i "$KEY" -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" \
  'RELEASE_ARCHIVE=$HOME/release.tar.gz RELEASE_ID='"$SHA"' bash $HOME/deploy.sh; rm -f $HOME/deploy.sh'
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Deploy: `Permission denied (publickey)` | Public key not in `~/.ssh/authorized_keys`, or wrong `SSH_PRIVATE_KEY`/`SSH_USER`. `chmod 700 ~/.ssh; chmod 600 ~/.ssh/authorized_keys`. |
| Deploy: `Host key verification failed` | Rare; the workflow uses `accept-new`. Re-run the job. |
| `missing PHP extension` | Enable it in cPanel → Select PHP Version, then re-run. |
| 500 on the site | `tail ~/TGK-core/storage/logs/laravel.log`; check `~/TGK-core/.env` DB creds. |
| Assets 404 | Confirm `~/TGK-public/build/manifest.json` exists; re-run deploy. |
| `/storage` 404 | `ls -la ~/TGK-public/storage` must be a symlink to `~/TGK-core/storage/app/public`. |
| `.com` not redirecting | Confirm its docroot is `~/TGK-public` and mod_rewrite is on. |
| Migrations skipped | DB unreachable — verify DB name/user/password (account prefix!) in `.env`. |
| Deploy didn't trigger | It only runs after **CI succeeds on `main`**. Check the CI run, or use "Run workflow" on Deploy. |
| Wrong PHP version used | Set the `DEPLOY_PHP_BIN` secret (e.g. `ea-php83`). |
