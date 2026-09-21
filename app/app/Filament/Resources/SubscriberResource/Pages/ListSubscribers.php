<?php

namespace App\Filament\Resources\SubscriberResource\Pages;

use App\Filament\Resources\SubscriberResource;
use Filament\Resources\Pages\ListRecords;

class ListSubscribers extends ListRecords
{
    protected static string $resource = SubscriberResource::class;

    public function getBreadcrumbs(): array
    {
        return [url('/admin') => 'Dashboard', '#' => 'Submissions', 'Newsletter subscribers'];
    }

    public function getSubheading(): ?string
    {
        return 'Export the list any time. We only collect email + timestamp.';
    }
}
