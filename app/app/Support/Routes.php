<?php

namespace App\Support;

use Illuminate\Support\Facades\Route;

/**
 * Turn the Laravel route table into a select list, so
 * admins pick a page from a dropdown rather than typing a URL.
 * Adds `External URL…` and a handful of common presets at the top.
 */
class Routes
{
    /**
     * @return array<string,string> ['/path' => 'Human label']
     */
    public static function forSelect(bool $includeExternal = true): array
    {
        $out = [];

        if ($includeExternal) {
            $out['__external'] = 'External URL (custom)';
            $out['__donate'] = 'Donate page (uses site donate URL)';
        }

        // Curated top choices, so the important ones bubble up.
        $primary = [
            '/'              => 'Home',
            '/about'         => 'About',
            '/our-model'     => 'Our Model',
            '/regina-yego'   => 'Regina Yego Girls Center',
            '/stawi'         => 'Stawi Enterprises',
            '/stories'       => 'Stories',
            '/partners'      => 'Partners',
            '/get-involved'  => 'Get Involved',
            '/contact'       => 'Contact',
        ];
        foreach ($primary as $path => $label) $out[$path] = $label;

        // Also expose named GET routes without required parameters, so admins
        // can link to less common pages (e.g. contact with a topic query).
        foreach (Route::getRoutes()->getRoutesByMethod()['GET'] ?? [] as $route) {
            $uri = '/'.ltrim($route->uri(), '/');
            $name = $route->getName();
            if (! $name) continue;
            if (in_array($uri, array_keys($primary), true)) continue;
            if (str_starts_with($uri, 'admin')) continue;
            if (str_starts_with($uri, '_') || str_starts_with($uri, 'livewire')) continue;
            if (str_starts_with($uri, 'storage')) continue;
            if (str_contains($uri, '{')) continue; // skip parameterised routes
            if (! isset($out[$uri])) $out[$uri] = $name;
        }

        return $out;
    }

    /**
     * Resolve a stored href value at render time. `__donate` becomes the
     * site's configured donate URL, `__external` is treated as literal.
     */
    public static function resolve(?string $href, ?string $external = null): string
    {
        if (! $href) return '#';
        if ($href === '__donate') {
            return \App\Models\Setting::get('donate_url', env('DONATE_URL', '#'));
        }
        if ($href === '__external') {
            return $external ?: '#';
        }
        return $href;
    }
}
