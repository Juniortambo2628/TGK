<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    protected $fillable = ['name','logo','url','sort_order','is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function getLogoUrlAttribute(): string
    {
        if (str_starts_with((string) $this->logo, 'uploads/')) {
            return asset('storage/'.$this->logo);
        }
        if (str_starts_with((string) $this->logo, 'images/')) {
            return asset($this->logo);
        }
        return asset('images/partners/'.$this->logo);
    }
}
