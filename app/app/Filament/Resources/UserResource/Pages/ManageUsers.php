<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use App\Filament\Resources\Concerns\HasResourceBreadcrumbs;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageUsers extends ManageRecords
{
    use HasResourceBreadcrumbs;

    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->label('New User Account')
                ->modalHeading('Create User Account')
                ->modalWidth('5xl')
                ->successNotificationTitle('User Account Created'),
        ];
    }
}
