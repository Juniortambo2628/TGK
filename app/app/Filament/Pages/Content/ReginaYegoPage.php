<?php

namespace App\Filament\Pages\Content;

use App\Filament\Pages\Concerns\ContentEditorPage;
use App\Filament\Support\FormComponents as FC;
use Filament\Actions\Action;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Pages\Page;

class ReginaYegoPage extends Page implements HasForms
{
    use InteractsWithForms;
    use ContentEditorPage;

    protected static ?string $navigationIcon = 'heroicon-o-heart';
    protected static ?string $navigationGroup = 'Content';
    protected static ?string $navigationLabel = 'Regina Yego page';
    protected static ?int $navigationSort = 4;
    protected static string $view = 'filament.pages.content-form';
    protected static ?string $title = 'Regina Yego Girls Center';
    public string $publicPath = '/regina-yego';
    protected static string $pageSlug = 'regina-yego';

    protected function contentKeys(): array
    {
        return [
            'hero.eyebrow' => 'string', 'hero.title' => 'string', 'hero.subtitle' => 'string',
            'hero.images' => 'gallery',
            'who.eyebrow' => 'string', 'who.title' => 'string', 'who.body' => 'string',
            'stats' => 'stats',
            'growing.title' => 'string', 'growing.body' => 'string',
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
                    FC::imageGallery($this->stateKey('hero.images'), 'regina-yego', 'Hero background(s)')->columnSpanFull(),
                ])->columns(2),
                Tabs\Tab::make('Who we serve')->schema([
                    TextInput::make($this->stateKey('who.eyebrow')),
                    TextInput::make($this->stateKey('who.title')),
                    FC::richText($this->stateKey('who.body'), 'Body')->columnSpanFull(),
                ])->columns(2),
                Tabs\Tab::make('Stats')->schema([
                    FC::statsRepeater($this->stateKey('stats'), 'Center numbers')->columnSpanFull(),
                ]),
                Tabs\Tab::make('Growing the family')->schema([
                    TextInput::make($this->stateKey('growing.title')),
                    FC::richText($this->stateKey('growing.body'), 'Body')->columnSpanFull(),
                ]),
            ])->persistTabInQueryString(),
        ]);
    }

    protected function getFormActions(): array
    {
        return [Action::make('save')->label('Save changes')->color('primary')->submit('save')];
    }
}
