<?php

namespace App\Filament\Resources\PartnerResource\Pages;

use App\Filament\Resources\PartnerResource;
use Filament\Resources\Pages\ListRecords;

class ListPartners extends ListRecords
{
    protected static string $resource = PartnerResource::class;

    public function getBreadcrumbs(): array
    {
        return [url('/admin') => 'Dashboard', '#' => 'People', 'Partners'];
    }

    public function getSubheading(): ?string
    {
        return 'Drag rows to reorder them on the public partners grid.';
    }
}
