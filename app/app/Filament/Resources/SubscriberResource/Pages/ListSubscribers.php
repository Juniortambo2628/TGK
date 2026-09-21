<?php

namespace App\Filament\Resources\SubscriberResource\Pages;

use App\Filament\Resources\SubscriberResource;
use App\Filament\Resources\Concerns\HasResourceBreadcrumbs;
use Filament\Resources\Pages\ListRecords;

class ListSubscribers extends ListRecords
{
    use HasResourceBreadcrumbs;

    protected static string $resource = SubscriberResource::class;

    protected static ?string $breadcrumbLabel = 'Newsletter subscribers';

    public function getSubheading(): ?string
    {
        return 'Export the list any time. We only collect email + timestamp.';
    }
}
