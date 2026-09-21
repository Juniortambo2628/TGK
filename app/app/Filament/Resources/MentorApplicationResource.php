<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MentorApplicationResource\Pages;
use App\Models\MentorApplication;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class MentorApplicationResource extends Resource
{
    protected static ?string $model = MentorApplication::class;
    protected static ?string $navigationIcon = 'heroicon-o-user-plus';
    protected static ?string $navigationGroup = 'Submissions';
    protected static ?string $modelLabel = 'Mentor application';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Grid::make(12)->schema([
                Forms\Components\Group::make([
                    Forms\Components\Section::make('Applicant Profile')->schema([
                        Forms\Components\TextInput::make('name')->label('Applicant Name')->disabled(),
                        Forms\Components\TextInput::make('profession')->label('Profession / Background')->disabled(),
                        Forms\Components\TextInput::make('hours_per_month')->label('Committed hours / month')->disabled(),
                        Forms\Components\Textarea::make('message')->label('Motivation Statement')->disabled()->rows(7)->columnSpanFull(),
                    ])->columns(2),
                ])->columnSpan(['default' => 12, 'lg' => 8]),

                Forms\Components\Group::make([
                    Forms\Components\Section::make('Status & Contact Info')->schema([
                        Forms\Components\Select::make('status')
                            ->options(['new' => 'New', 'contacted' => 'Contacted', 'onboarded' => 'Onboarded', 'declined' => 'Declined'])
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
                \Filament\Infolists\Components\Group::make([
                    Section::make('Applicant Details & Motivation')->schema([
                        TextEntry::make('name')->weight('bold')->size('lg'),
                        TextEntry::make('profession')->icon('heroicon-m-briefcase'),
                        TextEntry::make('hours_per_month')->label('Hours / month')->badge()->color('info'),
                        TextEntry::make('message')->label('Motivation & Statement')->columnSpanFull()->prose(),
                    ])->columns(2),
                ])->columnSpan(['default' => 12, 'lg' => 8]),

                \Filament\Infolists\Components\Group::make([
                    Section::make('Application Info')->schema([
                        TextEntry::make('status')->badge()->color(fn ($state) => match ($state) {
                            'new' => 'warning', 'contacted' => 'info', 'onboarded' => 'success', 'declined' => 'gray',
                            default => 'gray',
                        }),
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
            Tables\Columns\TextColumn::make('profession')->toggleable(),
            Tables\Columns\TextColumn::make('status')->badge()->color(fn ($state) => match ($state) {
                'new' => 'warning', 'contacted' => 'info', 'onboarded' => 'success', 'declined' => 'gray',
                default => 'gray',
            }),
        ])
        ->recordAction('view')
        ->defaultSort('created_at', 'desc')
        ->filters([Tables\Filters\SelectFilter::make('status')
            ->options(['new' => 'New', 'contacted' => 'Contacted', 'onboarded' => 'Onboarded', 'declined' => 'Declined'])])
        ->headerActions([
            Tables\Actions\Action::make('export_csv')
                ->label('Export CSV')
                ->icon('heroicon-o-arrow-down-tray')
                ->action(function () {
                    $records = MentorApplication::orderByDesc('created_at')->get();
                    $csv = "name,email,phone,profession,hours_per_month,status,received_at\n";
                    foreach ($records as $r) {
                        $csv .= '"'.str_replace('"', '""', (string)$r->name).'","'.$r->email.'","'.$r->phone.'","'.str_replace('"', '""', (string)$r->profession).'","'.$r->hours_per_month.'","'.$r->status.'","'.$r->created_at->toIso8601String().'"'."\n";
                    }
                    return response()->streamDownload(fn () => print($csv), 'mentor-applications-'.now()->format('Y-m-d').'.csv');
                }),
        ])
        ->actions([
            Tables\Actions\ViewAction::make()->modalWidth('6xl')->modalHeading('Mentor Application Details'),
            Tables\Actions\EditAction::make()->modalHeading('Update Mentor Status')->modalWidth('6xl'),
            Tables\Actions\DeleteAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\BulkAction::make('mark_contacted')
                    ->label('Mark Contacted')
                    ->icon('heroicon-o-phone')
                    ->color('info')
                    ->action(fn ($records) => $records->each->update(['status' => 'contacted']))
                    ->deselectRecordsAfterCompletion(),
                Tables\Actions\BulkAction::make('mark_onboarded')
                    ->label('Mark Onboarded')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->action(fn ($records) => $records->each->update(['status' => 'onboarded']))
                    ->deselectRecordsAfterCompletion(),
                Tables\Actions\BulkAction::make('mark_declined')
                    ->label('Mark Declined')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->action(fn ($records) => $records->each->update(['status' => 'declined']))
                    ->deselectRecordsAfterCompletion(),
                Tables\Actions\BulkAction::make('export_selected')
                    ->label('Export Selected CSV')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->action(function ($records) {
                        $csv = "name,email,phone,profession,hours_per_month,status,received_at\n";
                        foreach ($records as $r) {
                            $csv .= '"'.str_replace('"', '""', (string)$r->name).'","'.$r->email.'","'.$r->phone.'","'.str_replace('"', '""', (string)$r->profession).'","'.$r->hours_per_month.'","'.$r->status.'","'.$r->created_at->toIso8601String().'"'."\n";
                        }
                        return response()->streamDownload(fn () => print($csv), 'selected-mentor-applications-'.now()->format('Y-m-d').'.csv');
                    }),
                Tables\Actions\DeleteBulkAction::make(),
            ]),
        ]);
    }

    public static function getPages(): array
    {
        return ['index' => Pages\ListMentorApplications::route('/')];
    }
}
