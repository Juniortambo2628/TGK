<?php

namespace App\Filament\Pages\Auth;

use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Auth\EditProfile as BaseEditProfile;
use Filament\Support\Enums\MaxWidth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class EditProfile extends BaseEditProfile
{
    protected static ?string $slug = 'profile';

    public function getMaxContentWidth(): MaxWidth
    {
        return MaxWidth::ThreeExtraLarge;
    }

    public static function getLabel(): string
    {
        return 'Profile Settings';
    }

    public function getTitle(): string
    {
        return 'Profile Settings';
    }

    public function getHeading(): string
    {
        return 'Profile Settings';
    }

    public function getBreadcrumbs(): array
    {
        return [
            url('/admin') => 'Dashboard',
            '#'           => 'Settings',
            'Profile Settings',
        ];
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Personal Details')
                    ->description('Update your account details and contact email.')
                    ->schema([
                        $this->getNameFormComponent(),
                        $this->getEmailFormComponent(),
                    ])
                    ->columns(2),

                Section::make('Update Password')
                    ->description('Ensure your account is using a secure password. Leave blank to keep current password.')
                    ->schema([
                        TextInput::make('password')
                            ->label('New Password')
                            ->password()
                            ->revealable()
                            ->rule(Password::default())
                            ->autocomplete('new-password')
                            ->dehydrated(fn ($state): bool => filled($state))
                            ->dehydrateStateUsing(fn ($state): string => Hash::make($state))
                            ->same('passwordConfirmation'),

                        TextInput::make('passwordConfirmation')
                            ->label('Confirm New Password')
                            ->password()
                            ->revealable()
                            ->requiredWith('password')
                            ->dehydrated(false),
                    ])
                    ->columns(2),
            ]);
    }

    protected function getSavedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('Profile Updated')
            ->body('Your personal details and password have been saved.');
    }
}
