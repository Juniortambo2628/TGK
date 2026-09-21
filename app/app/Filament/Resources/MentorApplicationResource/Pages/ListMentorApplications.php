<?php

namespace App\Filament\Resources\MentorApplicationResource\Pages;

use App\Filament\Resources\MentorApplicationResource;
use Filament\Resources\Pages\ListRecords;

class ListMentorApplications extends ListRecords
{
    protected static string $resource = MentorApplicationResource::class;

    public function getBreadcrumbs(): array
    {
        return [url('/admin') => 'Dashboard', '#' => 'Submissions', 'Mentor applications'];
    }

    public function getSubheading(): ?string
    {
        return 'People who want to give a few hours a month.';
    }
}
