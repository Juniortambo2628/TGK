<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubscriberResource\Pages;
use App\Models\Subscriber;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SubscriberResource extends Resource
{
    protected static ?string $model = Subscriber::class;
    protected static ?string $navigationIcon = 'heroicon-o-envelope-open';
    protected static ?string $navigationGroup = 'Submissions';

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('created_at')->since()->sortable()->label('Signed up'),
            Tables\Columns\TextColumn::make('email')->searchable()->copyable(),
            Tables\Columns\TextColumn::make('ip')->toggleable()->color('gray'),
        ])
        ->defaultSort('created_at', 'desc')
        ->actions([Tables\Actions\DeleteAction::make()])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\BulkAction::make('export_selected')
                    ->label('Export Selected CSV')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->action(function ($records) {
                        $csv = "email,signed_up_at\n";
                        foreach ($records as $r) {
                            $csv .= '"'.$r->email.'","'.$r->created_at->toIso8601String().'"'."\n";
                        }
                        return response()->streamDownload(fn () => print($csv), 'selected-subscribers-'.now()->format('Y-m-d').'.csv');
                    }),
                Tables\Actions\DeleteBulkAction::make(),
            ]),
        ])
        ->headerActions([
            Tables\Actions\Action::make('export')
                ->label('Export CSV')
                ->icon('heroicon-o-arrow-down-tray')
                ->action(function () {
                    $rows = Subscriber::query()->orderByDesc('created_at')->get(['email', 'created_at']);
                    $csv = "email,signed_up_at\n";
                    foreach ($rows as $r) $csv .= '"'.$r->email.'","'.$r->created_at->toIso8601String().'"'."\n";
                    return response()->streamDownload(fn () => print($csv), 'subscribers-'.now()->format('Y-m-d').'.csv');
                }),
        ]);
    }

    public static function getPages(): array
    {
        return ['index' => Pages\ListSubscribers::route('/')];
    }
}
