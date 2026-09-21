<?php

namespace App\Filament\Pages\Content;

use App\Filament\Pages\Concerns\ContentEditorPage;
use App\Filament\Support\FormComponents as FC;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Pages\Page;

class ContactPage extends Page implements HasForms
{
    use InteractsWithForms;
    use ContentEditorPage;

    protected static ?string $navigationIcon = 'heroicon-o-envelope';
    protected static ?string $navigationGroup = 'Content';
    protected static ?string $navigationLabel = 'Contact page';
    protected static ?int $navigationSort = 9;
    protected static string $view = 'filament.pages.content-form';
    protected static ?string $title = 'Contact page';
    public string $publicPath = '/contact';
    protected static string $pageSlug = 'contact';

    protected function contentKeys(): array
    {
        return [
            'hero.eyebrow' => 'string', 'hero.title' => 'string', 'hero.subtitle' => 'string',
            'hero.images' => 'gallery',
            'left.eyebrow' => 'string', 'left.title' => 'string', 'form.title' => 'string',
        ];
    }

    public function form(Form $form): Form
    {
        return $form->statePath('data')->schema([
            TextInput::make($this->stateKey('hero.eyebrow')),
            TextInput::make($this->stateKey('hero.title')),
            Textarea::make($this->stateKey('hero.subtitle'))->rows(3)->columnSpanFull(),
            FC::imageGallery($this->stateKey('hero.images'), 'contact', 'Hero background(s)')->columnSpanFull(),
            TextInput::make($this->stateKey('left.eyebrow'))->label('Left column — eyebrow'),
            TextInput::make($this->stateKey('left.title'))->label('Left column — title'),
            TextInput::make($this->stateKey('form.title'))->label('Form heading'),
        ])->columns(2);
    }

    protected function getFormActions(): array
    {
        return [Action::make('save')->label('Save changes')->color('primary')->submit('save')];
    }
}
