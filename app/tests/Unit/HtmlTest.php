<?php

namespace Tests\Unit;

use App\Support\Html;
use PHPUnit\Framework\TestCase;

class HtmlTest extends TestCase
{
    public function test_plain_text_is_wrapped_into_paragraphs(): void
    {
        $out = Html::paragraphs("First paragraph.\n\nSecond paragraph.");

        $this->assertStringContainsString('<p>First paragraph.</p>', $out);
        $this->assertStringContainsString('<p>Second paragraph.</p>', $out);
    }

    public function test_single_newlines_become_line_breaks(): void
    {
        $out = Html::paragraphs("Line one\nLine two");

        $this->assertStringContainsString('<br', $out);
    }

    public function test_existing_html_is_preserved_not_escaped(): void
    {
        $out = Html::paragraphs('<p>Already <strong>rich</strong>.</p>');

        $this->assertStringContainsString('<p>Already <strong>rich</strong>.</p>', $out);
        // Must not double-escape into visible tags.
        $this->assertStringNotContainsString('&lt;p&gt;', $out);
    }

    public function test_dangerous_markup_is_stripped(): void
    {
        $out = Html::paragraphs('<p>ok</p><script>alert(1)</script>');

        $this->assertStringNotContainsString('<script', $out);
    }

    public function test_empty_input_returns_empty_string(): void
    {
        $this->assertSame('', Html::paragraphs(null));
        $this->assertSame('', Html::paragraphs('   '));
    }
}
