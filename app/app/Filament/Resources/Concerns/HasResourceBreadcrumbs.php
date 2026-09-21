<?php

namespace App\Filament\Resources\Concerns;

/**
 * Shared "Dashboard › <group> › <label>" breadcrumb for every resource
 * list/manage page. Derives the trail from the resource's own metadata
 * ($navigationGroup + $pluralModelLabel / $navigationLabel), so adding a
 * new resource doesn't require copy-pasting another getBreadcrumbs()
 * array. Filament's ManageRecords base returns an empty array by default,
 * which is why we need this at all.
 */
trait HasResourceBreadcrumbs
{
    /**
     * Optional per-page override, e.g. "Programme registrations" when the
     * pluralModelLabel is the shorter "Registrations".
     */
    protected static ?string $breadcrumbLabel = null;

    public function getBreadcrumbs(): array
    {
        $resource = static::getResource();
        $group    = $resource::getNavigationGroup();
        $label    = static::$breadcrumbLabel
            ?: $resource::getPluralModelLabel()
            ?: $resource::getNavigationLabel();

        $trail = [url('/admin') => 'Dashboard'];
        if (filled($group)) {
            $trail['#'] = $group;
        }
        $trail[] = $label;

        return $trail;
    }
}
