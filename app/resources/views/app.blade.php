<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#FB2436" />

    {{-- Server-rendered SEO for perfect crawlability --}}
    @php
        $seo = $page['props']['seo'] ?? [];
        $title = $seo['title'] ?? config('app.name');
        $description = $seo['description'] ?? 'Good Kenyan Foundation equips young people with the skills, mentorship and pathways to move from education into work or entrepreneurship.';
        $canonical = $seo['canonical'] ?? url()->current();
        $ogImage = $seo['og_image'] ?? asset('images/social-card.jpg');
        $type = $seo['type'] ?? 'website';
    @endphp

    <title>{{ $title }}</title>
    <meta name="description" content="{{ $description }}" />
    <link rel="canonical" href="{{ $canonical }}" />

    <meta property="og:site_name" content="Good Kenyan Foundation" />
    <meta property="og:type" content="{{ $type }}" />
    <meta property="og:title" content="{{ $title }}" />
    <meta property="og:description" content="{{ $description }}" />
    <meta property="og:url" content="{{ $canonical }}" />
    <meta property="og:image" content="{{ $ogImage }}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{{ $title }}" />
    <meta name="twitter:description" content="{{ $description }}" />
    <meta name="twitter:image" content="{{ $ogImage }}" />

    @php
        $favicon = $page['props']['site']['favicon'] ?? asset('images/favicon-192.png');
    @endphp
    <link rel="icon" type="image/png" sizes="192x192" href="{{ $favicon }}" />
    <link rel="icon" type="image/png" href="{{ $favicon }}" />
    <link rel="apple-touch-icon" sizes="180x180" href="{{ $page['props']['site']['logo'] ?? asset('images/apple-touch-icon.png') }}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <script type="application/ld+json">
    {!! json_encode([
        '@context' => 'https://schema.org',
        '@type' => 'NonProfit',
        'name' => 'Good Kenyan Foundation',
        'url' => config('app.url'),
        'logo' => asset('images/tgkf-logo.png'),
        'sameAs' => [
            'https://www.facebook.com/GoodKenyann/',
            'https://www.instagram.com/goodkenyann/',
            'https://x.com/GoodKenyann',
        ],
        'contactPoint' => [
            '@type' => 'ContactPoint',
            'email' => 'lucy.chepchumba@goodkenyan.org',
            'contactType' => 'customer service',
            'areaServed' => 'KE',
        ],
    ], JSON_UNESCAPED_SLASHES) !!}
    </script>

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="antialiased">
    @inertia
</body>
</html>
