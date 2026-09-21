<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageUsers extends ManageRecords
{
    protected static string $resource = UserResource::class;

    public function getBreadcrumbs(): array
    {
        return [url('/admin') => 'Dashboard', '#' => 'Settings', 'User Accounts'];
    }

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
