<?php

namespace App\Filament\Support;

use App\Filament\Actions\MediaPickerAction;
use App\Support\Html;
use App\Support\ImageOptimizer;
use App\Support\Routes;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Fieldset;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Get;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

/**
 * Factories for form fields we use across every content editor. Change the
 * defaults here and every admin page picks them up. Keeps our admin UI
 * consistent and cuts a lot of boilerplate.
 */
class FormComponents
{
    /** Rich text with a curated toolbar and server-side sanitisation on save. */
    public static function richText(string $name, ?string $label = null): RichEditor
    {
        return RichEditor::make($name)
            ->label($label ?: str($name)->headline())
            ->toolbarButtons([
                'bold', 'italic', 'underline', 'strike',
                'link',
                'h2', 'h3',
                'bulletList', 'orderedList', 'blockquote',
                'undo', 'redo',
            ])
            ->extraAttributes(['class' => 'gk-rich'])
            ->dehydrateStateUsing(fn ($state) => Html::purify((string) ($state ?? '')));
    }

    /**
     * A FilePond-powered image upload with drag-and-drop, a branded drop
     * zone, an image editor and previews for both freshly uploaded files
     * AND already-configured legacy paths (e.g. bundled seed images stored
     * as "images/landing/hero-slide-1.jpg" which don't live on the storage
     * disk). See getUploadedFileUsing() below — it resolves the correct
     * public URL regardless of where the file physically lives.
     */
    public static function imageUpload(string $name, string $folder = 'content', ?string $label = null): FileUpload
    {
        return FileUpload::make($name)
            ->label($label ?: str($name)->headline())
            ->disk('public')
            ->directory("uploads/{$folder}")
            ->visibility('public')
            ->image()
            ->imageEditor()
            ->imageEditorMode(2)
            ->imageEditorAspectRatios(['16:9', '4:3', '1:1', null])
            ->imagePreviewHeight('220')
            ->openable()
            ->downloadable()
            ->fetchFileInformation(false)
            ->maxSize(15360) // 15 MB raw allowed, automatically compressed to WebP/JPEG
            ->uploadingMessage('Optimizing & uploading, one moment…')
            ->extraAttributes(['class' => 'gk-uploader'])
            ->hintAction(MediaPickerAction::make())
            ->saveUploadedFileUsing(function (TemporaryUploadedFile $file, $component) {
                return ImageOptimizer::optimizeUploadedFile(
                    $file,
                    $component->getDiskName(),
                    $component->getDirectory()
                );
            })
            ->getUploadedFileUsing(static::uploadedFileResolver());
    }

    /**
     * Multi-image upload (image gallery / carousel slides). Grid panel so
     * every image renders as its own tile, reorderable via drag.
     */
    public static function imageGallery(string $name, string $folder = 'gallery', ?string $label = null): FileUpload
    {
        return static::imageUpload($name, $folder, $label)
            ->multiple()
            ->reorderable()
            ->panelLayout('grid')
            ->maxFiles(12)
            ->extraAttributes(['class' => 'gk-uploader gk-uploader--gallery']);
    }

    /**
     * Return a closure that turns a stored file reference into the object
     * FilePond expects for its preview. We support three prefixes:
     *
     *   - "uploads/…"  → user uploads under public/storage/uploads/
     *   - "images/…"   → bundled/seeded assets under public/images/
     *   - full "http…" → external URL, passed through as-is
     *
     * Without this, seed images stored as "images/landing/…" render as a
     * broken preview because Filament's default asks the storage disk for
     * a URL that doesn't exist.
     */
    protected static function uploadedFileResolver(): \Closure
    {
        return function ($file, $storedFileNames = null, $component = null) {
            $path = is_string($file) ? $file : (is_string($component) ? $component : null);
            if (empty($path)) {
                return null;
            }

            $url = str_starts_with($path, 'http')
                ? $path
                : (str_starts_with($path, 'uploads/')
                    ? asset('storage/'.$path)
                    : (str_starts_with($path, 'images/')
                        ? asset($path)
                        : (file_exists(public_path($path))
                            ? asset($path)
                            : asset('storage/'.ltrim($path, '/')))));

            $localFile = public_path(str_starts_with($path, 'uploads/') ? 'storage/'.$path : $path);
            $size = file_exists($localFile) ? @filesize($localFile) ?: 0 : 0;
            $mime = file_exists($localFile) ? (@mime_content_type($localFile) ?: 'image/jpeg') : 'image/jpeg';

            return [
                'name' => basename($path),
                'size' => $size,
                'type' => $mime,
                'url'  => $url,
            ];
        };
    }

    /**
     * A link picker: a Destination select (every public route + Donate URL
     * + External URL) plus a Button label. The external URL field only
     * appears when the admin picks "External URL". State paths are flat
     * (namePrefix + '_route' / '_external' / '_label'), so they map 1:1
     * to CMS content-block keys without any nested-state gymnastics.
     */
    public static function linkPicker(string $namePrefix, string $label): Fieldset
    {
        return Fieldset::make($label)
            ->schema([
                Select::make($namePrefix.'_route')
                    ->label('Destination')
                    ->options(Routes::forSelect())
                    ->searchable()
                    ->preload()
                    ->placeholder('Pick a page…')
                    ->live()
                    ->native(false)
                    ->helperText('Where the button takes the visitor. Choose an internal page, the Donate URL, or a custom external link.')
                    ->columnSpan(1),
                TextInput::make($namePrefix.'_label')
                    ->label('Button label')
                    ->placeholder('e.g. Support a young person')
                    ->maxLength(80)
                    ->columnSpan(1),
                TextInput::make($namePrefix.'_external')
                    ->label('External URL')
                    ->url()
                    ->placeholder('https://…')
                    ->visible(fn (Get $get) => $get($namePrefix.'_route') === '__external')
                    ->columnSpanFull(),
            ])
            ->columns(2);
    }

    /** Compact grid helper so nested schemas match spacing across pages. */
    public static function twoColumn(array $schema): Grid
    {
        return Grid::make(2)->schema($schema);
    }

    /** Repeater for "stat" blocks (value + label + description). */
    public static function statsRepeater(string $name, string $label = 'Impact numbers'): Repeater
    {
        return Repeater::make($name)
            ->label($label)
            ->schema([
                TextInput::make('value')->required()->maxLength(20)->placeholder('e.g. 600 or 75%'),
                TextInput::make('label')->required()->maxLength(60),
                TextInput::make('description')->maxLength(160),
            ])
            ->columns(3)
            ->addActionLabel('Add another stat')
            ->reorderable()
            ->collapsible()
            ->itemLabel(fn (array $state): ?string => $state['label'] ?? null);
    }
}
