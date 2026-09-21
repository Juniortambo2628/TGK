<?php

namespace App\Filament\Pages\Concerns;

use App\Models\Setting;
use Filament\Notifications\Notification;

/**
 * Shared trait for every Site Settings custom page. Subclass gives us:
 *   - static $settingKeys (list of setting keys the page owns)
 *   - form(Form)         (matching field names to those keys)
 *
 * The trait handles hydration, save, notification and breadcrumbs.
 */
trait SettingsEditor
{
    public array $data = [];

    public function mount(): void
    {
        $state = [];
        foreach (static::$settingKeys as $key) {
            $state[$key] = Setting::get($key);
        }
        $this->form->fill($state);
    }

    public function save(): void
    {
        $state = $this->form->getState();
        foreach (static::$settingKeys as $key) {
            Setting::set($key, $state[$key] ?? null);
        }
        Notification::make()->success()->title('Saved')->body('Settings updated.')->send();
    }

    public function getBreadcrumbs(): array
    {
        return [
            url('/admin') => 'Dashboard',
            '#'           => 'Settings',
            static::getNavigationLabel(),
        ];
    }
}
