<?php

namespace App\Filament\Pages\Content;

use App\Filament\Pages\Concerns\ContentEditorPage;
use App\Filament\Support\FormComponents as FC;
use Filament\Actions\Action;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Pages\Page;

class HomePage extends Page implements HasForms
{
    use InteractsWithForms;
    use ContentEditorPage;

    protected static ?string $navigationIcon = 'heroicon-o-home';
    protected static ?string $navigationGroup = 'Content';
    protected static ?string $navigationLabel = 'Home page';
    protected static ?int $navigationSort = 1;
    protected static string $view = 'filament.pages.content-form';
    protected static ?string $title = 'Home page';

    public string $publicPath = '/';

    protected static string $pageSlug = 'home';

    protected function contentKeys(): array
    {
        return [
            'hero.eyebrow'              => 'string',
            'hero.title'                => 'string',
            'hero.subtitle'             => 'string',
            'hero.images'               => 'gallery',
            'hero.cta_primary_route'    => 'string',
            'hero.cta_primary_external' => 'string',
            'hero.cta_primary_label'    => 'string',
            'hero.cta_secondary_route'    => 'string',
            'hero.cta_secondary_external' => 'string',
            'hero.cta_secondary_label'    => 'string',

            'who.eyebrow'           => 'string',
            'who.title'             => 'string',
            'who.body'              => 'string',
            'who.mission'           => 'string',
            'who.vision'            => 'string',

            'impact.eyebrow'        => 'string',
            'impact.title'          => 'string',
            'impact.body'           => 'string',
            'impact.stats'          => 'stats',
            'impact.centers_text'   => 'string',

            'problem.eyebrow'       => 'string',
            'problem.title'         => 'string',
            'problem.description'   => 'string',

            'believe.body'          => 'string',

            'model.eyebrow'         => 'string',
            'model.title'           => 'string',
            'model.description'     => 'string',

            'stawi.eyebrow'         => 'string',
            'stawi.title'           => 'string',
            'stawi.body'            => 'string',

            'cta.title'             => 'string',
            'cta.description'       => 'string',
        ];
    }

    public function form(Form $form): Form
    {
        return $form
            ->statePath('data')
            ->schema([
                Tabs::make()->tabs([
                    Tabs\Tab::make('Hero')->icon('heroicon-o-photo')->schema([
                        TextInput::make($this->stateKey('hero.eyebrow'))->label('Eyebrow (pill text)')->maxLength(80),
                        TextInput::make($this->stateKey('hero.title'))->label('Title')->maxLength(140),
                        Textarea::make($this->stateKey('hero.subtitle'))->label('Subtitle')->rows(3)->maxLength(400)->columnSpanFull(),
                        FC::imageGallery($this->stateKey('hero.images'), 'hero', 'Hero carousel images')
                            ->helperText('Add 2–4 images. They rotate as the hero background.')
                            ->columnSpanFull(),
                        FC::linkPicker($this->stateKey('hero.cta_primary'), 'Primary CTA'),
                        FC::linkPicker($this->stateKey('hero.cta_secondary'), 'Secondary CTA'),
                    ])->columns(2),

                    Tabs\Tab::make('Who we are')->icon('heroicon-o-users')->schema([
                        TextInput::make($this->stateKey('who.eyebrow'))->label('Eyebrow')->maxLength(60),
                        TextInput::make($this->stateKey('who.title'))->label('Section title')->maxLength(140),
                        FC::richText($this->stateKey('who.body'), 'Body text')->columnSpanFull(),
                        FC::richText($this->stateKey('who.mission'), 'Mission statement')->columnSpanFull(),
                        FC::richText($this->stateKey('who.vision'), 'Vision statement')->columnSpanFull(),
                    ])->columns(2),

                    Tabs\Tab::make('Impact numbers')->icon('heroicon-o-chart-bar')->schema([
                        TextInput::make($this->stateKey('impact.eyebrow'))->maxLength(60),
                        TextInput::make($this->stateKey('impact.title'))->maxLength(140),
                        Textarea::make($this->stateKey('impact.body'))->rows(3)->maxLength(500)->columnSpanFull(),
                        FC::statsRepeater($this->stateKey('impact.stats'), 'The numbers')
                            ->columnSpanFull()
                            ->minItems(1)->maxItems(6),
                        TextInput::make($this->stateKey('impact.centers_text'))
                            ->label('Centers strapline')
                            ->maxLength(160)
                            ->placeholder('Centers in Nairobi and Eldoret.')
                            ->columnSpanFull(),
                    ])->columns(2),

                    Tabs\Tab::make('The problem')->icon('heroicon-o-exclamation-triangle')->schema([
                        TextInput::make($this->stateKey('problem.eyebrow'))->maxLength(60),
                        TextInput::make($this->stateKey('problem.title'))->maxLength(140),
                        Textarea::make($this->stateKey('problem.description'))->rows(3)->maxLength(500)->columnSpanFull(),
                    ])->columns(2),

                    Tabs\Tab::make('We believe')->icon('heroicon-o-sparkles')->schema([
                        FC::richText($this->stateKey('believe.body'), 'Theory-of-change statement')
                            ->helperText('The full IF…AND IF…THEN…SO THAT paragraph. Capitalized trigger words (IF, AND IF, THEN, SO THAT) and any bold text automatically highlight in brand red on the live website.')
                            ->columnSpanFull(),
                    ]),

                    Tabs\Tab::make('Our model')->icon('heroicon-o-arrow-path')->schema([
                        TextInput::make($this->stateKey('model.eyebrow'))->maxLength(60),
                        TextInput::make($this->stateKey('model.title'))->maxLength(140),
                        Textarea::make($this->stateKey('model.description'))->rows(3)->maxLength(500)->columnSpanFull(),
                    ])->columns(2),

                    Tabs\Tab::make('Stawi Enterprises')->icon('heroicon-o-briefcase')->schema([
                        TextInput::make($this->stateKey('stawi.eyebrow'))->maxLength(60),
                        TextInput::make($this->stateKey('stawi.title'))->maxLength(140),
                        FC::richText($this->stateKey('stawi.body'), 'Introduction')->columnSpanFull(),
                    ])->columns(2),

                    Tabs\Tab::make('Bottom CTA')->icon('heroicon-o-megaphone')->schema([
                        TextInput::make($this->stateKey('cta.title'))->label('CTA title')->maxLength(200),
                        Textarea::make($this->stateKey('cta.description'))->rows(3)->maxLength(400)->columnSpanFull(),
                    ])->columns(2),
                ])->persistTabInQueryString(),
            ]);
    }

    protected function getFormActions(): array
    {
        return [Action::make('save')->label('Save changes')->color('primary')->submit('save')];
    }
}
