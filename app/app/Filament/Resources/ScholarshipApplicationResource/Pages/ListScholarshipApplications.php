<?php

namespace App\Filament\Resources\ScholarshipApplicationResource\Pages;

use App\Filament\Resources\ScholarshipApplicationResource;
use App\Filament\Resources\Concerns\HasResourceBreadcrumbs;
use Filament\Resources\Pages\ListRecords;

class ListScholarshipApplications extends ListRecords
{
    use HasResourceBreadcrumbs;

    protected static string $resource = ScholarshipApplicationResource::class;

    public function getSubheading(): ?string
    {
        return 'People or organisations offering to fund a scholarship.';
    }
}
