<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentBlock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContentController extends Controller
{
    protected array $pages = [
        'home' => ['label' => 'Home Page', 'tabs' => ['Hero', 'Who We Are', 'Impact Numbers', 'The Problem', 'We Believe', 'Our Model', 'Stawi', 'Bottom CTA']],
        'about' => ['label' => 'About Page', 'tabs' => ['Hero', 'Our Story', 'Mission & Vision', 'Values & Voice']],
        'our-model' => ['label' => 'Our Model Page', 'tabs' => ['Hero', 'Three Stages', 'Daraja Upstream']],
        'regina-yego' => ['label' => 'Regina Yego Page', 'tabs' => ['Hero', 'Who We Serve', 'Stats', 'Growing the Family']],
        'stawi' => ['label' => 'Stawi Enterprises Page', 'tabs' => ['Hero', 'Good Studio', 'Good Connect', 'Selected Work']],
        'stories' => ['label' => 'Stories Index Page', 'tabs' => ['Hero', 'Sidebar']],
        'partners' => ['label' => 'Partners Page', 'tabs' => ['Hero', 'Footer Note']],
        'get-involved' => ['label' => 'Get Involved Page', 'tabs' => ['Hero', 'Cards']],
        'contact' => ['label' => 'Contact Page', 'tabs' => ['Hero', 'Left Column', 'Form Section']],
    ];

    public function edit(string $page)
    {
        abort_unless(isset($this->pages[$page]), 404);

        $blocks = ContentBlock::where('page', $page)->get()->mapWithKeys(fn ($b) => [$b->key => $b->text ?? $b->data]);

        return Inertia::render('Admin/Content/' . $this->pageToComponent($page), [
            'page' => $this->pages[$page],
            'pageSlug' => $page,
            'blocks' => $blocks,
        ]);
    }

    public function update(Request $request, string $page)
    {
        abort_unless(isset($this->pages[$page]), 404);

        $data = $request->validate(['blocks' => 'required|array']);

        foreach ($data['blocks'] as $key => $value) {
            ContentBlock::updateOrCreate(
                ['page' => $page, 'key' => $key],
                is_array($value) ? ['data' => $value] : ['text' => $value]
            );
        }

        ContentBlock::flushPage($page);

        return back()->with('success', 'Content updated successfully.');
    }

    protected function pageToComponent(string $page): string
    {
        return match ($page) {
            'home' => 'HomePage',
            'about' => 'AboutPage',
            'our-model' => 'OurModelPage',
            'regina-yego' => 'ReginaYegoPage',
            'stawi' => 'StawiPage',
            'stories' => 'StoriesPage',
            'partners' => 'PartnersPage',
            'get-involved' => 'GetInvolvedPage',
            'contact' => 'ContactPage',
        };
    }
}
