<?php

namespace App\Models;

use App\Support\PublicUrl;
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
        return PublicUrl::image($this->hero_image);
    }

    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'hero_url' => $this->hero_url,
            'is_published' => $this->published_at && $this->published_at->isPast(),
            'published_at' => optional($this->published_at)->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
