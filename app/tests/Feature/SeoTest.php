<?php

namespace Tests\Feature;

use Tests\TestCase;

class SeoTest extends TestCase
{
    public function test_home_page_has_meta_and_org_json_ld(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('<title>', false);
        $response->assertSee('name="description"', false);
        $response->assertSee('rel="canonical"', false);
        $response->assertSee('property="og:title"', false);
        $response->assertSee('property="og:image"', false);
        $response->assertSee('NonprofitOrganization', false);
        $response->assertDontSee('"@type":"NonProfit"', false);
    }

    public function test_story_page_has_article_and_breadcrumb_json_ld(): void
    {
        $slug = \App\Models\Post::published()->first()?->slug;
        if (! $slug) {
            $this->markTestSkipped('No published stories seeded.');
        }

        $response = $this->get('/stories/'.$slug);

        $response->assertOk();
        $response->assertSee('application/ld+json', false);
        $response->assertSee('BreadcrumbList', false);
        $response->assertSee('Article', false);
        $response->assertSee('mainEntityOfPage', false);
    }

    public function test_robots_txt_has_absolute_sitemap_url(): void
    {
        $response = $this->get('/robots.txt');

        $response->assertOk();
        $response->assertSee('Sitemap: '.config('app.url').'/sitemap.xml', false);
    }

    public function test_sitemap_returns_xml(): void
    {
        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
        $response->assertSee('<?xml', false);
        $response->assertSee('<urlset', false);
    }

    public function test_404_page_has_noindex_seo(): void
    {
        $response = $this->get('/this-page-does-not-exist-seo-test');

        $response->assertStatus(404);
        $response->assertSee('noindex', false);
        $response->assertSee('Page not found', false);
    }
}
