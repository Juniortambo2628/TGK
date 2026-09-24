<?php

namespace App\Support;

/**
 * Minimal-but-safe HTML sanitiser for content coming out of the rich editor.
 * We allow the formatting tags Trix / TipTap actually produce and strip
 * everything else, plus all inline event handlers and javascript: URLs.
 *
 * This runs both on save (belt) and on read (braces) so that even legacy
 * rows or a compromised editor cannot inject <script>.
 */
class Html
{
    protected const ALLOWED_TAGS = '<p><br><strong><b><em><i><u><a><ul><ol><li><h2><h3><h4><blockquote><hr><span>';

    public static function purify(?string $html): string
    {
        if ($html === null || $html === '') {
            return '';
        }

        // Drop dangerous elements entirely, contents and all.
        $html = preg_replace('#<(script|style|iframe|object|embed|form|input|button|textarea|meta|link)[^>]*>.*?</\1>#is', '', $html);
        $html = preg_replace('#<(script|style|iframe|object|embed|form|input|button|textarea|meta|link)[^>]*/?>#is', '', $html);

        // Strip everything else that is not in the allowlist.
        $html = strip_tags((string) $html, self::ALLOWED_TAGS);

        // Kill inline event handlers and javascript: URLs on any surviving tags.
        $html = preg_replace('#\son[a-z]+\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+)#i', '', $html);
        $html = preg_replace('#(href|src)\s*=\s*"\s*javascript:[^"]*"#i', '$1="#"', $html);
        $html = preg_replace('#(href|src)\s*=\s*\'\s*javascript:[^\']*\'#i', "$1='#'", $html);

        return trim($html);
    }
}
