<?php

namespace App\Support;

/**
 * Resolve a value stored by the CMS/settings into a browser URL. Handles
 * the three formats we accept everywhere:
 *   - "uploads/hero/xyz.jpg"      (FilePond upload → /storage/)
 *   - "images/landing/hero.jpg"   (bundled/seeded asset → asset())
 *   - "https://…"                  (external URL, returned unchanged)
 *   - "filename.png"              (bare filename → prefixed with $prefix)
 *
 * Also unwraps arrays (single-image FilePond fields).
 */
class PublicUrl
{
    public static function image(mixed $value, ?string $fallback = null, string $prefix = ''): ?string
    {
        if (is_array($value)) $value = reset($value) ?: null;
        if (! is_string($value) || $value === '') return $fallback;
        if (str_starts_with($value, 'http')) return $value;
        if (str_starts_with($value, 'uploads/')) return asset('storage/'.$value);
        if (str_starts_with($value, 'images/') || str_starts_with($value, '/images/')) {
            return asset(ltrim($value, '/'));
        }
        // Bare filename: prefix it (e.g. images/partners/)
        if ($prefix !== '') {
            return asset($prefix.ltrim($value, '/'));
        }
        return asset(ltrim($value, '/'));
    }

    /**
     * @param array|mixed $values
     * @return array<int,string>
     */
    public static function images(mixed $values, array $fallback = [], string $prefix = ''): array
    {
        if (! is_array($values) || empty($values)) return $fallback;
        return array_values(array_filter(array_map(
            fn ($v) => self::image($v, null, $prefix),
            $values
        )));
    }

    /**
     * Resolve a stored href value (from a route picker) to a public URL.
     * `__donate` → the site's donate URL, `__external` → external field.
     */
    public static function href(?string $href, ?string $external = null, string $fallback = '#'): string
    {
        return Routes::resolve($href, $external) ?: $fallback;
    }
}
