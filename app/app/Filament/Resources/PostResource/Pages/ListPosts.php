<?php

namespace App\Filament\Resources\PostResource\Pages;

use App\Filament\Resources\PostResource;
use Filament\Resources\Pages\ListRecords;

class ListPosts extends ListRecords
{
    protected static string $resource = PostResource::class;

    public function getBreadcrumbs(): array
    {
        return [url('/admin') => 'Dashboard', '#' => 'Blog', 'Stories'];
    }

    public function getSubheading(): ?string
    {
        return 'Add, edit and schedule stories. Changes go live instantly.';
    }
}
