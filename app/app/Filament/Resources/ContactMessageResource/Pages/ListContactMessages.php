<?php

namespace App\Filament\Resources\ContactMessageResource\Pages;

use App\Filament\Resources\ContactMessageResource;
use App\Filament\Resources\Concerns\HasResourceBreadcrumbs;
use Filament\Resources\Pages\ListRecords;

class ListContactMessages extends ListRecords
{
    use HasResourceBreadcrumbs;

    protected static string $resource = ContactMessageResource::class;

    public function getSubheading(): ?string
    {
        return 'Messages sent through the /contact form.';
    }
}
