<?php

namespace App\Filament\Resources\MentorApplicationResource\Pages;

use App\Filament\Resources\MentorApplicationResource;
use App\Filament\Resources\Concerns\HasResourceBreadcrumbs;
use Filament\Resources\Pages\ListRecords;

class ListMentorApplications extends ListRecords
{
    use HasResourceBreadcrumbs;

    protected static string $resource = MentorApplicationResource::class;

    public function getSubheading(): ?string
    {
        return 'People who want to give a few hours a month.';
    }
}
