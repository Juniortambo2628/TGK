<x-filament-panels::page>
    <form wire:submit="save" class="space-y-6">
        {{ $this->form }}

        <div class="flex items-center justify-between gap-3 border-t border-gray-950/5 dark:border-white/10 pt-6">
            <a href="{{ url($this->publicPath ?? '/') }}" target="_blank" rel="noopener"
               class="text-sm text-primary-600 hover:underline flex items-center gap-1">
                Preview the public page ↗
            </a>
            <x-filament::button type="submit" size="lg">
                Save changes
            </x-filament::button>
        </div>
    </form>
</x-filament-panels::page>
