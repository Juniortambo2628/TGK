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

class StoriesPage extends Page implements HasForms
{
    use InteractsWithForms;
    use ContentEditorPage;

    protected static ?string $navigationIcon = 'heroicon-o-book-open';
    protected static ?string $navigationGroup = 'Content';
    protected static ?string $navigationLabel = 'Stories page';
    protected static ?int $navigationSort = 6;
    protected static string $view = 'filament.pages.content-form';
    protected static ?string $title = 'Stories index page';
    public string $publicPath = '/stories';
    protected static string $pageSlug = 'stories';

    protected function contentKeys(): array
    {
        return [
            'hero.eyebrow' => 'string', 'hero.title' => 'string', 'hero.subtitle' => 'string',
            'hero.images' => 'gallery',
            'sidebar.footer_note' => 'string',
        ];
    }

    public function form(Form $form): Form
    {
        return $form->statePath('data')->schema([
            TextInput::make($this->stateKey('hero.eyebrow'))->label('Hero eyebrow (pill)')->maxLength(60),
            TextInput::make($this->stateKey('hero.title'))->label('Hero title')->maxLength(140),
            Textarea::make($this->stateKey('hero.subtitle'))->label('Hero subtitle')->rows(3)->columnSpanFull(),
            FC::imageGallery($this->stateKey('hero.images'), 'stories', 'Hero background(s)')->columnSpanFull(),
            Textarea::make($this->stateKey('sidebar.footer_note'))
                ->label('Sidebar footer note')->rows(3)->maxLength(400)
                ->helperText('The paragraph that appears under the sidebar timeline.')
                ->columnSpanFull(),
        ])->columns(2);
    }

    protected function getFormActions(): array
    {
        return [Action::make('save')->label('Save changes')->color('primary')->submit('save')];
    }
}
