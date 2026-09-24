# Production deployment — goodkenyan.org (cPanel shared hosting)

## Shared hosting & Inertia SSR

**You cannot run `php artisan inertia:start-ssr` on typical cPanel shared hosting.**
That command starts a long-lived Node process. Shared hosts only run PHP per request.

What still works without SSR:
- All SEO meta tags, Open Graph, JSON-LD are server-rendered in `resources/views/app.blade.php`
- First HTML response is fully crawlable by Google
- The React app hydrates client-side as before

Production `.env` sets `INERTIA_SSR_ENABLED=false` (correct for this host).
CI still builds the SSR bundle so you can enable it later on a VPS with Node.

---

## Server layout

| Role | Path |
|------|------|
| Document root (vhost) | `/home/goodmshd/TGK-public` |
| Laravel application | `/home/goodmshd/TGK-core` |
| Releases (keep 3) | `/home/goodmshd/TGK-core/releases/<sha>` |
| Public storage | `/home/goodmshd/TGK-core/storage/app/public` → symlink `TGK-public/storage` |

`TGK-public/index.php` is generated from `scripts/deploy/public-index.php` logic and loads:
`/home/goodmshd/TGK-core/bootstrap/app.php`

---

## SSH key pair (already generated in repo root)

**Files (gitignored — never commit):**
- `github-actions-TGK` — private key
- `github-actions-TGK.pub` — public key

### 1. cPanel → Authorize key
1. cPanel → **SSH Access** → **Manage SSH Keys**
2. **Import Public Key** → paste contents of `github-actions-TGK.pub`
3. **Authorize** the key  
   Or append the `.pub` line to `~/.ssh/authorized_keys` for user `goodmshd`.

### 2. GitHub → Secrets
Repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|-------------|--------|
| `SSH_PRIVATE_KEY` | Full contents of `github-actions-TGK` (including `BEGIN`/`END` lines) |
| `SSH_HOST` | `184.94.213.150` |
| `SSH_USER` | `goodmshd` |
| `SSH_PORT` | `22` |
| `PROD_ENV` | Full contents of local `.env.production` (same lines as the file, pasted as one secret). CI writes this into the release tar as `.env` so the first deploy has credentials. The server's existing `~/TGK-core/.env` always wins if present. |

Also: repo → **Settings → Environments → New environment → `production`** (the deploy job references it; leave unprotected, or add required reviewers to gate deploys).

**Alternative to `PROD_ENV`:** upload the env once manually before the first deploy:
```bash
scp -P 22 .env.production goodmshd@184.94.213.150:~/TGK-core/.env
```

---

## Workflow

**`.github/workflows/ci.yml`** on every push to `main`:

1. **test** job  
   - Composer + npm install  
   - Laravel Pint (autofix + commit as `github-actions[bot]` with `[skip ci]`)  
   - PHPUnit (`php artisan test`)  
   - `npm run build`  
2. **deploy** job (`needs: test`, only on `push` to `main`)  
   - Rebuild assets  
   - Write `.env.production` from `PROD_ENV` secret  
   - Package tar (composer `--no-dev`, ship `public/build`, ship `.env` fallback)  
   - SCP archive + `server-deploy.sh` (no rsync)  
   - SSH run `server-deploy.sh`: requirements → extract → preserve `.env`/storage → permissions → switch code → sync `TGK-public` → artisan migrate/optimize → prune old releases → structure checks  
   - HTTPS smoke check: `/`, `/sitemap.xml`, `/robots.txt`

---

## First-time server bootstrap (once)

```bash
# From your machine after adding the public key in cPanel:
ssh -p 22 goodmshd@184.94.213.150
mkdir -p ~/TGK-core/releases ~/TGK-public
# Optional: upload production .env once
# scp -P 22 .env.production goodmshd@184.94.213.150:~/TGK-core/.env
```

Point the domain **goodkenyan.org** document root in cPanel MultiPHP/Apache to:
`/home/goodmshd/TGK-public`

PHP version: **8.2+** (8.3 recommended). Enable extensions: `pdo_mysql`, `mbstring`, `openssl`, `ctype`, `json`, `curl`, `fileinfo`, `tokenizer`, `xml`.

MySQL (cPanel):
- DB: `goodmshd_TGK-site`
- User: `goodmshd_TGKADM`
- Already wired in `.env.production`

### First deploy will:
1. Create dirs
2. Install vendor (from tar)
3. Run migrations + seeders only if you run them manually:  
   `php artisan migrate --force`  
   `php artisan db:seed --force` (optional content)
4. Cache config/routes/views
5. Link storage → `TGK-public/storage`

Create the first admin (if not seeded):
```bash
cd ~/TGK-core && php artisan tinker
# or use DatabaseSeeder AdminUserSeeder
php artisan db:seed --class=AdminUserSeeder --force
```

---

## Local secrets hygiene

Gitignored (verified):
- `.env`, `.env.production`, `.env.*.local`
- `github-actions-*`, `*.pem`, `id_rsa`, `id_ed25519`
- `/vendor`, `/public/build`, `/bootstrap/ssr`

No `.env` with production DB/SMTP passwords has ever been committed (history checked).
`.env.example` and `.env.production.example` use placeholders only.

Production credentials live only in:
1. Local gitignored `.env.production`
2. Server `~/TGK-core/.env` (preserved across deploys)
3. GitHub secrets (`SSH_*` + `PROD_ENV` — encrypted, never printed in logs)

---

## Enabling SSR later (VPS only)

```bash
# On a host with Node 20+
npm run build          # builds client + bootstrap/ssr
INERTIA_SSR_ENABLED=true php artisan inertia:start-ssr
```

Not for this cPanel box.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| 500 on site | `tail ~/TGK-core/storage/logs/laravel.log`; check `public/index.php` paths; `php artisan config:clear` |
| Assets 404 | Ensure `TGK-public/build` exists; re-run deploy |
| `/storage` 404 | `ls -la ~/TGK-public/storage` → should link to `~/TGK-core/storage/app/public` |
| Migrate failed | Check DB user privileges in cPanel MySQL; run migrate from cPanel Terminal |
| Deploy auth fail | Re-import `.pub` key; authorize it; confirm `SSH_PRIVATE_KEY` secret |
| Pint commit loop | Autofix commits use `[skip ci]` |

---

## Manual deploy (emergency)

```bash
./scripts/deploy/package-release.sh dist manual
scp -P 22 dist/release-*.tar.gz scripts/deploy/server-deploy.sh \
  goodmshd@184.94.213.150:/home/goodmshd/TGK-core/
ssh -p 22 goodmshd@184.94.213.150
cd ~/TGK-core
export RELEASE_ARCHIVE=~/TGK-core/release-*.tar.gz
export CORE_DIR=$HOME/TGK-core PUBLIC_DIR=$HOME/TGK-public RELEASE_ID=manual
bash server-deploy.sh
```
