<?php

namespace App\Filament\Pages\Content;

use App\Filament\Pages\Concerns\ContentEditorPage;
use App\Filament\Support\FormComponents as FC;
use Filament\Actions\Action;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Pages\Page;

class OurModelPage extends Page implements HasForms
{
    use InteractsWithForms;
    use ContentEditorPage;

    protected static ?string $navigationIcon = 'heroicon-o-arrow-path';
    protected static ?string $navigationGroup = 'Content';
    protected static ?string $navigationLabel = 'Our Model page';
    protected static ?int $navigationSort = 3;
    protected static string $view = 'filament.pages.content-form';
    protected static ?string $title = 'Our Model page';
    public string $publicPath = '/our-model';
    protected static string $pageSlug = 'our-model';

    protected function contentKeys(): array
    {
        return [
            'hero.eyebrow' => 'string', 'hero.title' => 'string', 'hero.subtitle' => 'string',
            'hero.images' => 'gallery',
            'stages' => 'array',
            'daraja.eyebrow' => 'string', 'daraja.title' => 'string', 'daraja.body' => 'string',
            'daraja.image' => 'gallery',
        ];
    }

    public function form(Form $form): Form
    {
        return $form->statePath('data')->schema([
            Tabs::make()->tabs([
                Tabs\Tab::make('Hero')->schema([
                    TextInput::make($this->stateKey('hero.eyebrow')),
                    TextInput::make($this->stateKey('hero.title')),
                    Textarea::make($this->stateKey('hero.subtitle'))->rows(3)->columnSpanFull(),
                    FC::imageGallery($this->stateKey('hero.images'), 'model', 'Hero background(s)')->columnSpanFull(),
                ])->columns(2),

                Tabs\Tab::make('Three stages')->schema([
                    Repeater::make($this->stateKey('stages'))
                        ->label('Msingi / Imarisha / Stawi')
                        ->schema([
                            TextInput::make('stage')->label('Stage')->placeholder('Discover / Develop / Launch')->required(),
                            TextInput::make('name')->required()->placeholder('Msingi'),
                            TextInput::make('swahili')->placeholder('Foundation'),
                            TextInput::make('duration')->placeholder('6 weeks')->required(),
                            Textarea::make('description')->rows(3)->required()->columnSpanFull(),
                            TextInput::make('exit')->placeholder('Certificate in Digital Skills…')->columnSpanFull(),
                        ])
                        ->columns(2)
                        ->itemLabel(fn (array $state): ?string => $state['name'] ?? null)
                        ->collapsible()
                        ->reorderable()
                        ->maxItems(4)
                        ->columnSpanFull(),
                ]),

                Tabs\Tab::make('Daraja upstream')->schema([
                    TextInput::make($this->stateKey('daraja.eyebrow')),
                    TextInput::make($this->stateKey('daraja.title')),
                    FC::richText($this->stateKey('daraja.body'), 'Body')->columnSpanFull(),
                    FC::imageGallery($this->stateKey('daraja.image'), 'model', 'Supporting image')->columnSpanFull(),
                ])->columns(2),
            ])->persistTabInQueryString(),
        ]);
    }

    protected function getFormActions(): array
    {
        return [Action::make('save')->label('Save changes')->color('primary')->submit('save')];
    }
}
