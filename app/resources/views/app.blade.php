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
        $site = $page['props']['site'] ?? [];
        $title = $seo['title'] ?? config('app.name');
        $description = $seo['description'] ?? ($site['description'] ?? 'Good Kenyan Foundation equips young people with the skills, mentorship and pathways to move from education into work or entrepreneurship.');
        $canonical = $seo['canonical'] ?? url()->current();
        $ogImage = $seo['og_image'] ?? ($site['social_card'] ?? asset('images/social-card.png'));
        $type = $seo['type'] ?? 'website';
        $siteName = $site['name'] ?? config('app.name');
        $twitterSite = $site['social']['x'] ?? null;
        $robots = $seo['robots'] ?? null;
    @endphp

    <title>{{ $title }}</title>
    <meta name="description" content="{{ $description }}" />
    @if($robots)
    <meta name="robots" content="{{ $robots }}" />
    @endif
    <link rel="canonical" href="{{ $canonical }}" />

    <meta property="og:site_name" content="{{ $siteName }}" />
    <meta property="og:type" content="{{ $type }}" />
    <meta property="og:title" content="{{ $title }}" />
    <meta property="og:description" content="{{ $description }}" />
    <meta property="og:url" content="{{ $canonical }}" />
    <meta property="og:image" content="{{ $ogImage }}" />
    <meta property="og:locale" content="en_KE" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{{ $title }}" />
    <meta name="twitter:description" content="{{ $description }}" />
    <meta name="twitter:image" content="{{ $ogImage }}" />
    @if($twitterSite)
    @php
        $handle = preg_replace('#^https?://(www\.)?x\.com/#', '@', $twitterSite);
        $handle = preg_replace('#^https?://(www\.)?twitter\.com/#', '@', rtrim($handle, '/'));
        $handle = str_starts_with($handle, '@') ? $handle : null;
    @endphp
    @if($handle)
    <meta name="twitter:site" content="{{ $handle }}" />
    @endif
    @endif

    @php
        $favicon = $site['favicon'] ?? asset('images/favicon-192.png');
    @endphp
    <link rel="icon" type="image/png" sizes="192x192" href="{{ $favicon }}" />
    <link rel="icon" type="image/png" href="{{ $favicon }}" />
    <link rel="apple-touch-icon" sizes="180x180" href="{{ $site['logo'] ?? asset('images/apple-touch-icon.png') }}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    @php
        $sameAs = array_values(array_filter([
            $site['social']['facebook'] ?? null,
            $site['social']['instagram'] ?? null,
            $site['social']['x'] ?? null,
            $site['social']['linkedin'] ?? null,
            $site['social']['youtube'] ?? null,
        ]));
        $siteJsonLd = [
            '@context' => 'https://schema.org',
            '@type' => 'NonprofitOrganization',
            'name' => $siteName,
            'url' => config('app.url'),
            'logo' => $site['logo'] ?? asset('images/tgkf-logo.png'),
            'description' => $site['description'] ?? null,
        ];
        if ($sameAs) {
            $siteJsonLd['sameAs'] = $sameAs;
        }
        if (!empty($site['contact']['email'])) {
            $siteJsonLd['contactPoint'] = [
                '@type' => 'ContactPoint',
                'email' => $site['contact']['email'],
                'contactType' => 'customer service',
                'areaServed' => 'KE',
            ];
        }
        $siteJsonLd = array_filter($siteJsonLd, fn ($v) => $v !== null && $v !== '');
        $pageJsonLd = $seo['json_ld'] ?? [];
        if (!is_array($pageJsonLd)) {
            $pageJsonLd = [$pageJsonLd];
        }
        $allJsonLd = array_merge([$siteJsonLd], array_values($pageJsonLd));
    @endphp
    @foreach($allJsonLd as $ld)
    <script type="application/ld+json">
    {!! json_encode($ld, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
    </script>
    @endforeach

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="antialiased">
    @inertia
</body>
</html>
