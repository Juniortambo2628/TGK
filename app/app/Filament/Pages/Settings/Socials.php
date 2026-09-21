<?php

namespace App\Filament\Pages\Settings;

use App\Filament\Pages\Concerns\SettingsEditor;
use Filament\Actions\Action;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Pages\Page;

class Socials extends Page implements HasForms
{
    use InteractsWithForms;
    use SettingsEditor;

    protected static ?string $navigationIcon = 'heroicon-o-share';
    protected static ?string $navigationGroup = 'Settings';
    protected static ?string $navigationLabel = 'Social profiles';
    protected static ?int $navigationSort = 3;
    protected static string $view = 'filament.pages.settings-form';
    protected static ?string $title = 'Social profiles';

    protected static array $settingKeys = [
        'social_facebook', 'social_instagram', 'social_x', 'social_linkedin', 'social_youtube',
    ];

    public function form(Form $form): Form
    {
        return $form
            ->statePath('data')
            ->schema([
                Section::make('Profile URLs')
                    ->description('Full URL to each account. Leave blank to hide the icon in the footer.')
                    ->schema([
                        TextInput::make('social_facebook')->label('Facebook')->url()->placeholder('https://facebook.com/GoodKenyann'),
                        TextInput::make('social_instagram')->label('Instagram')->url()->placeholder('https://instagram.com/goodkenyann'),
                        TextInput::make('social_x')->label('X (Twitter)')->url()->placeholder('https://x.com/GoodKenyann'),
                        TextInput::make('social_linkedin')->label('LinkedIn')->url()->placeholder('https://linkedin.com/company/goodkenyann'),
                        TextInput::make('social_youtube')->label('YouTube')->url()->placeholder('https://youtube.com/@goodkenyan'),
                    ])->columns(2),
            ]);
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')->label('Save changes')->color('primary')->submit('save'),
        ];
    }
}
