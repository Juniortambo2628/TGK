<?php

namespace App\Filament\Resources\RegistrationResource\Pages;

use App\Filament\Resources\RegistrationResource;
use Filament\Resources\Pages\ListRecords;

class ListRegistrations extends ListRecords
{
    protected static string $resource = RegistrationResource::class;

    public function getBreadcrumbs(): array
    {
        return [url('/admin') => 'Dashboard', '#' => 'Submissions', 'Programme registrations'];
    }

    public function getSubheading(): ?string
    {
        return 'Young people applying to a Msingi, Imarisha, Stawi or Daraja cohort.';
    }
}
