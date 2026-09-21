<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class ContentBlock extends Model
{
    protected $fillable = ['page', 'key', 'text', 'data'];
    protected $casts = ['data' => 'array'];

    protected static string $cachePrefix = 'cms.page.';

    public static function forPage(string $page): array
    {
        return Cache::rememberForever(self::$cachePrefix.$page, function () use ($page) {
            $rows = static::query()->where('page', $page)->get();
            $out = [];
            foreach ($rows as $row) {
                $out[$row->key] = $row->data !== null ? $row->data : $row->text;
            }
            return $out;
        });
    }

    public static function set(string $page, string $key, mixed $value): void
    {
        $isStructured = is_array($value);
        static::query()->updateOrInsert(
            ['page' => $page, 'key' => $key],
            [
                'text' => $isStructured ? null : (string) ($value ?? ''),
                'data' => $isStructured ? json_encode($value) : null,
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );
        Cache::forget(self::$cachePrefix.$page);
    }

    public static function flushPage(string $page): void
    {
        Cache::forget(self::$cachePrefix.$page);
    }
}
