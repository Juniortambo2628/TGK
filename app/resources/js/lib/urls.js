/**
 * Resolve an image reference stored by the CMS (upload path, bundled path,
 * or external URL) into a browser URL. Mirrors App\Support\PublicUrl in PHP.
 * Accepts a string, a FilePond single-item array, or null.
 */
export function imageUrl(value, fallback = null) {
    if (!value) return fallback;
    if (Array.isArray(value)) value = value[0] ?? null;
    if (typeof value !== 'string' || value === '') return fallback;
    if (value.startsWith('http')) return value;
    if (value.startsWith('uploads/')) return `/storage/${value}`;
    if (value.startsWith('/')) return value;
    return `/${value}`;
}

/**
 * Same as imageUrl but for arrays. Filters out anything unresolvable.
 */
export function imageUrls(values, fallback = []) {
    if (!Array.isArray(values) || !values.length) return fallback;
    return values.map((v) => imageUrl(v)).filter(Boolean);
}

/**
 * Resolve a route-picker href stored by the admin. `__donate` and
 * `__external` need the site's donate URL and the paired external field
 * respectively.
 */
export function resolveHref(href, external = null, donateUrl = '#') {
    if (!href) return '#';
    if (href === '__donate') return donateUrl || '#';
    if (href === '__external') return external || '#';
    return href;
}
