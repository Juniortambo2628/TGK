<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'appName' => config('app.name'),

            // Kept for backwards compatibility with existing components
            'donateUrl' => fn () => Setting::get('donate_url', env('DONATE_URL', '#')),

            // Everything the layout/footer/nav needs, driven from Settings.
            'site' => fn () => [
                'name'         => Setting::get('site_name', config('app.name')),
                'tagline'      => Setting::get('tagline', 'From school to opportunity.'),
                'description'  => Setting::get('short_description', 'Good Kenyan Foundation equips young people with the skills, mentorship and pathways to move from education into work or entrepreneurship.'),
                'logo'         => self::assetOr('logo_wordmark', asset('images/tgkf-logo.png')),
                'favicon'      => self::assetOr('logo_favicon', asset('images/favicon-192.png')),
                'social_card'  => self::assetOr('logo_social', asset('images/social-card.png')),
                'contact' => [
                    'email' => Setting::get('contact_email', 'lucy.chepchumba@goodkenyan.org'),
                    'phone' => Setting::get('contact_phone', '+254 708 020 530'),
                    'eldoret' => Setting::get('address_eldoret', 'Regina Yego Girls Center, Mile 13 Juakali, Eldoret'),
                    'nairobi' => Setting::get('address_nairobi', 'PO Box 15137, 00100 Nairobi, Kenya'),
                ],
                'social' => array_filter([
                    'facebook' => Setting::get('social_facebook', 'https://www.facebook.com/GoodKenyann/'),
                    'instagram' => Setting::get('social_instagram', 'https://www.instagram.com/goodkenyann/'),
                    'x' => Setting::get('social_x', 'https://x.com/GoodKenyann'),
                    'linkedin' => Setting::get('social_linkedin'),
                    'youtube' => Setting::get('social_youtube'),
                ]),
                'donateUrl' => Setting::get('donate_url', env('DONATE_URL', '#')),
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }

    /**
     * Return the asset URL for a Setting-stored upload, or a fallback.
     * Uploads from Filament come back as either "uploads/…jpg" or a full path.
     */
    protected static function assetOr(string $key, string $fallback): string
    {
        $value = Setting::get($key);
        if (! $value) return $fallback;
        // If we stored a filepond upload path (a plain string or a single-item array)
        if (is_array($value)) $value = reset($value) ?: null;
        if (! is_string($value) || $value === '') return $fallback;
        if (str_starts_with($value, 'http')) return $value;
        if (str_starts_with($value, 'uploads/')) return asset('storage/'.$value);
        return asset($value);
    }
}
