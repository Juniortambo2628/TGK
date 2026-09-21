<x-filament-panels::page>
    <div
        x-data="{
            cropOpen: false,
            cropPath: '',
            cropUrl: '',
            cropper: null,
            dragMode: 'move',
            aspectRatio: null,
            initCropper() {
                if (this.cropper) {
                    this.cropper.destroy();
                }
                const image = this.$refs.cropImg;
                if (!image) return;
                
                // Wait for image to load if not already complete
                const setup = () => {
                    this.cropper = new Cropper(image, {
                        aspectRatio: this.aspectRatio,
                        viewMode: 2,
                        dragMode: this.dragMode,
                        autoCropArea: 0.9,
                        responsive: true,
                        cropBoxResizable: true,
                    });
                };

                if (image.complete) {
                    setup();
                } else {
                    image.onload = setup;
                }
            },
            setDrag(mode) {
                this.dragMode = mode;
                if (this.cropper) {
                    this.cropper.setDragMode(mode);
                }
            },
            setRatio(ratio) {
                this.aspectRatio = ratio;
                if (this.cropper) {
                    this.cropper.setAspectRatio(ratio);
                }
            },
            saveCrop() {
                if (!this.cropper) return;
                const data = this.cropper.getData(true);
                $wire.applyCrop(data);
                this.cropOpen = false;
            },
            copyToClipboard(text) {
                navigator.clipboard.writeText(text);
                new FilamentNotification()
                    .title('URL Copied')
                    .body('Image public URL copied to clipboard.')
                    .success()
                    .send();
            }
        }"
        x-on:open-crop-editor.window="
            cropPath = $event.detail.path;
            cropUrl = $event.detail.url;
            cropOpen = true;
            $nextTick(() => initCropper());
        "
        class="flex flex-col gap-6"
    >
        {{-- Search and folder category filter bar --}}
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-gray-200/80 shadow-sm">
            {{-- Search Bar --}}
            <div class="relative flex-1 max-w-md">
                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input
                    type="search"
                    wire:model.live.debounce.300ms="search"
                    placeholder="Search by filename or folder…"
                    class="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition"
                />
            </div>

            {{-- Folder Filter Pills --}}
            <div class="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                @foreach ($this->folders as $folder => $count)
                    <button
                        type="button"
                        wire:click="filterFolder('{{ $folder }}')"
                        class="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition capitalize {{ $activeFolder === $folder ? 'bg-[#353536] text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200' }}"
                    >
                        {{ $folder }}
                        <span class="opacity-60 text-[10px] ml-0.5">({{ $count }})</span>
                    </button>
                @endforeach
            </div>
        </div>

        {{-- Gallery Grid --}}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            @forelse ($this->media as $item)
                <div class="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-200/80 shadow-sm hover:shadow-md hover:border-gray-300 transition duration-200">
                    {{-- Thumbnail container --}}
                    <div class="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                        <img
                            src="{{ $item['url'] }}"
                            alt="{{ $item['name'] }}"
                            loading="lazy"
                            class="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                        />

                        {{-- Category Badge --}}
                        <div class="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                            {{ $item['folder'] }}
                        </div>

                        {{-- Floating quick actions overlay --}}
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                            {{-- Copy URL --}}
                            <button
                                type="button"
                                @click="copyToClipboard('{{ $item['url'] }}')"
                                title="Copy public URL"
                                class="p-2 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md transition transform hover:scale-110"
                            >
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                            </button>

                            {{-- Crop & Reposition --}}
                            <button
                                type="button"
                                wire:click="openCropModal('{{ $item['path'] }}', '{{ $item['url'] }}')"
                                title="Crop & Reposition image"
                                class="p-2 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md transition transform hover:scale-110"
                            >
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>
                            </button>

                            {{-- In-Place Optimization --}}
                            <button
                                type="button"
                                wire:click="optimizeMedia('{{ $item['path'] }}')"
                                title="Compress & Optimize image"
                                class="p-2 rounded-full bg-white/90 hover:bg-white text-green-700 shadow-md transition transform hover:scale-110"
                            >
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                            </button>

                            {{-- Delete --}}
                            <button
                                type="button"
                                wire:confirm="Are you sure you want to permanently delete this image from the server?"
                                wire:click="deleteMedia('{{ $item['path'] }}')"
                                title="Delete image"
                                class="p-2 rounded-full bg-white/90 hover:bg-white text-red-600 shadow-md transition transform hover:scale-110"
                            >
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </div>

                    {{-- Image Meta Footer --}}
                    <div class="p-3 flex flex-col gap-1">
                        <p class="text-xs font-bold text-gray-900 truncate" title="{{ $item['name'] }}">
                            {{ $item['name'] }}
                        </p>
                        <div class="flex items-center justify-between text-[11px] text-gray-500">
                            <span>{{ $item['dimensions'] }}</span>
                            <span class="font-medium bg-gray-100 px-1.5 py-0.5 rounded">{{ $item['size_formatted'] }}</span>
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-span-full py-16 flex flex-col items-center justify-center text-center text-gray-400 bg-white rounded-2xl border border-gray-200">
                    <svg class="w-12 h-12 mb-3 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <p class="text-base font-bold text-gray-700">No media found</p>
                    <p class="text-xs text-gray-500 mt-1">Try changing your search term or upload a new image.</p>
                </div>
            @endforelse
        </div>

        {{-- Cropper Modal --}}
        <div
            x-show="cropOpen"
            x-cloak
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <div
                @click.outside="cropOpen = false; if (cropper) cropper.destroy()"
                class="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]"
            >
                {{-- Modal Header --}}
                <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h3 class="font-bold text-gray-900 text-base">Crop & Reposition</h3>
                        <p class="text-xs text-gray-500">Drag image to reposition, or switch to crop mode to adjust bounds.</p>
                    </div>
                    <button type="button" @click="cropOpen = false; if (cropper) cropper.destroy()" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                {{-- Modal Body with Image Canvas --}}
                <div class="flex-1 bg-gray-900 p-4 flex items-center justify-center overflow-hidden min-h-[350px]">
                    <img x-ref="cropImg" :src="cropUrl" class="max-h-[50vh] max-w-full object-contain" />
                </div>

                {{-- Modal Controls & Actions --}}
                <div class="px-6 py-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50">
                    {{-- Drag Mode Toggle --}}
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-semibold text-gray-600">Drag:</span>
                        <div class="flex rounded-xl bg-gray-200/80 p-0.5 text-xs font-semibold">
                            <button
                                type="button"
                                @click="setDrag('move')"
                                :class="dragMode === 'move' ? 'bg-[#353536] text-white shadow-sm' : 'text-gray-700 hover:text-gray-900'"
                                class="px-2.5 py-1 rounded-lg transition"
                            >
                                Reposition
                            </button>
                            <button
                                type="button"
                                @click="setDrag('crop')"
                                :class="dragMode === 'crop' ? 'bg-[#353536] text-white shadow-sm' : 'text-gray-700 hover:text-gray-900'"
                                class="px-2.5 py-1 rounded-lg transition"
                            >
                                Crop
                            </button>
                        </div>
                    </div>

                    {{-- Aspect Ratios --}}
                    <div class="flex items-center gap-1 text-xs">
                        <span class="text-xs font-semibold text-gray-600 mr-1">Aspect:</span>
                        <button type="button" @click="setRatio(null)" :class="aspectRatio === null ? 'bg-[#353536] text-white' : 'bg-white border text-gray-700'" class="px-2 py-1 rounded-lg font-bold transition">Free</button>
                        <button type="button" @click="setRatio(16/9)" :class="aspectRatio === 16/9 ? 'bg-[#353536] text-white' : 'bg-white border text-gray-700'" class="px-2 py-1 rounded-lg font-bold transition">16:9</button>
                        <button type="button" @click="setRatio(4/3)" :class="aspectRatio === 4/3 ? 'bg-[#353536] text-white' : 'bg-white border text-gray-700'" class="px-2 py-1 rounded-lg font-bold transition">4:3</button>
                        <button type="button" @click="setRatio(1)" :class="aspectRatio === 1 ? 'bg-[#353536] text-white' : 'bg-white border text-gray-700'" class="px-2 py-1 rounded-lg font-bold transition">1:1</button>
                    </div>

                    {{-- Save / Cancel --}}
                    <div class="flex items-center gap-2">
                        <button
                            type="button"
                            @click="cropOpen = false; if (cropper) cropper.destroy()"
                            class="px-4 py-2 rounded-full border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            @click="saveCrop()"
                            class="px-5 py-2 rounded-full bg-[#FB2436] hover:bg-[#C4101F] text-white text-xs font-bold shadow-md transition"
                        >
                            Save & Optimize
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-filament-panels::page>
