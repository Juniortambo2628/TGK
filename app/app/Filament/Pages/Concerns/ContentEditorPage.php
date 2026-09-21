<?php

namespace App\Filament\Pages\Concerns;

use App\Models\ContentBlock;
use App\Support\Content;
use Filament\Notifications\Notification;

/**
 * Shared trait for every "page content" editor. Subclasses only need to:
 *  - set  static ?string $pageSlug   (e.g. 'home')
 *  - implement  form(Form)  with fields whose names encode the block key
 *    using dot-notation preserved via `->statePath()` — or use plain names
 *    that we map to keys via `contentKeys()`.
 *
 * The trait provides the mount() to hydrate the form from content_blocks,
 * a save() action that persists back, and getBreadcrumbs()/getHeading()
 * for the consistent hero shown on top of every admin page.
 */
trait ContentEditorPage
{
    public array $data = [];

    public function mount(): void
    {
        $c = Content::for(static::$pageSlug);
        $keys = $this->contentKeys();
        $state = [];
        foreach ($keys as $key => $type) {
            $state[$this->stateKey($key)] = match ($type) {
                'array', 'gallery', 'stats' => $c->array($key, []),
                default                     => $c->text($key, ''),
            };
        }
        $this->form->fill($state);
    }

    public function save(): void
    {
        $state = $this->form->getState();

        foreach ($this->contentKeys() as $key => $type) {
            $value = $state[$this->stateKey($key)] ?? null;
            ContentBlock::set(static::$pageSlug, $key, $value);
        }

        Content::flush(static::$pageSlug);

        Notification::make()
            ->success()
            ->title('Saved')
            ->body('Your changes are live.')
            ->send();
    }

    /**
     * @return array<string,string>  map of ['content.block.key' => 'string|array|gallery|stats']
     */
    abstract protected function contentKeys(): array;

    protected function stateKey(string $contentKey): string
    {
        return str_replace('.', '__', $contentKey);
    }

    public function getBreadcrumbs(): array
    {
        return [
            url('/admin') => 'Dashboard',
            '#'           => 'Content',
            static::getNavigationLabel(),
        ];
    }
}
