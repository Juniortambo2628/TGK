<?php

namespace App\Providers\Filament;

use App\Filament\Pages\Auth\Login;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\NavigationGroup;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Enums\MaxWidth;
use Filament\FontProviders\GoogleFontProvider;
use Filament\View\PanelsRenderHook;
use Filament\Widgets;
use Illuminate\Support\Facades\Blade;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login(Login::class)
            ->darkMode(false)
            ->brandName('Good Kenyan · Admin')
            ->brandLogo(asset('images/tgkf-logo.png'))
            ->brandLogoHeight('2.2rem')
            ->favicon(asset('images/favicon-192.png'))
            ->colors([
                'primary' => Color::hex('#FB2436'),
                'danger'  => Color::hex('#C4101F'),
                'gray'    => Color::hex('#353536'),
                'success' => Color::Emerald,
                'warning' => Color::Amber,
                'info'    => Color::Sky,
            ])
            ->font('Lato', provider: GoogleFontProvider::class)
            ->maxContentWidth(MaxWidth::Full)
            ->profile(\App\Filament\Pages\Auth\EditProfile::class)
            ->navigationItems([
                \Filament\Navigation\NavigationItem::make('Profile Settings')
                    ->url(fn (): string => url('/admin/profile'))
                    ->icon('heroicon-o-user')
                    ->group('Settings')
                    ->sort(0),
            ])
            ->navigationGroups([
                NavigationGroup::make('Dashboard')->collapsible(false),
                NavigationGroup::make('Content'),
                NavigationGroup::make('Blog'),
                NavigationGroup::make('People'),
                NavigationGroup::make('Submissions'),
                NavigationGroup::make('Settings')->collapsed(),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                \App\Filament\Widgets\StatsOverview::class,
                \App\Filament\Widgets\SubmissionsTrendChart::class,
                \App\Filament\Widgets\ProgrammeDistributionChart::class,
                \App\Filament\Widgets\LatestSubmissions::class,
            ])
            // wire:navigate everywhere — kills the full-page reloads and
            // gives us instant navigation between admin pages.
            ->spa()
            // Global brand polish injected once at the top of every page.
            ->renderHook(PanelsRenderHook::STYLES_AFTER, fn (): string => Blade::render(
                "<link rel='stylesheet' href='" . asset('css/admin-theme.css') . "?v=" . filemtime(public_path('css/admin-theme.css')) . "'>"
            ))
            // Floating context toolbar renders once, at the end of body,
            // and figures out which controls to show based on the page.
            ->renderHook(PanelsRenderHook::BODY_END, fn (): string =>
                Blade::render('<x-admin.context-toolbar />')
            )
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
