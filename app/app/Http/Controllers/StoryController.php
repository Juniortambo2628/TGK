<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Support\Content;
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
            'cms' => Content::for('stories')->toShare(),
            'seo' => [
                'title' => 'Stories · Good Kenyan Foundation',
                'description' => 'Named journeys, real outcomes. Read stories from Good Kenyan Foundation programme graduates in their own words — from first skills to first income.',
                'json_ld' => [
                    $this->breadcrumbGraph([
                        ['name' => 'Home', 'url' => route('home')],
                        ['name' => 'Stories', 'url' => route('stories.index')],
                    ]),
                ],
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

        $canonical = route('stories.show', $story->slug);
        $description = $story->seo_description ?: $story->excerpt;
        $orgLogo = asset('images/tgkf-logo.png');

        return Inertia::render('Stories/Show', [
            'story' => array_merge($this->transform($story), [
                'body' => $story->body,
            ]),
            'related' => $related,
            'seo' => [
                'title' => ($story->seo_title ?: $story->title).' · Good Kenyan Foundation',
                'description' => $description,
                'og_image' => $story->hero_url,
                'type' => 'article',
                'canonical' => $canonical,
                'json_ld' => [
                    [
                        '@context' => 'https://schema.org',
                        '@type' => 'Article',
                        'headline' => $story->seo_title ?: $story->title,
                        'description' => $description,
                        'image' => $story->hero_url,
                        'datePublished' => optional($story->published_at)->toIso8601String(),
                        'dateModified' => optional($story->updated_at)->toIso8601String(),
                        'mainEntityOfPage' => $canonical,
                        'author' => [
                            '@type' => 'Organization',
                            'name' => 'Good Kenyan Foundation',
                            'url' => config('app.url'),
                        ],
                        'publisher' => [
                            '@type' => 'Organization',
                            'name' => 'Good Kenyan Foundation',
                            'url' => config('app.url'),
                            'logo' => [
                                '@type' => 'ImageObject',
                                'url' => $orgLogo,
                            ],
                        ],
                    ],
                    $this->breadcrumbGraph([
                        ['name' => 'Home', 'url' => route('home')],
                        ['name' => 'Stories', 'url' => route('stories.index')],
                        ['name' => $story->title, 'url' => $canonical],
                    ]),
                ],
            ],
        ]);
    }

    protected function breadcrumbGraph(array $items): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => array_values(array_map(function ($item, $i) {
                return [
                    '@type' => 'ListItem',
                    'position' => $i + 1,
                    'name' => $item['name'],
                    'item' => $item['url'],
                ];
            }, $items, array_keys($items))),
        ];
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
