import { usePage } from '@inertiajs/react';

/**
 * Read CMS content from the current Inertia page.
 *
 *   const cms = useCms();
 *   cms.text('hero.title', 'Fallback title')
 *   cms.array('hero.images', [])
 *   cms.hasImages('hero.images')
 *   cms.html('who.body', 'Default paragraph.')       // returns a string (already sanitised server-side)
 *
 * For safe HTML rendering, use the <RichText/> component so that we render
 * exactly what the server sanitised and never fall back to
 * dangerouslySetInnerHTML with untrusted values.
 */
export function useCms() {
    const { props } = usePage();
    const blocks = props.cms || {};

    return {
        text(key, fallback = '') {
            const v = blocks[key];
            return typeof v === 'string' && v !== '' ? v : fallback;
        },
        html(key, fallback = '') {
            const v = blocks[key];
            return typeof v === 'string' && v !== '' ? v : fallback;
        },
        array(key, fallback = []) {
            const v = blocks[key];
            return Array.isArray(v) && v.length ? v : fallback;
        },
        hasImages(key) {
            const v = blocks[key];
            return Array.isArray(v) && v.length > 0;
        },
        raw(key) {
            return blocks[key];
        },
    };
}

/** Global site settings (name, logo, socials, donate url, etc). */
export function useSite() {
    const { props } = usePage();
    return props.site || {};
}
