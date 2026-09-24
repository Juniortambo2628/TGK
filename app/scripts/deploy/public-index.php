<?php

/**
 * Document-root entry point for cPanel split layout:
 *   public:  /home/goodmshd/TGK-public  (this file lives here as index.php)
 *   backend: /home/goodmshd/TGK-core    (full Laravel app)
 *
 * Keep in sync with deploy target paths in .github/workflows/deploy.yml
 * and scripts/deploy/server-deploy.sh.
 */

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$core = '/home/goodmshd/TGK-core';

if (file_exists($maintenance = $core.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $core.'/vendor/autoload.php';

(require_once $core.'/bootstrap/app.php')
    ->handleRequest(Request::capture());
