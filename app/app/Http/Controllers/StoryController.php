<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;

class StoryController extends Controller
{
    public function index()
    {
        $stories = Post::published()
            ->orderByDesc('published_at')
            ->get()
            ->map(fn ($p) => $this->transform($p));

        return Inertia::render('Stories/Index', [
            'stories' => $stories,
            'cms' => \App\Support\Content::for('stories')->toShare(),
            'seo' => [
                'title' => 'Stories · Good Kenyan Foundation',
                'description' => 'Named journeys, real outcomes. Read the stories in their own words.',
            ],
        ]);
    }

    public function show(string $slug)
    {
        $story = Post::published()->where('slug', $slug)->firstOrFail();

        $related = Post::published()
            ->where('id', '!=', $story->id)
            ->orderByDesc('published_at')
            ->take(3)
            ->get()
            ->map(fn ($p) => $this->transform($p));

        return Inertia::render('Stories/Show', [
            'story' => array_merge($this->transform($story), [
                'body' => $story->body,
            ]),
            'related' => $related,
            'seo' => [
                'title' => ($story->seo_title ?: $story->title).' · Good Kenyan Foundation',
                'description' => $story->seo_description ?: $story->excerpt,
                'og_image' => $story->hero_url,
                'type' => 'article',
            ],
        ]);
    }

    protected function transform(Post $p): array
    {
        return [
            'slug' => $p->slug,
            'title' => $p->title,
            'excerpt' => $p->excerpt,
            'hero_image' => $p->hero_image,
            'hero_url' => $p->hero_url,
            'published_at' => optional($p->published_at)->toIso8601String(),
        ];
    }
}
