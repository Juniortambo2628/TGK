<?php

namespace App\Filament\Pages\Auth;

use Filament\Pages\Auth\Login as BaseLogin;

/**
 * Custom admin sign-in page. Extends Filament's Login so authentication,
 * throttling and validation stay identical to the stock behaviour. We
 * only replace:
 *   - the outer LAYOUT (a brand-styled two-column split, defined in
 *     resources/views/components/layouts/auth-split.blade.php)
 *   - the inner VIEW (just the form and its surrounding copy, sitting
 *     inside the right column of the split)
 */
class Login extends BaseLogin
{
    protected static string $view = 'filament.pages.auth.login';

    protected static string $layout = 'components.layouts.auth-split';

    protected function hasFullWidthFormActions(): bool
    {
        return true;
    }
}
