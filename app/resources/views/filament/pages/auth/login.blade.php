{{--
    Login form. This view sits INSIDE the right column of the split
    layout defined in components/layouts/auth-split.blade.php, so it
    only needs to render the form and its surrounding copy. Livewire
    wraps this in a single root element and the outer layout provides
    the HTML shell + Filament scripts.
--}}
<div>
    <div class="gk-stats" role="presentation">
        <div><div class="n">9</div><div class="l">Pages</div></div>
        <div><div class="n">5</div><div class="l">Submissions</div></div>
        <div><div class="n">∞</div><div class="l">Uptime</div></div>
    </div>

    <p class="gk-eyebrow">Welcome back</p>
    <h1 class="gk-h1">Sign in to your admin.</h1>
    <p class="gk-sub">
        Use the email you were invited with. Trouble getting in?
        Ask Kevin, or reset your password below.
    </p>

    <x-filament-panels::form wire:submit="authenticate">
        {{ $this->form }}

        <x-filament-panels::form.actions
            :actions="$this->getCachedFormActions()"
            :full-width="$this->hasFullWidthFormActions()"
        />
    </x-filament-panels::form>

    <div class="gk-meta">
        <a href="{{ url('/') }}">← Back to the site</a>
        <span>{{ config('app.env') === 'local' ? 'Local development' : ucfirst(config('app.env')) }}</span>
    </div>
</div>
