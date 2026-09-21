<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?string $navigationIcon = 'heroicon-o-user-circle';
    protected static ?string $navigationGroup = 'Settings';
    protected static ?string $navigationLabel = 'User Accounts';
    protected static ?int $navigationSort = 1;
    protected static ?string $pluralModelLabel = 'User Accounts';
    protected static ?string $modelLabel = 'User Account';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Grid::make(12)->schema([
                Forms\Components\Group::make([
                    Forms\Components\Section::make('Account Credentials')->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Full Name')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('email')
                            ->label('Email Address')
                            ->email()
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),

                        Forms\Components\TextInput::make('password')
                            ->label('Password')
                            ->password()
                            ->revealable()
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->rule(Password::default())
                            ->dehydrated(fn ($state): bool => filled($state))
                            ->dehydrateStateUsing(fn ($state): string => Hash::make($state))
                            ->same('password_confirmation')
                            ->helperText(fn (string $operation): string => $operation === 'edit' ? 'Leave blank to keep existing password.' : 'Must be at least 8 characters.'),

                        Forms\Components\TextInput::make('password_confirmation')
                            ->label('Confirm Password')
                            ->password()
                            ->revealable()
                            ->requiredWith('password')
                            ->dehydrated(false),
                    ])->columns(2),
                ])->columnSpan(['default' => 12, 'lg' => 8]),

                Forms\Components\Group::make([
                    Forms\Components\Section::make('Access & Role')->schema([
                        Forms\Components\Placeholder::make('role_badge')
                            ->label('Role')
                            ->content(fn () => new \Illuminate\Support\HtmlString('<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-[#FB2436]">Administrator</span>')),

                        Forms\Components\Placeholder::make('access_note')
                            ->label('Access Permissions')
                            ->content('This account will have full access to manage content, stories, partners, form submissions, and site settings.'),

                        Forms\Components\Placeholder::make('created_at')
                            ->label('Account Created')
                            ->content(fn (?User $record): string => $record?->created_at ? $record->created_at->format('M j, Y g:i a') : 'Now (on save)')
                            ->visible(fn (string $operation): bool => $operation === 'edit'),
                    ]),
                ])->columnSpan(['default' => 12, 'lg' => 4]),
            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('email')
                    ->label('Email Address')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->icon('heroicon-m-envelope'),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->date('M j, Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->recordAction('edit')
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->modalHeading('Create User Account')
                    ->modalWidth('5xl')
                    ->successNotificationTitle('User Account Created'),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->modalHeading('Edit User Account')
                    ->modalWidth('5xl')
                    ->successNotificationTitle('User Account Updated'),

                Tables\Actions\DeleteAction::make()
                    ->hidden(fn (User $record): bool => $record->id === auth()->id())
                    ->modalHeading('Delete User Account')
                    ->modalDescription('Are you sure you want to permanently delete this user account? They will lose all access to the dashboard.')
                    ->successNotificationTitle('User Account Deleted'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->action(function ($records) {
                            $currentUserId = auth()->id();
                            $filtered = $records->reject(fn (User $u) => $u->id === $currentUserId);
                            $filtered->each->delete();

                            Notification::make()
                                ->success()
                                ->title('Selected Users Deleted')
                                ->send();
                        }),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageUsers::route('/'),
        ];
    }
}
