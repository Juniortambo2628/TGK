<?php

namespace App\Filament\Actions;

use App\Support\MediaLibrary;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Hidden;

/**
 * Reusable modal action attached to FileUpload fields to allow editors
 * to select existing images from the server without uploading duplicates.
 */
class MediaPickerAction
{
    public static function make(string $name = 'selectFromMedia'): Action
    {
        return Action::make($name)
            ->label('Choose from Media')
            ->icon('heroicon-m-photo')
            ->color('gray')
            ->modalHeading('Select from Media Library')
            ->modalDescription('Pick existing photos from the server to avoid duplicating files.')
            ->modalWidth('6xl')
            ->modalSubmitActionLabel('Insert Selected')
            ->modalContent(function (FileUpload $component) {
                return view('filament.components.media-picker-modal', [
                    'statePath'  => $component->getStatePath(),
                    'isMultiple' => $component->isMultiple(),
                    'mediaItems' => MediaLibrary::all(),
                    'folders'    => MediaLibrary::folders(),
                ]);
            })
            ->form([
                Hidden::make('selected_media_paths')
                    ->default('[]'),
            ])
            ->action(function (array $data, FileUpload $component) {
                $raw = $data['selected_media_paths'] ?? '[]';
                $paths = is_array($raw) ? $raw : json_decode($raw, true);

                if (empty($paths)) {
                    if (is_string($raw) && !empty($raw) && $raw !== '[]') {
                        $paths = array_filter(explode(',', $raw));
                    } else {
                        return;
                    }
                }

                $paths = array_values(array_filter((array) $paths));

                if (empty($paths)) {
                    return;
                }

                if ($component->isMultiple()) {
                    $current = (array) ($component->getState() ?? []);
                    $merged = array_values(array_unique(array_merge($current, $paths)));
                    $component->state($merged);
                } else {
                    $selected = reset($paths);
                    $component->state($selected ? [$selected] : []);
                }
            });
    }
}
