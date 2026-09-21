<?php

namespace App\Filament\Resources\ScholarshipApplicationResource\Pages;

use App\Filament\Resources\ScholarshipApplicationResource;
use Filament\Resources\Pages\ListRecords;

class ListScholarshipApplications extends ListRecords
{
    protected static string $resource = ScholarshipApplicationResource::class;

    public function getBreadcrumbs(): array
    {
        return [url('/admin') => 'Dashboard', '#' => 'Submissions', 'Scholarship enquiries'];
    }

    public function getSubheading(): ?string
    {
        return 'People or organisations offering to fund a scholarship.';
    }
}
