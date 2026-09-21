<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactMessageResource\Pages;
use App\Models\ContactMessage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ContactMessageResource extends Resource
{
    protected static ?string $model = ContactMessage::class;
    protected static ?string $navigationIcon = 'heroicon-o-envelope';
    protected static ?string $navigationGroup = 'Submissions';
    protected static ?string $modelLabel = 'Contact message';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Grid::make(12)->schema([
                Forms\Components\Group::make([
                    Forms\Components\Section::make('Message Details')->schema([
                        Forms\Components\TextInput::make('name')->label('Sender name')->disabled(),
                        Forms\Components\TextInput::make('topic')->label('Subject / Topic')->disabled(),
                        Forms\Components\Textarea::make('message')->label('Message Body')->disabled()->rows(7)->columnSpanFull(),
                    ])->columns(2),
                ])->columnSpan(['default' => 12, 'lg' => 8]),

                Forms\Components\Group::make([
                    Forms\Components\Section::make('Status & Sender Info')->schema([
                        Forms\Components\Toggle::make('is_handled')
                            ->label('Handled / Replied')
                            ->helperText('Switch on once you have responded to this message.')
                            ->default(false),
                        Forms\Components\Placeholder::make('received')
                            ->label('Received')
                            ->content(fn ($record) => $record?->created_at ? $record->created_at->diffForHumans() . ' (' . $record->created_at->format('d M Y, H:i') . ')' : '-'),
                        Forms\Components\TextInput::make('email')->label('Email Address')->disabled(),
                        Forms\Components\TextInput::make('phone')->label('Phone Number')->disabled(),
                    ]),
                ])->columnSpan(['default' => 12, 'lg' => 4]),
            ])->columnSpanFull(),
        ]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist->schema([
            \Filament\Infolists\Components\Grid::make(12)->schema([
                \Filament\Infolists\Components\Group::make([
                    Section::make('Message Content')->schema([
                        TextEntry::make('name')->label('From')->weight('bold')->size('lg'),
                        TextEntry::make('topic')->label('Topic / Category')->badge(),
                        TextEntry::make('message')->label('Message body')->columnSpanFull()->prose(),
                    ])->columns(2),
                ])->columnSpan(['default' => 12, 'lg' => 8]),

                \Filament\Infolists\Components\Group::make([
                    Section::make('Submission Info')->schema([
                        TextEntry::make('is_handled')
                            ->label('Status')
                            ->badge()
                            ->state(fn ($record) => $record->is_handled ? 'Handled' : 'Pending Reply')
                            ->color(fn ($record) => $record->is_handled ? 'success' : 'warning'),
                        TextEntry::make('created_at')->since()->label('Received'),
                        TextEntry::make('email')->copyable()->icon('heroicon-m-envelope'),
                        TextEntry::make('phone')->copyable()->icon('heroicon-m-phone'),
                    ]),
                ])->columnSpan(['default' => 12, 'lg' => 4]),
            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('created_at')->since()->sortable()->label('Received'),
            Tables\Columns\TextColumn::make('name')->searchable()->weight('bold'),
            Tables\Columns\TextColumn::make('email')->searchable()->copyable(),
            Tables\Columns\TextColumn::make('topic')->badge(),
            Tables\Columns\IconColumn::make('is_handled')->boolean(),
        ])
        ->recordAction('view')
        ->defaultSort('created_at', 'desc')
        ->filters([
            Tables\Filters\TernaryFilter::make('is_handled')->label('Handled?'),
        ])
        ->headerActions([
            Tables\Actions\Action::make('export_csv')
                ->label('Export CSV')
                ->icon('heroicon-o-arrow-down-tray')
                ->action(function () {
                    $records = ContactMessage::orderByDesc('created_at')->get();
                    $csv = "name,email,phone,topic,is_handled,received_at\n";
                    foreach ($records as $r) {
                        $csv .= '"'.str_replace('"', '""', (string)$r->name).'","'.$r->email.'","'.$r->phone.'","'.$r->topic.'","'.($r->is_handled ? '1' : '0').'","'.$r->created_at->toIso8601String().'"'."\n";
                    }
                    return response()->streamDownload(fn () => print($csv), 'contact-messages-'.now()->format('Y-m-d').'.csv');
                }),
        ])
        ->actions([
            Tables\Actions\ViewAction::make()->modalWidth('6xl')->modalHeading('Contact Message Details'),
            Tables\Actions\EditAction::make()->modalWidth('6xl')->modalHeading('Update Message Status'),
            Tables\Actions\DeleteAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\BulkAction::make('mark_handled')
                    ->label('Mark as Handled')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->action(fn ($records) => $records->each->update(['is_handled' => true]))
                    ->deselectRecordsAfterCompletion(),
                Tables\Actions\BulkAction::make('mark_unhandled')
                    ->label('Mark as Unhandled')
                    ->icon('heroicon-o-x-circle')
                    ->color('gray')
                    ->action(fn ($records) => $records->each->update(['is_handled' => false]))
                    ->deselectRecordsAfterCompletion(),
                Tables\Actions\BulkAction::make('export_selected')
                    ->label('Export Selected CSV')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->action(function ($records) {
                        $csv = "name,email,phone,topic,is_handled,received_at\n";
                        foreach ($records as $r) {
                            $csv .= '"'.str_replace('"', '""', (string)$r->name).'","'.$r->email.'","'.$r->phone.'","'.$r->topic.'","'.($r->is_handled ? '1' : '0').'","'.$r->created_at->toIso8601String().'"'."\n";
                        }
                        return response()->streamDownload(fn () => print($csv), 'selected-contact-messages-'.now()->format('Y-m-d').'.csv');
                    }),
                Tables\Actions\DeleteBulkAction::make(),
            ]),
        ]);
    }

    public static function getPages(): array
    {
        return ['index' => Pages\ListContactMessages::route('/')];
    }
}
