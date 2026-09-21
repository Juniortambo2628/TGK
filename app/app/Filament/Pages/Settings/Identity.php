<?php

namespace App\Filament\Pages\Settings;

use App\Filament\Pages\Concerns\SettingsEditor;
use App\Filament\Support\FormComponents as FC;
use Filament\Actions\Action;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Pages\Page;

class Identity extends Page implements HasForms
{
    use InteractsWithForms;
    use SettingsEditor;

    protected static ?string $navigationIcon = 'heroicon-o-identification';
    protected static ?string $navigationGroup = 'Settings';
    protected static ?string $navigationLabel = 'Identity';
    protected static ?int $navigationSort = 1;
    protected static string $view = 'filament.pages.settings-form';
    protected static ?string $title = 'Brand identity';

    protected static array $settingKeys = [
        'site_name', 'tagline', 'short_description',
        'logo_wordmark', 'logo_favicon', 'logo_social',
    ];

    public function form(Form $form): Form
    {
        return $form
            ->statePath('data')
            ->schema([
                Section::make('Words')
                    ->description('The name and tagline that appear across the site.')
                    ->schema([
                        TextInput::make('site_name')->maxLength(80)->placeholder('Good Kenyan Foundation'),
                        TextInput::make('tagline')->maxLength(140)->placeholder('From school to opportunity.'),
                        Textarea::make('short_description')->rows(3)->maxLength(300)
                            ->helperText('Used as the default meta description and social share text.'),
                    ]),

                Section::make('Marks')
                    ->description('Upload the brand mark files. Transparent PNG or SVG works best.')
                    ->schema([
                        FC::imageUpload('logo_wordmark', 'brand', 'Wordmark')
                            ->helperText('Shown in the navigation and footer. Wide, transparent PNG.'),
                        FC::imageUpload('logo_favicon', 'brand', 'Favicon / square icon')
                            ->helperText('Square. Used as favicon and social icon.'),
                        FC::imageUpload('logo_social', 'brand', 'Social share image')
                            ->helperText('Recommended 1200×630. Used for OG/Twitter cards.'),
                    ])->columns(3),
            ]);
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')->label('Save changes')->color('primary')->submit('save'),
        ];
    }
}
