<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'slug','title','excerpt','body','hero_image','seo_title','seo_description','published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')->where('published_at', '<=', now());
    }

    public function getHeroUrlAttribute(): ?string
    {
        if (! $this->hero_image) return null;
        // New uploads from the admin come in as "uploads/stories/xxx.jpg" and
        // live under public/storage. Legacy/seeded rows are just the filename
        // and live under public/images/stories.
        if (str_starts_with($this->hero_image, 'uploads/')) {
            return asset('storage/'.$this->hero_image);
        }
        return asset('images/stories/'.$this->hero_image);
    }
}
