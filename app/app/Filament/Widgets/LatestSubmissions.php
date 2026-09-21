<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\RegistrationResource;
use App\Models\Registration;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestSubmissions extends BaseWidget
{
    protected static ?int $sort = 4;
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('Recent Youth Intake Applications')
            ->description('Latest candidates registering for Msingi, Imarisha, and Daraja pathways')
            ->query(Registration::query()->latest()->limit(6))
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Applicant')
                    ->weight('bold')
                    ->searchable(),

                Tables\Columns\TextColumn::make('programme')
                    ->label('Track / Programme')
                    ->badge()
                    ->color(fn (?string $state): string => match (strtolower((string) $state)) {
                        'msingi' => 'primary',
                        'imarisha' => 'gray',
                        'daraja' => 'warning',
                        'stawi' => 'success',
                        default => 'info',
                    }),

                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->copyable()
                    ->icon('heroicon-m-envelope'),

                Tables\Columns\TextColumn::make('phone')
                    ->label('Phone')
                    ->copyable()
                    ->icon('heroicon-m-phone'),

                Tables\Columns\TextColumn::make('location')
                    ->label('Location'),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'approved' => 'success',
                        'rejected' => 'danger',
                        'reviewed' => 'info',
                        default => 'warning',
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Applied')
                    ->since(),
            ])
            ->actions([
                Tables\Actions\Action::make('review')
                    ->label('Review')
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->color('primary')
                    ->url(fn (Registration $record): string => RegistrationResource::getUrl('edit', ['record' => $record])),
            ])
            ->paginated(false);
    }
}
