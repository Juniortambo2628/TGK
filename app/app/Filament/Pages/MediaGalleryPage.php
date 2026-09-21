<?php

namespace App\Filament\Pages;

use App\Support\ImageOptimizer;
use App\Support\MediaLibrary;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Collection;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class MediaGalleryPage extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-photo';
    protected static ?string $navigationGroup = 'Content';
    protected static ?string $navigationLabel = 'Media Gallery';
    protected static ?string $slug = 'media-gallery';
    protected static ?int $navigationSort = 11;
    protected static string $view = 'filament.pages.media-gallery';
    protected static ?string $title = 'Media Gallery';

    public string $search = '';
    public string $activeFolder = 'all';
    public ?string $cropTarget = null;
    public ?string $cropUrl = null;

    public function mount(): void
    {
        // Initial setup
    }

    public function getBreadcrumbs(): array
    {
        return [
            url('/admin') => 'Dashboard',
            '#'           => 'Content',
            'Media Gallery',
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('uploadMedia')
                ->label('Upload Media')
                ->icon('heroicon-o-arrow-up-tray')
                ->color('danger')
                ->modalHeading('Upload and Optimize New Images')
                ->modalDescription('Images are automatically downscaled, compressed (82% WebP/JPEG), and optimized on upload.')
                ->modalWidth('2xl')
                ->modalSubmitActionLabel('Done')
                ->form([
                    FileUpload::make('new_uploads')
                        ->label('Select or Drop Images')
                        ->multiple()
                        ->image()
                        ->imagePreviewHeight('180')
                        ->disk('public')
                        ->directory('uploads/library')
                        ->visibility('public')
                        ->maxSize(15360)
                        ->saveUploadedFileUsing(function (TemporaryUploadedFile $file, $component) {
                            return ImageOptimizer::optimizeUploadedFile(
                                $file,
                                $component->getDiskName(),
                                $component->getDirectory()
                            );
                        }),
                ])
                ->action(function (array $data) {
                    Notification::make()
                        ->success()
                        ->title('Upload Complete')
                        ->body('Your images were compressed, optimized, and added to the media library.')
                        ->send();
                }),
        ];
    }

    public function getMediaProperty(): Collection
    {
        return MediaLibrary::all($this->search, $this->activeFolder);
    }

    public function getFoldersProperty(): array
    {
        return MediaLibrary::folders();
    }

    public function filterFolder(string $folder): void
    {
        $this->activeFolder = $folder;
    }

    public function optimizeMedia(string $path): void
    {
        $result = MediaLibrary::optimize($path);

        if (($result['saved_percent'] ?? 0) > 0) {
            $saved = MediaLibrary::formatBytes($result['saved_bytes'] ?? 0);
            Notification::make()
                ->success()
                ->title('Image Optimized')
                ->body("Reduced file size by {$result['saved_percent']}% (saved {$saved}).")
                ->send();
        } else {
            Notification::make()
                ->info()
                ->title('Already Fully Optimized')
                ->body('This image is already compressed to optimal web standards.')
                ->send();
        }
    }

    public function deleteMedia(string $path): void
    {
        if (MediaLibrary::delete($path)) {
            Notification::make()
                ->success()
                ->title('Image Deleted')
                ->body('The image was removed from the server.')
                ->send();
        } else {
            Notification::make()
                ->danger()
                ->title('Could Not Delete')
                ->body('The file could not be removed.')
                ->send();
        }
    }

    public function openCropModal(string $path, string $url): void
    {
        $this->cropTarget = $path;
        $this->cropUrl = $url;
        $this->dispatch('open-crop-editor', path: $path, url: $url);
    }

    public function applyCrop(array $cropData): void
    {
        if (!$this->cropTarget) {
            return;
        }

        $resultPath = MediaLibrary::crop($this->cropTarget, $cropData);

        $this->cropTarget = null;
        $this->cropUrl = null;

        if ($resultPath) {
            Notification::make()
                ->success()
                ->title('Image Cropped & Repositioned')
                ->body('Your adjustments were saved and optimized.')
                ->send();
        }
    }
}
