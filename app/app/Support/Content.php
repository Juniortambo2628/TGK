<?php

namespace App\Support;

use App\Models\ContentBlock;

/**
 * Fluent read API for CMS content. Falls back to the passed default whenever
 * a key is missing so pages always have something to render even before the
 * client has visited the admin.
 *
 *   Content::for('home')->text('hero.title', 'From school to opportunity.');
 *   Content::for('home')->html('mission.body', 'We grow…');
 *   Content::for('home')->array('hero.images', []);
 *
 * `html()` runs the value through the sanitiser so the browser only ever
 * sees a safe subset of tags. `text()` returns the string as-is (already
 * stored plain).
 */
class Content
{
    protected string $page;

    protected array $blocks;

    protected static array $cache = [];

    public function __construct(string $page)
    {
        $this->page = $page;
        $this->blocks = self::$cache[$page] ??= ContentBlock::forPage($page);
    }

    public static function for(string $page): self
    {
        return new self($page);
    }

    public static function flush(string $page): void
    {
        unset(self::$cache[$page]);
        ContentBlock::flushPage($page);
    }

    public function text(string $key, string $default = ''): string
    {
        $v = $this->blocks[$key] ?? null;

        return is_string($v) ? $v : $default;
    }

    public function html(string $key, string $default = ''): string
    {
        $v = $this->blocks[$key] ?? null;

        return Html::purify(is_string($v) ? $v : $default);
    }

    public function array(string $key, array $default = []): array
    {
        $v = $this->blocks[$key] ?? null;

        return is_array($v) ? $v : $default;
    }

    /**
     * Serialise this page's content for Inertia sharing.
     * Rich-text keys (those ending in .body / .html / .rich) are sanitised.
     */
    public function toShare(): array
    {
        $out = [];
        foreach ($this->blocks as $k => $v) {
            if (is_string($v) && preg_match('/\.(body|html|rich)$/i', $k)) {
                $out[$k] = Html::purify($v);
            } else {
                $out[$k] = $v;
            }
        }

        return $out;
    }
}
