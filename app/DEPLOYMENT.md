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

## Why FTP (not SSH)

SSH ports (22, 1624, 2222, …) are **filtered** on this host — connection times out
from both this machine and GitHub Actions. FTP port **21 is open** (verified).

Deploy path: **GitHub Actions → FTP → cPanel**, then a one-shot PHP hook runs
`artisan migrate` / caches over HTTPS (no SSH, no rsync).

---

## Server layout

| Role | Path (filesystem) | Path (FTP, chroot to home) |
|------|-------------------|----------------------------|
| Document root (vhost) | `/home/goodmshd/TGK-public` | `TGK-public/` |
| Laravel application | `/home/goodmshd/TGK-core` | `TGK-core/` |
| Public storage | `/home/goodmshd/TGK-core/storage/app/public` → symlink `TGK-public/storage` | — |

`TGK-public/index.php` comes from `scripts/deploy/public-index.php` and boots
`/home/goodmshd/TGK-core/bootstrap/app.php`.

> cPanel FTP usually chroots to the home directory — use **relative** paths
> `TGK-core` / `TGK-public` (the defaults). If your FTP user is not chrooted,
> set secrets to absolute paths instead.

---

## GitHub → Secrets

**Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Required | Value |
|-------------|----------|--------|
| `FTP_HOST` | yes | `184.94.213.150` (or your FTP hostname) |
| `FTP_USER` | yes | cPanel username, e.g. `goodmshd` |
| `FTP_PASS` | yes | cPanel/FTP password |
| `FTP_PORT` | no | `21` (default) |
| `FTP_SSL` | no | `true` if host requires FTPS (AUTH TLS) |
| `FTP_CORE_DIR` | no | `TGK-core` (default) |
| `FTP_PUBLIC_DIR` | no | `TGK-public` (default) |
| `CORE_PATH_REMOTE` | no | `/home/goodmshd/TGK-core` (absolute path for PHP hook) |
| `PROD_ENV` | recommended | Full contents of local `.env.production` — uploaded **only if** the server has no `.env` yet |

SSH secrets (`SSH_*`) are **not used** while port 22 stays blocked.

Environments (`production` in Settings) are **optional** and unavailable on
GitHub Free + private repos — the workflow no longer requires one.

---

## Workflow

**`.github/workflows/ci.yml`** on every push to `main`:

1. **test** — Composer + npm, Pint autofix commit, PHPUnit, `npm run build`
2. **deploy** (`needs: test`)
   - Build assets
   - Write `.env.production` from `PROD_ENV`
   - `package-release.sh` → `dist/stage` (composer `--no-dev`, ship `public/build`)
   - `prepare-public.sh` → `dist/public-docroot` (custom `index.php` + `.htaccess` + `build/`)
   - `ftp-deploy.sh` — lftp mirror stage → `TGK-core/`, docroot → `TGK-public/`
     - **Never overwrites** remote `.env`, logs, sessions, uploads
     - Uploads staged `.env` only if server `.env` is missing
   - Upload `deploy-hook-<sha>.php` (random token), `GET` it once → migrate + caches
   - **Delete** the hook
   - HTTPS smoke check: `/`, `/sitemap.xml`, `/robots.txt`

---

## First-time server bootstrap (once)

In **cPanel → Terminal** (or File Manager):

```bash
mkdir -p ~/TGK-core/storage/app/public ~/TGK-core/storage/app/private \
         ~/TGK-core/storage/framework/{cache/data,sessions,views} \
         ~/TGK-core/storage/logs ~/TGK-core/bootstrap/cache \
         ~/TGK-public

# Public uploads URL (/storage/…) — FTP cannot create symlinks
ln -sfn ~/TGK-core/storage/app/public ~/TGK-public/storage
```

1. **cPanel → File Manager** → create `TGK-core/.env`  
   (paste local `.env.production`, or set the `PROD_ENV` secret and let the first deploy upload it)
2. Document root for **goodkenyan.org** → `/home/goodmshd/TGK-public`
3. PHP **8.2+** (8.3 recommended); extensions: `pdo_mysql`, `mbstring`, `openssl`, `ctype`, `json`, `curl`, `fileinfo`, `tokenizer`, `xml`
4. MySQL (cPanel) — already in `.env.production`:  
   DB `goodmshd_TGK-site`, user `goodmshd_TGKADM`

After the first successful deploy:

```bash
# Optional admin user
cd ~/TGK-core && php artisan db:seed --class=AdminUserSeeder --force
```

---

## Local secrets hygiene

Gitignored (verified):
- `.env`, `.env.production`, `.env.*.local`
- `github-actions-*`, `*.pem`, `id_rsa`, `id_ed25519`
- `/vendor`, `/public/build`, `/bootstrap/ssr`

Production credentials live only in:
1. Local gitignored `.env.production`
2. Server `TGK-core/.env` (never overwritten by FTP)
3. GitHub secrets (`FTP_*`, `PROD_ENV`)

---

## Enabling SSR later (VPS only)

```bash
npm run build
INERTIA_SSR_ENABLED=true php artisan inertia:start-ssr
```

Not for this cPanel box.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| FTP auth fail | Check `FTP_HOST`/`FTP_USER`/`FTP_PASS`; try `FTP_SSL=true`; confirm port 21 in cPanel → FTP Accounts |
| FTP path not found | Paths are relative to FTP home — keep `TGK-core` / `TGK-public` (no `/home/…` prefix) |
| 500 on site | cPanel Terminal: `tail ~/TGK-core/storage/logs/laravel.log` |
| Assets 404 | Confirm `TGK-public/build/manifest.json` exists; re-run deploy |
| `/storage` 404 | `ls -la ~/TGK-public/storage` → must be a symlink to `~/TGK-core/storage/app/public` |
| Hook HTTP 403/404 | File not uploaded or token mismatch — check deploy job log; re-run workflow |
| Hook left on server | Should auto-delete; remove `TGK-public/deploy-hook-*.php` via File Manager if needed |
| Migrate failed | cPanel Terminal: `cd ~/TGK-core && php artisan migrate --force` |
| Pint commit loop | Autofix commits use `[skip ci]` |
| SSH still blocked | Expected — host firewall; ask host to open 22 if you want SSH deploys later |

---

## Manual emergency deploy (FTP from your machine)

```bash
./scripts/deploy/package-release.sh dist manual
./scripts/deploy/prepare-public.sh dist/stage dist/public-docroot

export FTP_HOST=184.94.213.150 FTP_USER=goodmshd FTP_PASS='…' FTP_PORT=21
./scripts/deploy/ftp-deploy.sh
```

Then in cPanel Terminal:

```bash
cd ~/TGK-core && php artisan migrate --force && php artisan optimize
```
