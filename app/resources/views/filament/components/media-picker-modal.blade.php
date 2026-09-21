@props([
    'statePath' => '',
    'isMultiple' => false,
    'mediaItems' => collect(),
    'folders' => [],
])

@php
    $itemsJson = json_encode($mediaItems->map(fn ($m) => [
        'id' => $m['id'],
        'name' => $m['name'],
        'path' => $m['path'],
        'url' => $m['url'],
        'size' => $m['size_formatted'],
        'dimensions' => $m['dimensions'],
        'folder' => $m['folder'],
        'is_seed' => $m['is_seed'],
    ])->values());
@endphp

<div
    x-data="{
        items: {{ $itemsJson }},
        isMultiple: @js($isMultiple),
        search: '',
        activeFolder: 'all',
        selectedPaths: [],
        
        get filteredItems() {
            let res = this.items;
            if (this.activeFolder !== 'all') {
                res = res.filter(i => i.folder.toLowerCase() === this.activeFolder.toLowerCase());
            }
            if (this.search.trim()) {
                const q = this.search.toLowerCase().trim();
                res = res.filter(i => i.name.toLowerCase().includes(q) || i.folder.toLowerCase().includes(q) || i.path.toLowerCase().includes(q));
            }
            return res;
        },

        toggleSelect(path) {
            if (this.isMultiple) {
                if (this.selectedPaths.includes(path)) {
                    this.selectedPaths = this.selectedPaths.filter(p => p !== path);
                } else {
                    this.selectedPaths.push(path);
                }
            } else {
                this.selectedPaths = this.selectedPaths.includes(path) ? [] : [path];
            }
            this.syncForm();
        },

        isSelected(path) {
            return this.selectedPaths.includes(path);
        },

        syncForm() {
            // Find hidden input in modal form
            const input = document.querySelector('input[name=\'selected_media_paths\']') ||
                          document.querySelector('[wire\\:model*=\'selected_media_paths\']');
            if (input) {
                input.value = JSON.stringify(this.selectedPaths);
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }"
    class="gk-media-picker flex flex-col gap-4 py-2"
>
    {{-- Search and folder filters header --}}
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        {{-- Search input --}}
        <div class="relative flex-1 max-w-md">
            <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
                type="search"
                x-model="search"
                placeholder="Search by filename or folder…"
                class="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition"
            />
        </div>

        {{-- Folder filter pills --}}
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            @foreach ($folders as $f => $cnt)
                <button
                    type="button"
                    @click="activeFolder = '{{ $f }}'"
                    :class="activeFolder === '{{ $f }}' ? 'bg-[#353536] text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                    class="px-2.5 py-1 rounded-full whitespace-nowrap transition capitalize"
                >
                    {{ $f }} <span class="opacity-60 text-[10px]">({{ $cnt }})</span>
                </button>
            @endforeach
        </div>
    </div>

    {{-- Selection status bar --}}
    <div class="flex items-center justify-between text-xs text-gray-500 px-1">
        <div>
            Showing <span class="font-bold text-gray-900" x-text="filteredItems.length"></span> images
        </div>
        <div x-show="selectedPaths.length > 0" class="text-brand-red font-bold flex items-center gap-2">
            <span x-text="selectedPaths.length + (selectedPaths.length === 1 ? ' image selected' : ' images selected')"></span>
            <button type="button" @click="selectedPaths = []; syncForm()" class="text-xs text-gray-400 hover:text-gray-600 underline">Clear</button>
        </div>
    </div>

    {{-- Media Grid --}}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[55vh] overflow-y-auto p-1 rounded-xl bg-gray-50/50 border border-gray-100">
        <template x-for="item in filteredItems" :key="item.id">
            <div
                @click="toggleSelect(item.path)"
                :class="isSelected(item.path) ? 'ring-2 ring-[#FB2436] bg-red-50/20 shadow-md' : 'border border-gray-200/80 bg-white hover:border-gray-300 hover:shadow-sm'"
                class="group relative flex flex-col rounded-xl overflow-hidden cursor-pointer transition select-none"
            >
                {{-- Image Thumbnail Container --}}
                <div class="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                        :src="item.url"
                        :alt="item.name"
                        loading="lazy"
                        class="w-full h-full object-cover object-center group-hover:scale-105 transition duration-200"
                    />

                    {{-- Selected checkmark pill --}}
                    <div
                        x-show="isSelected(item.path)"
                        class="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FB2436] text-white flex items-center justify-center shadow-md animate-scaleIn"
                    >
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>

                    {{-- Folder category pill --}}
                    <div class="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold tracking-wider uppercase" x-text="item.folder"></div>
                </div>

                {{-- Image Info --}}
                <div class="p-2 flex flex-col gap-0.5">
                    <p class="text-xs font-bold text-gray-800 truncate" :title="item.name" x-text="item.name"></p>
                    <div class="flex items-center justify-between text-[10px] text-gray-500">
                        <span x-text="item.dimensions"></span>
                        <span x-text="item.size"></span>
                    </div>
                </div>
            </div>
        </template>

        <template x-if="filteredItems.length === 0">
            <div class="col-span-full py-12 flex flex-col items-center justify-center text-center text-gray-400">
                <svg class="w-10 h-10 mb-2 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <p class="text-sm font-semibold">No images match your search or folder filter.</p>
            </div>
        </template>
    </div>
</div>
