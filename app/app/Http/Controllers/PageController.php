<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Models\Post;
use App\Support\Content;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function home()
    {
        $stories = Post::published()->orderByDesc('published_at')->take(4)->get()
            ->map(fn ($p) => $this->transformStory($p));

        return Inertia::render('Home', [
            'stories'  => $stories,
            'partners' => $this->getPartners(),
            'cms'      => Content::for('home')->toShare(),
            'seo'      => [
                'title'       => 'From school to opportunity · Good Kenyan Foundation',
                'description' => 'Good Kenyan Foundation equips young Kenyans with skills, mentorship and clear pathways from school into work, further study or entrepreneurship.',
            ],
        ]);
    }

    public function about()
    {
        return Inertia::render('About', [
            'cms' => Content::for('about')->toShare(),
            'seo' => [
                'title'       => 'About us · Good Kenyan Foundation',
                'description' => 'A Kenyan led organisation serving youth, founded in 2017 in Eldoret and Nairobi.',
            ],
        ]);
    }

    public function ourModel()
    {
        return Inertia::render('OurModel', [
            'cms' => Content::for('our-model')->toShare(),
            'seo' => [
                'title'       => 'Our model · Discover, Develop, Launch · Good Kenyan Foundation',
                'description' => 'Three interconnected stages — Discover, Develop and Launch — form one structured journey from self-discovery to economic participation for Kenyan youth.',
            ],
        ]);
    }

    public function reginaYego()
    {
        return Inertia::render('ReginaYego', [
            'cms' => Content::for('regina-yego')->toShare(),
            'seo' => [
                'title'       => 'Regina Yego Girls Center · Good Kenyan Foundation',
                'description' => 'Our first center, home to the Daraja programme, in Mile 13 Juakali, Eldoret.',
            ],
        ]);
    }

    public function stawi()
    {
        return Inertia::render('Stawi', [
            'cms' => Content::for('stawi')->toShare(),
            'seo' => [
                'title'       => 'Stawi Enterprises · Good Studio & Good Connect · Good Kenyan Foundation',
                'description' => 'Buy good work and fund a livelihood. Good Studio delivers events, design and products with a traceable story; Good Connect provides customer experience from Kenya.',
            ],
        ]);
    }

    public function partners()
    {
        return Inertia::render('Partners', [
            'partners' => $this->getPartners(),
            'cms'      => Content::for('partners')->toShare(),
            'seo'      => [
                'title'       => 'Partners · Good Kenyan Foundation',
                'description' => 'Meet the organisations that walk with Good Kenyan Foundation — funding, mentoring and opening pathways for young Kenyans from school to opportunity.',
            ],
        ]);
    }

    public function getInvolved()
    {
        return Inertia::render('GetInvolved', [
            'cms' => Content::for('get-involved')->toShare(),
            'seo' => [
                'title'       => 'Get involved · Good Kenyan Foundation',
                'description' => 'Donate, mentor, fund a scholarship, or apply to the next intake.',
            ],
        ]);
    }

    public function contact(Request $request)
    {
        return Inertia::render('Contact', [
            'topic' => (string) $request->query('topic', ''),
            'cms'   => Content::for('contact')->toShare(),
            'seo' => [
                'title'       => 'Contact us · Good Kenyan Foundation',
                'description' => 'Get in touch with Good Kenyan Foundation in Eldoret or Nairobi. Email, call or message us — we reply within two working days.',
            ],
        ]);
    }

    protected function getPartners()
    {
        return Partner::active()->get()->map(fn ($p) => [
            'name' => $p->name,
            'logo' => $p->logo_url,
            'url'  => $p->url,
        ]);
    }

    protected function transformStory(Post $p): array
    {
        return [
            'slug'         => $p->slug,
            'title'        => $p->title,
            'excerpt'      => $p->excerpt,
            'hero_image'   => $p->hero_image,
            'hero_url'     => $p->hero_url,
            'published_at' => optional($p->published_at)->toIso8601String(),
        ];
    }
}
