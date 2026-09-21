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

class StawiPage extends Page implements HasForms
{
    use InteractsWithForms;
    use ContentEditorPage;

    protected static ?string $navigationIcon = 'heroicon-o-briefcase';
    protected static ?string $navigationGroup = 'Content';
    protected static ?string $navigationLabel = 'Stawi Enterprises page';
    protected static ?int $navigationSort = 5;
    protected static string $view = 'filament.pages.content-form';
    protected static ?string $title = 'Stawi Enterprises page';
    public string $publicPath = '/stawi';
    protected static string $pageSlug = 'stawi';

    protected function contentKeys(): array
    {
        return [
            'hero.eyebrow' => 'string', 'hero.title' => 'string', 'hero.subtitle' => 'string',
            'hero.images' => 'gallery',
            'studio.eyebrow' => 'string', 'studio.title' => 'string', 'studio.body' => 'string',
            'studio.services' => 'array', 'studio.gallery' => 'gallery',
            'connect.eyebrow' => 'string', 'connect.title' => 'string', 'connect.body' => 'string',
            'connect.services' => 'array', 'connect.gallery' => 'gallery',
            'products' => 'array',
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
                    FC::imageGallery($this->stateKey('hero.images'), 'stawi', 'Hero background(s)')->columnSpanFull(),
                ])->columns(2),

                Tabs\Tab::make('Good Studio')->schema([
                    TextInput::make($this->stateKey('studio.eyebrow')),
                    TextInput::make($this->stateKey('studio.title')),
                    FC::richText($this->stateKey('studio.body'), 'Body')->columnSpanFull(),
                    Repeater::make($this->stateKey('studio.services'))
                        ->label('Service list')->schema([TextInput::make('item')->required()])
                        ->addActionLabel('Add service')->reorderable()->columnSpanFull(),
                    FC::imageGallery($this->stateKey('studio.gallery'), 'studio', 'Studio images')->columnSpanFull(),
                ])->columns(2),

                Tabs\Tab::make('Good Connect')->schema([
                    TextInput::make($this->stateKey('connect.eyebrow')),
                    TextInput::make($this->stateKey('connect.title')),
                    FC::richText($this->stateKey('connect.body'), 'Body')->columnSpanFull(),
                    Repeater::make($this->stateKey('connect.services'))
                        ->label('Service list')->schema([TextInput::make('item')->required()])
                        ->addActionLabel('Add service')->reorderable()->columnSpanFull(),
                    FC::imageGallery($this->stateKey('connect.gallery'), 'connect', 'Connect images')->columnSpanFull(),
                ])->columns(2),

                Tabs\Tab::make('Selected work (products)')->schema([
                    Repeater::make($this->stateKey('products'))
                        ->label('Products for the gallery + lightbox')
                        ->schema([
                            TextInput::make('slug')->required()->maxLength(80),
                            TextInput::make('name')->required()->maxLength(120),
                            Textarea::make('blurb')->rows(2)->maxLength(400)->columnSpanFull(),
                            Repeater::make('details')->label('Bullet details')
                                ->schema([TextInput::make('item')->required()])
                                ->addActionLabel('Add bullet')->reorderable()->columnSpanFull(),
                            FC::imageGallery('images', 'products', 'Product images')->columnSpanFull(),
                        ])
                        ->columns(2)
                        ->itemLabel(fn (array $state): ?string => $state['name'] ?? null)
                        ->collapsible()->reorderable()->columnSpanFull(),
                ]),
            ])->persistTabInQueryString(),
        ]);
    }

    protected function getFormActions(): array
    {
        return [Action::make('save')->label('Save changes')->color('primary')->submit('save')];
    }
}
