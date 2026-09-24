<?php

/**
 * Temporary CI deploy hook (uploaded over FTP, invoked once, deleted).
 * Runs artisan migrate/optimize without SSH on shared hosting.
 *
 * Placeholders replaced by CI:
 *   __CORE_PATH__  absolute path to Laravel root on server
 *   __HOOK_TOKEN__ random per-deploy token
 */

declare(strict_types=1);
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

const CORE_PATH = '__CORE_PATH__';
const HOOK_TOKEN = '__HOOK_TOKEN__';

header('Content-Type: text/plain; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow');

if (! hash_equals(HOOK_TOKEN, (string) ($_GET['token'] ?? ''))) {
    http_response_code(403);
    exit("Forbidden\n");
}

// Only allow from this server's deploy (no CLI, no long-running)
if (PHP_SAPI === 'cli') {
    http_response_code(400);
    exit("CLI not allowed\n");
}

require CORE_PATH.'/vendor/autoload.php';

$app = require CORE_PATH.'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$run = static function (string $command, array $params = []): int {
    echo "\$ php artisan {$command}".($params ? ' '.json_encode($params) : '')."\n";
    try {
        $exit = Artisan::call($command, $params);
        echo trim(Artisan::output())."\n";
        if ($exit !== 0) {
            echo "exit={$exit}\n";
        }

        return $exit;
    } catch (Throwable $e) {
        echo 'ERROR: '.$e->getMessage()."\n";

        return 1;
    }
};

$failed = 0;

// Ensure storage skeleton (FTP may not have created empty dirs)
foreach ([
    'storage/framework/cache/data',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
    'storage/app/public',
    'storage/app/private',
    'bootstrap/cache',
] as $dir) {
    @mkdir(CORE_PATH.'/'.$dir, 0775, true);
}

// Bootstrap-only recovery: a half-built schema (no migration history) can't be
// repaired with migrate — DDL isn't transactional. Safe because an initialized
// DB always has rows in `migrations`.
$hasHistory = false;
try {
    $hasHistory = DB::table('migrations')->count() > 0;
} catch (Throwable) {
    $hasHistory = false;
}

if ($hasHistory) {
    $failed += $run('migrate', ['--force' => true, '--no-interaction' => true]) !== 0 ? 1 : 0;
} else {
    echo "No migration history — rebuilding schema with migrate:fresh\n";
    $failed += $run('migrate:fresh', ['--force' => true, '--no-interaction' => true]) !== 0 ? 1 : 0;
}
$run('storage:link', ['--force' => true]); // OK if link already exists
$run('config:cache');
$run('route:cache');
$run('view:cache');
$run('event:cache');

echo $failed > 0 ? "DEPLOY HOOK FAILED\n" : "DEPLOY HOOK OK\n";
exit($failed > 0 ? 1 : 0);
