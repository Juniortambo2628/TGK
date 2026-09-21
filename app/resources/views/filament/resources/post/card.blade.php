@php
    $record = $getRecord();
    $heroUrl = $record->hero_url;
    $isPublished = $record->published_at && $record->published_at->isPast();
@endphp

<article class="gk-story-card group">
    {{-- Full-bleed Cover Image with hover zoom --}}
    <div class="gk-story-card__media">
        @if ($heroUrl)
            <img
                src="{{ $heroUrl }}"
                alt="{{ $record->title }}"
                loading="lazy"
                class="gk-story-card__image"
            />
        @else
            <div class="gk-story-card__media-placeholder">
                <svg class="w-10 h-10 opacity-40 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span class="text-xs font-semibold">No cover image</span>
            </div>
        @endif

        {{-- Publication status badge pill --}}
        <div class="gk-story-card__badge {{ $isPublished ? 'is-published' : 'is-draft' }}">
            <span class="gk-story-card__badge-dot"></span>
            {{ $isPublished ? 'Published' : 'Draft' }}
        </div>
    </div>

    {{-- Story Content --}}
    <div class="gk-story-card__body">
        <p class="gk-story-card__eyebrow">Story</p>
        
        <h3 class="gk-story-card__title">
            {{ $record->title }}
        </h3>

        @if ($record->excerpt)
            <p class="gk-story-card__excerpt">
                {{ $record->excerpt }}
            </p>
        @endif

        {{-- Card footer matching landing page --}}
        <div class="gk-story-card__footer">
            <span class="gk-story-card__list-badge {{ $isPublished ? 'is-published' : 'is-draft' }}">
                <span class="gk-story-card__badge-dot"></span>
                {{ $isPublished ? 'Published' : 'Draft' }}
            </span>

            <time class="gk-story-card__date">
                {{ $record->published_at ? $record->published_at->format('d M Y') : 'Draft' }}
            </time>

            <span class="gk-story-card__action">
                Edit <span aria-hidden="true">→</span>
            </span>
        </div>
    </div>
</article>

