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

class PartnersPage extends Page implements HasForms
{
    use InteractsWithForms;
    use ContentEditorPage;

    protected static ?string $navigationIcon = 'heroicon-o-building-office-2';
    protected static ?string $navigationGroup = 'Content';
    protected static ?string $navigationLabel = 'Partners page';
    protected static ?int $navigationSort = 7;
    protected static string $view = 'filament.pages.content-form';
    protected static ?string $title = 'Partners page';
    public string $publicPath = '/partners';
    protected static string $pageSlug = 'partners';

    protected function contentKeys(): array
    {
        return [
            'hero.eyebrow' => 'string', 'hero.title' => 'string', 'hero.subtitle' => 'string',
            'hero.images' => 'gallery',
            'footer_note' => 'string',
        ];
    }

    public function form(Form $form): Form
    {
        return $form->statePath('data')->schema([
            TextInput::make($this->stateKey('hero.eyebrow'))->maxLength(60),
            TextInput::make($this->stateKey('hero.title'))->maxLength(140),
            Textarea::make($this->stateKey('hero.subtitle'))->rows(3)->columnSpanFull(),
            FC::imageGallery($this->stateKey('hero.images'), 'partners', 'Hero background(s)')->columnSpanFull(),
            Textarea::make($this->stateKey('footer_note'))->rows(2)->maxLength(400)
                ->helperText('Paragraph that appears below the partner logo grid.')
                ->columnSpanFull(),
        ])->columns(2);
    }

    protected function getFormActions(): array
    {
        return [Action::make('save')->label('Save changes')->color('primary')->submit('save')];
    }
}
