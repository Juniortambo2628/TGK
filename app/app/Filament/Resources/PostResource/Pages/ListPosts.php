<?php

namespace App\Filament\Resources\PostResource\Pages;

use App\Filament\Resources\PostResource;
use App\Filament\Resources\Concerns\HasResourceBreadcrumbs;
use Filament\Resources\Pages\ListRecords;

class ListPosts extends ListRecords
{
    use HasResourceBreadcrumbs;

    protected static string $resource = PostResource::class;

    public function getSubheading(): ?string
    {
        return 'Add, edit and schedule stories. Changes go live instantly.';
    }
}
