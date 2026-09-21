<?php

namespace App\Filament\Resources\RegistrationResource\Pages;

use App\Filament\Resources\RegistrationResource;
use App\Filament\Resources\Concerns\HasResourceBreadcrumbs;
use Filament\Resources\Pages\ListRecords;

class ListRegistrations extends ListRecords
{
    use HasResourceBreadcrumbs;

    protected static string $resource = RegistrationResource::class;

    protected function getBreadcrumbLabel(): ?string
    {
        return 'Programme registrations';
    }

    public function getSubheading(): ?string
    {
        return 'Young people applying to a Msingi, Imarisha, Stawi or Daraja cohort.';
    }
}
