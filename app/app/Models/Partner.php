<?php

namespace App\Models;

use App\Support\PublicUrl;
use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    protected $fillable = ['name', 'logo', 'url', 'sort_order', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function getLogoUrlAttribute(): string
    {
        return PublicUrl::image($this->logo, asset('images/partners/placeholder.png'), 'images/partners/');
    }
}
