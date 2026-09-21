<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PartnerResource\Pages;
use App\Filament\Support\FormComponents as FC;
use App\Models\Partner;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PartnerResource extends Resource
{
    protected static ?string $model = Partner::class;
    protected static ?string $navigationIcon = 'heroicon-o-building-office';
    protected static ?string $navigationGroup = 'People';
    protected static ?string $pluralModelLabel = 'Partners';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Grid::make(12)->schema([
                Forms\Components\Group::make([
                    Forms\Components\Section::make('Partner Details')->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Partner Name')
                            ->required()
                            ->maxLength(120),
                        Forms\Components\TextInput::make('url')
                            ->label('Website URL')
                            ->url()
                            ->maxLength(300)
                            ->prefix('https://'),
                        Forms\Components\TextInput::make('sort_order')
                            ->label('Sort Order')
                            ->numeric()
                            ->default(0)
                            ->helperText('Lower numbers appear first in the partner grid.'),
                    ])->columns(1),
                ])->columnSpan(['default' => 12, 'lg' => 8]),

                Forms\Components\Group::make([
                    Forms\Components\Section::make('Logo & Visibility')->schema([
                        FC::imageUpload('logo_upload', 'partners', 'Partner Logo')
                            ->helperText('SVG or transparent PNG works best.')
                            ->dehydrated(false)
                            ->afterStateHydrated(function ($component, $record) {
                                if ($record && $record->logo) {
                                    $component->state([str_starts_with($record->logo, 'uploads/')
                                        ? $record->logo
                                        : 'images/partners/'.$record->logo]);
                                }
                            }),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Show on public site')
                            ->default(true),
                    ]),
                ])->columnSpan(['default' => 12, 'lg' => 4]),
            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\ImageColumn::make('logo_url')
                ->label('Logo')
                ->height(40)
                ->width(96)
                ->extraImgAttributes(['class' => 'object-contain', 'style' => 'object-fit:contain']),
            Tables\Columns\TextColumn::make('name')->searchable()->weight('bold'),
            Tables\Columns\IconColumn::make('is_active')->boolean(),
            Tables\Columns\TextColumn::make('sort_order')->sortable(),
        ])
        ->recordAction('edit')
        ->defaultSort('sort_order')
        ->reorderable('sort_order')
        ->headerActions([
            Tables\Actions\CreateAction::make()
                ->modalHeading('Add a Partner')
                ->modalWidth('6xl')
                ->using(fn (array $data) => static::persist(new Partner(), $data)),
        ])
        ->actions([
            Tables\Actions\EditAction::make()
                ->modalHeading('Edit Partner')
                ->modalWidth('6xl')
                ->using(fn (Partner $record, array $data) => static::persist($record, $data)),
            Tables\Actions\DeleteAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\BulkAction::make('activate')
                    ->label('Show on site')
                    ->icon('heroicon-o-eye')
                    ->color('success')
                    ->action(fn ($records) => $records->each->update(['is_active' => true]))
                    ->deselectRecordsAfterCompletion(),
                Tables\Actions\BulkAction::make('deactivate')
                    ->label('Hide from site')
                    ->icon('heroicon-o-eye-slash')
                    ->color('warning')
                    ->action(fn ($records) => $records->each->update(['is_active' => false]))
                    ->deselectRecordsAfterCompletion(),
                Tables\Actions\DeleteBulkAction::make(),
            ]),
        ]);
    }

    protected static function persist(Partner $record, array $data): Partner
    {
        $upload = $data['logo_upload'] ?? null;
        if (is_array($upload)) $upload = reset($upload) ?: null;
        if ($upload) $data['logo'] = ltrim((string) $upload, '/');
        unset($data['logo_upload']);
        $record->fill($data);
        $record->save();
        return $record;
    }

    public static function getPages(): array
    {
        return ['index' => Pages\ListPartners::route('/')];
    }
}
