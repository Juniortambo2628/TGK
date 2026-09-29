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

    /**
     * Normalise editor/legacy story body into safe, paragraph-structured HTML.
     * New stories come from the rich editor as HTML; older ones may be plain
     * text with blank-line paragraph breaks. Either way we return purified HTML
     * so the frontend can render it directly instead of showing raw <p> tags.
     */
    public static function paragraphs(?string $body): string
    {
        if ($body === null || trim($body) === '') {
            return '';
        }

        // Already contains HTML tags → just sanitise it.
        if (preg_match('/<[a-z][\s\S]*>/i', $body)) {
            return self::purify($body);
        }

        // Plain text → wrap blank-line-separated blocks in <p>, keep single
        // line breaks as <br>.
        $blocks = preg_split('/\R{2,}/', trim($body));
        $html = collect($blocks)
            ->map(fn ($b) => '<p>'.nl2br(e(trim($b))).'</p>')
            ->implode('');

        return self::purify($html);
    }

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
