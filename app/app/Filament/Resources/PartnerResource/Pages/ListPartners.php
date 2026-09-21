<?php

namespace App\Filament\Resources\PartnerResource\Pages;

use App\Filament\Resources\PartnerResource;
use App\Filament\Resources\Concerns\HasResourceBreadcrumbs;
use Filament\Resources\Pages\ListRecords;

class ListPartners extends ListRecords
{
    use HasResourceBreadcrumbs;

    protected static string $resource = PartnerResource::class;

    public function getSubheading(): ?string
    {
        return 'Drag rows to reorder them on the public partners grid.';
    }
}
