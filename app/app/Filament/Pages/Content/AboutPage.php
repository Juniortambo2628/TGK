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

class AboutPage extends Page implements HasForms
{
    use InteractsWithForms;
    use ContentEditorPage;

    protected static ?string $navigationIcon = 'heroicon-o-information-circle';
    protected static ?string $navigationGroup = 'Content';
    protected static ?string $navigationLabel = 'About page';
    protected static ?int $navigationSort = 2;
    protected static string $view = 'filament.pages.content-form';
    protected static ?string $title = 'About page';
    public string $publicPath = '/about';
    protected static string $pageSlug = 'about';

    protected function contentKeys(): array
    {
        return [
            'hero.eyebrow' => 'string', 'hero.title' => 'string', 'hero.subtitle' => 'string',
            'hero.images' => 'gallery',
            'story.eyebrow' => 'string', 'story.title' => 'string', 'story.body' => 'string',
            'mission' => 'string', 'vision' => 'string',
            'values.title' => 'string', 'values.body' => 'string', 'values.image' => 'gallery',
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
                    FC::imageGallery($this->stateKey('hero.images'), 'about', 'Hero background(s)')->columnSpanFull(),
                ])->columns(2),
                Tabs\Tab::make('Our story')->schema([
                    TextInput::make($this->stateKey('story.eyebrow')),
                    TextInput::make($this->stateKey('story.title')),
                    FC::richText($this->stateKey('story.body'), 'Body')->columnSpanFull(),
                ])->columns(2),
                Tabs\Tab::make('Mission & Vision')->schema([
                    FC::richText($this->stateKey('mission'), 'Mission')->columnSpanFull(),
                    FC::richText($this->stateKey('vision'), 'Vision')->columnSpanFull(),
                ]),
                Tabs\Tab::make('Values / Voice')->schema([
                    TextInput::make($this->stateKey('values.title')),
                    FC::richText($this->stateKey('values.body'), 'Body')->columnSpanFull(),
                    FC::imageGallery($this->stateKey('values.image'), 'about', 'Supporting image')->columnSpanFull(),
                ])->columns(2),
            ])->persistTabInQueryString(),
        ]);
    }

    protected function getFormActions(): array
    {
        return [Action::make('save')->label('Save changes')->color('primary')->submit('save')];
    }
}
