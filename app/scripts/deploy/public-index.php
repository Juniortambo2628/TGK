<?php

/**
 * Document-root entry point for the cPanel split layout.
 *
 *   Public docroot : /home/<cpuser>/TGK-public   (this file is deployed here as index.php)
 *   Laravel backend: /home/<cpuser>/TGK-core     (full application)
 *
 * The __CORE_PATH__ placeholder is substituted with the absolute backend path
 * by scripts/deploy/server-deploy.sh at deploy time (kept in sync with the
 * CORE_DIR / DEPLOY_CORE_DIR values in .github/workflows/deploy.yml).
 *
 * Do NOT edit the substituted path by hand on the server — redeploy instead.
 */

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$core = '__CORE_PATH__';

// Maintenance mode (php artisan down)
if (file_exists($maintenance = $core.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Composer autoloader from the backend directory
require $core.'/vendor/autoload.php';

// Bootstrap Laravel and handle the request
(require_once $core.'/bootstrap/app.php')
    ->handleRequest(Request::capture());
