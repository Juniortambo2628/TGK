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
     * pluralModelLabel is the shorter "Registrations". Pages override this
     * method rather than a shared property (PHP forbids a trait and its
     * consumer both declaring the same property with different defaults).
     */
    protected function getBreadcrumbLabel(): ?string
    {
        return null;
    }

    public function getBreadcrumbs(): array
    {
        $resource = static::getResource();
        $group    = $resource::getNavigationGroup();
        $label    = $this->getBreadcrumbLabel()
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
