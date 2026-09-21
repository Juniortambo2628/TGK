@php
    $record = $getRecord();
    $heroUrl = $record->hero_url;
    $isPublished = $record->published_at && $record->published_at->isPast();
@endphp

<article class="group relative flex flex-col h-full overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/80 cursor-pointer">
    {{-- Full-bleed Cover Image covering container completely --}}
    <div class="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 block">
        @if ($heroUrl)
            <img
                src="{{ $heroUrl }}"
                alt="{{ $record->title }}"
                loading="lazy"
                class="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
        @else
            <div class="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                <svg class="w-10 h-10 opacity-40 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span class="text-xs font-semibold">No cover image</span>
            </div>
        @endif

        {{-- Publication status badge pill --}}
        <div class="absolute top-3 right-3 z-10 pointer-events-none">
            @if ($isPublished)
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-600/90 text-white shadow-sm backdrop-blur-sm">
                    <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                    Published
                </span>
            @else
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/90 text-white shadow-sm backdrop-blur-sm">
                    <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                    Draft
                </span>
            @endif
        </div>
    </div>

    {{-- Story Content --}}
    <div class="flex flex-1 flex-col p-6">
        <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-red mb-2">Story</p>
        
        <h3 class="text-lg lg:text-xl font-extrabold text-gray-900 group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">
            {{ $record->title }}
        </h3>

        @if ($record->excerpt)
            <p class="mt-2.5 text-xs lg:text-sm text-gray-500 line-clamp-3 leading-relaxed">
                {{ $record->excerpt }}
            </p>
        @endif

        {{-- Card footer --}}
        <div class="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <time class="inline-flex items-center gap-1.5 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                <svg class="w-3.5 h-3.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {{ $record->published_at ? $record->published_at->format('d M Y') : 'Draft' }}
            </time>

            <span class="text-brand-red font-bold text-xs inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Edit <span>→</span>
            </span>
        </div>
    </div>
</article>

