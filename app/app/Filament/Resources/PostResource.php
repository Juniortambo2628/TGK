<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PostResource\Pages;
use App\Filament\Support\FormComponents as FC;
use App\Models\Post;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class PostResource extends Resource
{
    protected static ?string $model = Post::class;
    protected static ?string $navigationIcon = 'heroicon-o-newspaper';
    protected static ?string $navigationGroup = 'Blog';
    protected static ?string $navigationLabel = 'Stories';
    protected static ?string $modelLabel = 'Story';
    protected static ?string $pluralModelLabel = 'Stories';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Grid::make(12)->schema([
                // Main Story details (8 cols)
                Forms\Components\Group::make([
                    Forms\Components\Section::make('Story details')
                        ->schema([
                            Forms\Components\TextInput::make('title')
                                ->label('Title')
                                ->placeholder('e.g. From School to Opportunity')
                                ->required()
                                ->maxLength(200)
                                ->live(onBlur: true)
                                ->afterStateUpdated(fn ($state, $set, $context) =>
                                    $context === 'create' ? $set('slug', Str::slug($state)) : null)
                                ->columnSpanFull(),
                            Forms\Components\TextInput::make('slug')
                                ->label('URL Slug')
                                ->required()
                                ->maxLength(200)
                                ->unique(ignoreRecord: true)
                                ->helperText('The story public address: /stories/<slug>')
                                ->columnSpanFull(),
                            Forms\Components\Textarea::make('excerpt')
                                ->label('Summary / Excerpt')
                                ->placeholder('One-paragraph summary for cards and search results...')
                                ->rows(3)
                                ->maxLength(500)
                                ->helperText('Appears on cards, social share previews, and search results.')
                                ->columnSpanFull(),
                            FC::richText('body', 'Story Content')
                                ->required()
                                ->columnSpanFull(),
                        ]),

                    Forms\Components\Section::make('Search Engine Optimization (SEO)')
                        ->description('Configure metadata for search engines and social share previews.')
                        ->schema([
                            Forms\Components\TextInput::make('seo_title')
                                ->label('Meta Title')
                                ->maxLength(200),
                            Forms\Components\Textarea::make('seo_description')
                                ->label('Meta Description')
                                ->rows(2)
                                ->maxLength(300),
                        ])
                        ->collapsed()
                        ->columns(2),
                ])->columnSpan(['default' => 12, 'lg' => 8]),

                // Info & Media Sidebar (4 cols) - Matches Mixamo Info Panel
                Forms\Components\Group::make([
                    Forms\Components\Section::make('Cover Image')
                        ->schema([
                            FC::imageUpload('hero_image_upload', 'stories', 'Hero cover photo')
                                ->helperText('Upload cover photo. Always covers the card on the site and dashboard.')
                                ->dehydrated(false)
                                ->afterStateHydrated(function ($component, $state, $record) {
                                    if ($record && $record->hero_image) {
                                        $component->state(['uploads/stories/'.$record->hero_image]);
                                    }
                                }),
                        ]),

                    Forms\Components\Section::make('Publishing & Info')
                        ->schema([
                            Forms\Components\DateTimePicker::make('published_at')
                                ->label('Publish Date & Time')
                                ->default(now())
                                ->native(false)
                                ->seconds(false)
                                ->helperText('Story is visible on the public site after this time.'),
                            Forms\Components\Placeholder::make('public_preview')
                                ->label('Public Link')
                                ->content(fn (?Post $record): string => $record && $record->slug
                                    ? url('/stories/'.$record->slug)
                                    : 'Will be generated upon saving'),
                        ]),
                ])->columnSpan(['default' => 12, 'lg' => 4]),
            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->contentGrid([
                'default' => 1,
                'md' => 2,
                'xl' => 3,
            ])
            ->columns([
                Tables\Columns\ViewColumn::make('card')
                    ->label('')
                    ->view('filament.resources.post.card'),
            ])
            ->recordAction('edit')
            ->defaultSort('published_at', 'desc')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_published')
                    ->label('Publication status')
                    ->queries(
                        true: fn ($q) => $q->whereNotNull('published_at')->where('published_at', '<=', now()),
                        false: fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '>', now()),
                    ),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->label('New story')
                    ->modalHeading('Add a new story')
                    ->modalWidth('7xl')
                    ->using(fn (array $data) => static::persist(new Post(), $data)),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->modalHeading('Edit story')
                    ->modalWidth('7xl')
                    ->using(fn (Post $record, array $data) => static::persist($record, $data)),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('publish')
                        ->label('Publish now')
                        ->icon('heroicon-o-eye')
                        ->color('success')
                        ->action(fn ($records) => $records->each->update(['published_at' => now()]))
                        ->deselectRecordsAfterCompletion(),
                    Tables\Actions\BulkAction::make('unpublish')
                        ->label('Move to drafts')
                        ->icon('heroicon-o-eye-slash')
                        ->color('warning')
                        ->action(fn ($records) => $records->each->update(['published_at' => null]))
                        ->deselectRecordsAfterCompletion(),
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    protected static function persist(Post $record, array $data): Post
    {
        // Handle the uploaded hero image: store filename only in DB, in the
        // canonical /uploads/stories path that PostModel::getHeroUrl resolves.
        $upload = $data['hero_image_upload'] ?? null;
        if (is_array($upload)) $upload = reset($upload) ?: null;
        if ($upload) {
            // Store the full "uploads/stories/xxx.jpg" path; Post::getHeroUrl
            // detects it and serves via /storage/.
            $data['hero_image'] = ltrim((string) $upload, '/');
        }
        unset($data['hero_image_upload']);

        $record->fill($data);
        $record->save();
        return $record;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPosts::route('/'),
        ];
    }
}
