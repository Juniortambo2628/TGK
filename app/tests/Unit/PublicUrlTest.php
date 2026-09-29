<?php

namespace Tests\Unit;

use App\Support\PublicUrl;
use PHPUnit\Framework\TestCase;

class PublicUrlTest extends TestCase
{
    public function test_bare_filename_gets_prefixed(): void
    {
        $this->assertSame('images/stories/isabel.jpg', PublicUrl::relative('isabel.jpg', 'images/stories/'));
    }

    public function test_upload_and_image_paths_pass_through(): void
    {
        $this->assertSame('uploads/library/x.webp', PublicUrl::relative('uploads/library/x.webp', 'images/stories/'));
        $this->assertSame('images/stories/x.jpg', PublicUrl::relative('images/stories/x.jpg', 'images/stories/'));
        $this->assertSame('images/stories/x.jpg', PublicUrl::relative('/images/stories/x.jpg', 'images/stories/'));
    }

    public function test_absolute_urls_pass_through_unchanged(): void
    {
        $url = 'https://cdn.example.com/a.jpg';
        $this->assertSame($url, PublicUrl::relative($url, 'images/stories/'));
    }

    public function test_empty_returns_null(): void
    {
        $this->assertNull(PublicUrl::relative('', 'images/stories/'));
        $this->assertNull(PublicUrl::relative(null, 'images/stories/'));
    }
}
