<?php

namespace App\Filament\Pages\Settings;

use App\Filament\Pages\Concerns\SettingsEditor;
use Filament\Actions\Action;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Pages\Page;

class Contact extends Page implements HasForms
{
    use InteractsWithForms;
    use SettingsEditor;

    protected static ?string $navigationIcon = 'heroicon-o-at-symbol';
    protected static ?string $navigationGroup = 'Settings';
    protected static ?string $navigationLabel = 'Contact details';
    protected static ?int $navigationSort = 2;
    protected static string $view = 'filament.pages.settings-form';
    protected static ?string $title = 'Contact details';

    protected static array $settingKeys = [
        'contact_email', 'contact_phone', 'notify_email',
        'address_eldoret', 'address_nairobi',
        'donate_url',
    ];

    public function form(Form $form): Form
    {
        return $form
            ->statePath('data')
            ->schema([
                Section::make('Public contact')
                    ->description('These appear on the /contact page and in the footer.')
                    ->schema([
                        TextInput::make('contact_email')->email()->maxLength(120)->placeholder('lucy.chepchumba@goodkenyan.org'),
                        TextInput::make('contact_phone')->tel()->maxLength(40)->placeholder('+254 708 020 530'),
                        Textarea::make('address_eldoret')->rows(2)->maxLength(200)->placeholder('Regina Yego Girls Center, Mile 13 Juakali, Eldoret'),
                        Textarea::make('address_nairobi')->rows(2)->maxLength(200)->placeholder('PO Box 15137, 00100 Nairobi, Kenya'),
                    ])->columns(2),

                Section::make('Operations')
                    ->description('Where the site sends form submissions, and where the Donate button links.')
                    ->schema([
                        TextInput::make('notify_email')->email()->maxLength(120)
                            ->helperText('Contact, mentor and registration submissions are emailed here.'),
                        TextInput::make('donate_url')->url()->maxLength(300)
                            ->helperText('The URL every Donate button on the site links to.'),
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
