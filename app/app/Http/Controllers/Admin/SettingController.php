<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function edit(?string $tab = null)
    {
        return Inertia::render('Admin/Settings', [
            'tab' => $tab ?? 'identity',
            'settings' => [
                'identity' => [
                    'site_name' => Setting::get('site_name', 'Good Kenyan Foundation'),
                    'tagline' => Setting::get('tagline', ''),
                    'short_description' => Setting::get('short_description', ''),
                    'logo_wordmark' => Setting::get('logo_wordmark', ''),
                    'logo_favicon' => Setting::get('logo_favicon', ''),
                    'logo_social' => Setting::get('logo_social', ''),
                ],
                'contact' => [
                    'contact_email' => Setting::get('contact_email', ''),
                    'contact_phone' => Setting::get('contact_phone', ''),
                    'notify_email' => Setting::get('notify_email', ''),
                    'address_eldoret' => Setting::get('address_eldoret', ''),
                    'address_nairobi' => Setting::get('address_nairobi', ''),
                    'donate_url' => Setting::get('donate_url', ''),
                ],
                'socials' => [
                    'social_facebook' => Setting::get('social_facebook', ''),
                    'social_instagram' => Setting::get('social_instagram', ''),
                    'social_x' => Setting::get('social_x', ''),
                    'social_linkedin' => Setting::get('social_linkedin', ''),
                    'social_youtube' => Setting::get('social_youtube', ''),
                ],
            ],
        ]);
    }

    public function update(Request $request)
    {
        $tab = $request->input('tab', 'identity');

        $fields = match ($tab) {
            'identity' => ['site_name', 'tagline', 'short_description', 'logo_wordmark', 'logo_favicon', 'logo_social'],
            'contact' => ['contact_email', 'contact_phone', 'notify_email', 'address_eldoret', 'address_nairobi', 'donate_url'],
            'socials' => ['social_facebook', 'social_instagram', 'social_x', 'social_linkedin', 'social_youtube'],
            default => [],
        };

        $data = $request->validate(array_fill_keys($fields, 'nullable|string'));

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        return back()->with('success', 'Settings saved.');
    }
}
