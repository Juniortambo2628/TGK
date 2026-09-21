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

class GetInvolvedPage extends Page implements HasForms
{
    use InteractsWithForms;
    use ContentEditorPage;

    protected static ?string $navigationIcon = 'heroicon-o-hand-raised';
    protected static ?string $navigationGroup = 'Content';
    protected static ?string $navigationLabel = 'Get Involved page';
    protected static ?int $navigationSort = 8;
    protected static string $view = 'filament.pages.content-form';
    protected static ?string $title = 'Get Involved page';
    public string $publicPath = '/get-involved';
    protected static string $pageSlug = 'get-involved';

    protected function contentKeys(): array
    {
        return [
            'hero.eyebrow' => 'string', 'hero.title' => 'string', 'hero.subtitle' => 'string',
            'hero.images' => 'gallery',
            'donate.title' => 'string', 'donate.body' => 'string',
            'scholarship.title' => 'string', 'scholarship.body' => 'string',
            'mentor.title' => 'string', 'mentor.intro' => 'string',
            'register.title' => 'string', 'register.intro' => 'string',
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
                    FC::imageGallery($this->stateKey('hero.images'), 'get-involved', 'Hero background(s)')->columnSpanFull(),
                ])->columns(2),
                Tabs\Tab::make('Cards')->schema([
                    TextInput::make($this->stateKey('donate.title'))->label('Donate card — title'),
                    Textarea::make($this->stateKey('donate.body'))->rows(3)->columnSpanFull(),
                    TextInput::make($this->stateKey('scholarship.title'))->label('Scholarship card — title'),
                    Textarea::make($this->stateKey('scholarship.body'))->rows(3)->columnSpanFull(),
                    TextInput::make($this->stateKey('mentor.title'))->label('Mentor form — title'),
                    Textarea::make($this->stateKey('mentor.intro'))->rows(3)->columnSpanFull(),
                    TextInput::make($this->stateKey('register.title'))->label('Registration form — title'),
                    Textarea::make($this->stateKey('register.intro'))->rows(3)->columnSpanFull(),
                ])->columns(2),
            ])->persistTabInQueryString(),
        ]);
    }

    protected function getFormActions(): array
    {
        return [Action::make('save')->label('Save changes')->color('primary')->submit('save')];
    }
}
