{{--
    Brand-styled two-column layout for the admin auth pages. The left
    column is our storyboard (brand red wash over a photo of the work);
    the right column receives the {{ $slot }}, which is whatever the
    Livewire auth page (Login, forgot-password, etc.) chooses to render.

    We wrap in Filament's layout.base so the shell, @filamentStyles and
    Livewire scripts are all included. Everything after that is a single
    root element (the .gk-split div) so Livewire is happy.
--}}
<x-filament-panels::layout.base :livewire="$livewire ?? null">
    <style>
        html { background: #ffffff; }
        body { font-family: 'Lato', system-ui, -apple-system, sans-serif; color: #353536; }

        .gk-split {
            display: grid;
            grid-template-columns: 1fr;
            min-height: 100vh;
        }
        @media (min-width: 1024px) {
            .gk-split { grid-template-columns: 5fr 6fr; }
        }

        /* --- Left brand storyboard --- */
        .gk-brand {
            position: relative; isolation: isolate; overflow: hidden;
            background: #FB2436; color: #FAFFFD;
            display: flex; flex-direction: column;
            padding: 2.5rem;
        }
        @media (min-width: 1024px) {
            .gk-brand { padding: 3.5rem; }
        }
        .gk-brand__photo {
            position: absolute; inset: 0; z-index: -2;
            background-image: url('{{ asset('images/landing/hero-slide-1.jpg') }}');
            background-size: cover; background-position: center;
            opacity: 0.35;
        }
        .gk-brand__wash {
            position: absolute; inset: 0; z-index: -1;
            background: linear-gradient(160deg,
                rgba(251, 36, 54, 0.82) 0%,
                rgba(196, 16, 31, 0.86) 55%,
                rgba(53, 53, 54, 0.92) 100%);
        }
        .gk-brand__deco {
            position: absolute; top: -3rem; right: -3rem; z-index: -1;
            width: 22rem; height: 22rem;
            border: 3px solid rgba(255, 255, 255, 0.08);
            border-radius: 50%;
            pointer-events: none;
        }
        .gk-brand__deco--sm {
            width: 12rem; height: 12rem;
            top: auto; right: 3rem; bottom: -3rem;
        }
        .gk-brand__mark {
            display: inline-flex; align-items: center; gap: 0.5rem;
            color: white; text-decoration: none;
        }
        .gk-brand__mark .bracket {
            color: rgba(255, 255, 255, 0.9);
            font-weight: 400; font-size: 1.9rem; line-height: 1;
        }
        .gk-brand__body { margin-top: auto; max-width: 34rem; }
        .gk-brand__eyebrow {
            display: inline-block;
            font-size: 0.7rem; font-weight: 700; letter-spacing: 0.24em;
            text-transform: uppercase;
            padding: 0.4rem 0.9rem; border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.45);
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(4px);
        }
        .gk-brand__title {
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 900; line-height: 1.05;
            margin: 1.5rem 0 1rem;
            text-wrap: balance;
            text-shadow: 0 2px 24px rgba(0, 0, 0, 0.25);
        }
        .gk-brand__sub {
            font-size: 1.05rem; line-height: 1.55;
            color: rgba(255, 255, 255, 0.9);
            max-width: 28rem;
        }
        .gk-brand__foot {
            display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
            margin-top: 2rem; padding-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            font-size: 0.78rem; color: rgba(255, 255, 255, 0.75);
        }
        .gk-brand__foot a {
            color: white; text-decoration: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.35);
        }
        .gk-brand__foot a:hover { border-bottom-color: white; }

        /* --- Right form panel --- */
        .gk-form-panel {
            display: flex; align-items: center; justify-content: center;
            padding: 2.5rem 1.5rem; background: #ffffff;
        }
        @media (min-width: 1024px) {
            .gk-form-panel { padding: 3.5rem; }
        }
        .gk-form-inner { width: 100%; max-width: 26rem; }

        .gk-stats {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;
            padding: 1rem; margin-bottom: 2rem;
            background: #F1EFEA; border-radius: 1rem;
        }
        .gk-stats > div { text-align: center; }
        .gk-stats .n { font-size: 1.35rem; font-weight: 900; color: #FB2436; line-height: 1; }
        .gk-stats .l {
            font-size: 0.6rem; font-weight: 700; color: #6E6E70;
            letter-spacing: 0.08em; text-transform: uppercase; margin-top: 0.35rem;
        }

        .gk-eyebrow {
            font-size: 0.7rem; font-weight: 700; letter-spacing: 0.24em;
            text-transform: uppercase; color: #FB2436;
        }
        .gk-h1 {
            font-size: 2rem; font-weight: 900; line-height: 1.1; color: #353536;
            margin: 0.75rem 0 0.5rem;
        }
        .gk-sub { color: #6E6E70; font-size: 0.95rem; line-height: 1.55; margin-bottom: 1.75rem; }

        /* Restyle the Filament form controls to match the brand */
        .gk-form-inner .fi-input-wrp {
            border-radius: 0.75rem !important;
            border-color: #E4E2DD !important;
        }
        .gk-form-inner .fi-input-wrp:focus-within {
            border-color: #FB2436 !important;
            box-shadow: 0 0 0 3px rgba(251, 36, 54, 0.15) !important;
        }
        .gk-form-inner input {
            padding: 0.85rem 1rem !important;
            font-size: 0.95rem !important;
        }
        .gk-form-inner .fi-fo-field-wrp-label {
            font-weight: 700 !important;
            color: #353536 !important;
            font-size: 0.78rem !important;
            letter-spacing: 0.02em;
            text-transform: uppercase;
        }
        .gk-form-inner .fi-btn-color-primary {
            background-color: #FB2436 !important;
            border-color: #FB2436 !important;
            border-radius: 999px !important;
            padding: 0.85rem 1.5rem !important;
            font-weight: 700 !important;
            font-size: 0.95rem !important;
            transition: transform 150ms ease, background-color 150ms ease;
        }
        .gk-form-inner .fi-btn-color-primary:hover {
            background-color: #C4101F !important;
            transform: translateY(-1px);
        }

        .gk-meta {
            margin-top: 2rem; padding-top: 1.5rem;
            border-top: 1px solid #E4E2DD;
            display: flex; align-items: center; justify-content: space-between;
            font-size: 0.85rem; color: #6E6E70;
        }
        .gk-meta a { color: #FB2436; text-decoration: none; font-weight: 700; }
        .gk-meta a:hover { text-decoration: underline; }
    </style>

    <div class="gk-split">
        {{-- LEFT: brand storyboard --}}
        <aside class="gk-brand">
            <div class="gk-brand__photo" aria-hidden="true"></div>
            <div class="gk-brand__wash" aria-hidden="true"></div>
            <div class="gk-brand__deco" aria-hidden="true"></div>
            <div class="gk-brand__deco gk-brand__deco--sm" aria-hidden="true"></div>

            <a href="{{ url('/') }}" class="gk-brand__mark" aria-label="Good Kenyan Foundation">
                <span class="bracket">[</span>
                <span style="font-weight: 900; font-size: 1.05rem; letter-spacing: 0.04em; text-transform: uppercase; padding: 0 0.35rem;">
                    Good Kenyan
                </span>
                <span class="bracket">]</span>
                <span style="margin-left: 0.5rem; font-size: 0.7rem; font-weight: 400; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(255,255,255,0.7);">
                    Foundation
                </span>
            </a>

            <div class="gk-brand__body">
                <span class="gk-brand__eyebrow">Good Kenyan · Admin</span>
                <h1 class="gk-brand__title">From school to opportunity.</h1>
                <p class="gk-brand__sub">
                    The workspace behind goodkenyan.org. Publish stories, refresh page copy,
                    respond to messages and keep the brand pointing the same direction.
                </p>

                <div class="gk-brand__foot">
                    <span>© {{ date('Y') }} Good Kenyan Foundation</span>
                    <span aria-hidden>·</span>
                    <a href="{{ url('/') }}">View the public site ↗</a>
                </div>
            </div>
        </aside>

        {{-- RIGHT: form column — the auth page's own view slots in here --}}
        <main class="gk-form-panel">
            <div class="gk-form-inner">
                {{ $slot }}
            </div>
        </main>
    </div>
</x-filament-panels::layout.base>
