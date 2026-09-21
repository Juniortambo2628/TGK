<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = ['key', 'value', 'type', 'updated_at'];
    protected $casts = ['value' => 'array', 'updated_at' => 'datetime'];

    protected static string $cacheKey = 'settings.all';

    public static function all($columns = ['*']): \Illuminate\Support\Collection
    {
        return Cache::rememberForever(self::$cacheKey, function () {
            return parent::query()->get()->keyBy('key')->map(fn ($s) => $s->value);
        });
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $all = self::all();
        $value = $all[$key] ?? null;
        // Values were json_encoded when stored; casts decode them to array/scalar.
        return $value ?? $default;
    }

    public static function set(string $key, mixed $value, string $type = 'string'): void
    {
        static::query()->updateOrInsert(
            ['key' => $key],
            ['value' => json_encode($value), 'type' => $type, 'updated_at' => now()]
        );
        Cache::forget(self::$cacheKey);
    }

    public static function forget(string $key): void
    {
        static::query()->where('key', $key)->delete();
        Cache::forget(self::$cacheKey);
    }

    public static function flush(): void
    {
        Cache::forget(self::$cacheKey);
    }
}
