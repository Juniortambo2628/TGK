<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RegistrationResource\Pages;
use App\Models\Registration;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class RegistrationResource extends Resource
{
    protected static ?string $model = Registration::class;
    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';
    protected static ?string $navigationGroup = 'Submissions';
    protected static ?string $modelLabel = 'Registration';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Grid::make(12)->schema([
                Forms\Components\Group::make([
                    Forms\Components\Section::make('Applicant Details')->schema([
                        Forms\Components\TextInput::make('name')->label('Full Name')->disabled(),
                        Forms\Components\TextInput::make('programme')->label('Programme Applied For')->disabled(),
                        Forms\Components\TextInput::make('location')->label('Location / Town')->disabled(),
                        Forms\Components\TextInput::make('dob')->label('Date of Birth')->disabled(),
                        Forms\Components\Textarea::make('message')->label('Motivation Statement')->disabled()->rows(6)->columnSpanFull(),
                    ])->columns(2),
                ])->columnSpan(['default' => 12, 'lg' => 8]),

                Forms\Components\Group::make([
                    Forms\Components\Section::make('Admission & Status')->schema([
                        Forms\Components\Select::make('status')
                            ->options(['new' => 'New', 'contacted' => 'Contacted', 'accepted' => 'Accepted', 'declined' => 'Declined'])
                            ->required()->native(false),
                        Forms\Components\Placeholder::make('received')
                            ->label('Received')
                            ->content(fn ($record) => $record?->created_at ? $record->created_at->diffForHumans() . ' (' . $record->created_at->format('d M Y') . ')' : '-'),
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
                // Main application & background (8 cols)
                \Filament\Infolists\Components\Group::make([
                    Section::make('Applicant Details & Motivation')->schema([
                        TextEntry::make('name')->weight('bold')->size('lg'),
                        TextEntry::make('programme')->badge()->color('primary'),
                        TextEntry::make('location')->icon('heroicon-m-map-pin'),
                        TextEntry::make('dob')->date()->label('Date of birth'),
                        TextEntry::make('message')
                            ->label('Motivation & Goals')
                            ->columnSpanFull()
                            ->prose(),
                    ])->columns(2),
                ])->columnSpan(['default' => 12, 'lg' => 8]),

                // Info & Status Sidebar (4 cols) - Mixamo Info Panel Style
                \Filament\Infolists\Components\Group::make([
                    Section::make('Application Info')->schema([
                        TextEntry::make('status')->badge(),
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
            Tables\Columns\TextColumn::make('programme')->badge(),
            Tables\Columns\TextColumn::make('email')->searchable()->copyable()->toggleable(),
            Tables\Columns\TextColumn::make('status')->badge(),
        ])
        ->recordAction('view')
        ->defaultSort('created_at', 'desc')
        ->filters([
            Tables\Filters\SelectFilter::make('programme')->options([
                'msingi' => 'Msingi (Discover)',
                'imarisha' => 'Imarisha (Develop)',
                'stawi' => 'Stawi (Launch)',
                'daraja' => 'Daraja (girls 14–17)',
            ]),
            Tables\Filters\SelectFilter::make('status'),
        ])
        ->headerActions([
            Tables\Actions\Action::make('export_csv')
                ->label('Export CSV')
                ->icon('heroicon-o-arrow-down-tray')
                ->action(function () {
                    $records = Registration::orderByDesc('created_at')->get();
                    $csv = "name,email,phone,programme,status,received_at\n";
                    foreach ($records as $r) {
                        $csv .= '"'.str_replace('"', '""', (string)$r->name).'","'.$r->email.'","'.$r->phone.'","'.$r->programme.'","'.$r->status.'","'.$r->created_at->toIso8601String().'"'."\n";
                    }
                    return response()->streamDownload(fn () => print($csv), 'registrations-'.now()->format('Y-m-d').'.csv');
                }),
        ])
        ->actions([
            Tables\Actions\ViewAction::make()->modalWidth('6xl')->modalHeading('Registration Details'),
            Tables\Actions\EditAction::make()->modalHeading('Update Registration Status')->modalWidth('6xl'),
            Tables\Actions\DeleteAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\BulkAction::make('mark_contacted')
                    ->label('Mark as Contacted')
                    ->icon('heroicon-o-phone')
                    ->color('info')
                    ->action(fn ($records) => $records->each->update(['status' => 'contacted']))
                    ->deselectRecordsAfterCompletion(),
                Tables\Actions\BulkAction::make('mark_accepted')
                    ->label('Mark as Accepted')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->action(fn ($records) => $records->each->update(['status' => 'accepted']))
                    ->deselectRecordsAfterCompletion(),
                Tables\Actions\BulkAction::make('mark_declined')
                    ->label('Mark as Declined')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->action(fn ($records) => $records->each->update(['status' => 'declined']))
                    ->deselectRecordsAfterCompletion(),
                Tables\Actions\BulkAction::make('export_selected')
                    ->label('Export Selected CSV')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->action(function ($records) {
                        $csv = "name,email,phone,programme,status,received_at\n";
                        foreach ($records as $r) {
                            $csv .= '"'.str_replace('"', '""', (string)$r->name).'","'.$r->email.'","'.$r->phone.'","'.$r->programme.'","'.$r->status.'","'.$r->created_at->toIso8601String().'"'."\n";
                        }
                        return response()->streamDownload(fn () => print($csv), 'selected-registrations-'.now()->format('Y-m-d').'.csv');
                    }),
                Tables\Actions\DeleteBulkAction::make(),
            ]),
        ]);
    }

    public static function getPages(): array
    {
        return ['index' => Pages\ListRegistrations::route('/')];
    }
}
