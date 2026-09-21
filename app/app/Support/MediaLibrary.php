<?php

namespace App\Support;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

/**
 * Service to discover, search, filter, and manage all media assets
 * stored across public/images (seed assets) and storage/app/public/uploads (user uploads).
 */
class MediaLibrary
{
    /**
     * Retrieve all media files matching optional search query and folder filter.
     *
     * @return Collection<int, array{
     *     id: string,
     *     name: string,
     *     path: string,
     *     url: string,
     *     absolute_path: string,
     *     size: int,
     *     size_formatted: string,
     *     dimensions: string,
     *     width: int,
     *     height: int,
     *     mime: string,
     *     folder: string,
     *     is_seed: bool,
     *     modified_at: int,
     *     modified_formatted: string
     * }>
     */
    public static function all(?string $search = null, ?string $folder = null): Collection
    {
        $items = collect();

        // 1. Scan user uploads in storage/app/public/uploads
        $uploadsRoot = storage_path('app/public/uploads');
        if (File::isDirectory($uploadsRoot)) {
            $uploadFiles = File::allFiles($uploadsRoot);
            foreach ($uploadFiles as $file) {
                if (static::isImageFile($file->getPathname())) {
                    $relStorage = 'uploads/'.ltrim(str_replace('\\', '/', substr($file->getPathname(), strlen($uploadsRoot))), '/');
                    $subFolder = dirname(substr($file->getPathname(), strlen($uploadsRoot) + 1));
                    $folderName = $subFolder !== '.' && $subFolder !== '' ? str_replace('\\', '/', $subFolder) : 'uploads';

                    $items->push(static::makeMediaRecord(
                        file: $file,
                        relativePath: $relStorage,
                        url: asset('storage/'.$relStorage),
                        folder: $folderName,
                        isSeed: false
                    ));
                }
            }
        }

        // 2. Scan bundled seed images in public/images
        $seedFolders = ['landing', 'stories', 'partners', 'gallery', 'products'];
        $publicImagesRoot = public_path('images');

        foreach ($seedFolders as $sub) {
            $dir = $publicImagesRoot.DIRECTORY_SEPARATOR.$sub;
            if (File::isDirectory($dir)) {
                $seedFiles = File::files($dir);
                foreach ($seedFiles as $file) {
                    if (static::isImageFile($file->getPathname())) {
                        $rel = "images/{$sub}/".$file->getFilename();
                        $items->push(static::makeMediaRecord(
                            file: $file,
                            relativePath: $rel,
                            url: asset($rel),
                            folder: $sub,
                            isSeed: true
                        ));
                    }
                }
            }
        }

        // Filter by folder
        if (!empty($folder) && $folder !== 'all') {
            $items = $items->filter(fn ($item) => strcasecmp($item['folder'], $folder) === 0);
        }

        // Filter by search query
        if (!empty($search)) {
            $term = mb_strtolower(trim($search));
            $items = $items->filter(function ($item) use ($term) {
                return str_contains(mb_strtolower($item['name']), $term)
                    || str_contains(mb_strtolower($item['folder']), $term)
                    || str_contains(mb_strtolower($item['path']), $term);
            });
        }

        // Sort by most recently modified
        return $items->sortByDesc('modified_at')->values();
    }

    /**
     * Get unique folder categories for filter tabs.
     *
     * @return array<string, int> Map of [folder_name => count]
     */
    public static function folders(): array
    {
        $all = static::all();
        $counts = ['all' => $all->count()];

        foreach ($all->groupBy('folder') as $folder => $group) {
            $counts[$folder] = $group->count();
        }

        return $counts;
    }

    /**
     * Delete an image from storage disk. Note: seed images in public/images can be deleted if permitted,
     * or restricted to uploaded files.
     */
    public static function delete(string $path): bool
    {
        $cleanPath = ltrim($path, '/');

        if (str_starts_with($cleanPath, 'uploads/')) {
            $storageDiskPath = $cleanPath;
            if (Storage::disk('public')->exists($storageDiskPath)) {
                return Storage::disk('public')->delete($storageDiskPath);
            }
        } elseif (str_starts_with($cleanPath, 'images/')) {
            $local = public_path($cleanPath);
            if (File::exists($local)) {
                return File::delete($local);
            }
        }

        return false;
    }

    /**
     * Optimize an image file in-place using ImageOptimizer.
     */
    public static function optimize(string $path): array
    {
        $absolute = static::resolveAbsolutePath($path);
        if (!$absolute || !file_exists($absolute)) {
            return ['saved_percent' => 0, 'old_size' => 0, 'new_size' => 0, 'saved_bytes' => 0];
        }

        return ImageOptimizer::optimizeInPlace($absolute);
    }

    /**
     * Crop & reposition an existing image in-place or create a cropped variant.
     */
    public static function crop(string $path, array $cropData): ?string
    {
        $absolute = static::resolveAbsolutePath($path);
        if (!$absolute || !file_exists($absolute)) {
            return null;
        }

        // If it's a seed image, make a copy in uploads/custom to preserve original
        if (str_starts_with(ltrim($path, '/'), 'images/')) {
            $filename = 'crop_'.pathinfo($absolute, PATHINFO_FILENAME).'_'.time().'.webp';
            $destDir = storage_path('app/public/uploads/cropped');
            if (!File::isDirectory($destDir)) {
                File::makeDirectory($destDir, 0755, true);
            }
            $destPath = $destDir.DIRECTORY_SEPARATOR.$filename;
            ImageOptimizer::cropAndReposition($absolute, $cropData, $destPath);
            return 'uploads/cropped/'.$filename;
        }

        // For user uploads, update directly
        ImageOptimizer::cropAndReposition($absolute, $cropData, $absolute);
        return $path;
    }

    /**
     * Resolve absolute filesystem path from a relative path (uploads/... or images/...).
     */
    public static function resolveAbsolutePath(string $path): ?string
    {
        $clean = ltrim($path, '/');

        if (str_starts_with($clean, 'uploads/')) {
            return storage_path('app/public/'.$clean);
        }

        if (str_starts_with($clean, 'images/')) {
            return public_path($clean);
        }

        if (file_exists(public_path($clean))) {
            return public_path($clean);
        }

        if (file_exists(storage_path('app/public/'.$clean))) {
            return storage_path('app/public/'.$clean);
        }

        return null;
    }

    /**
     * Helper to build a media array record.
     */
    protected static function makeMediaRecord(
        \SplFileInfo $file,
        string $relativePath,
        string $url,
        string $folder,
        bool $isSeed
    ): array {
        $realPath = $file->getPathname();
        $size = $file->getSize();
        $imgInfo = @getimagesize($realPath);
        $w = $imgInfo ? $imgInfo[0] : 0;
        $h = $imgInfo ? $imgInfo[1] : 0;
        $mime = $imgInfo ? $imgInfo['mime'] : (@mime_content_type($realPath) ?: 'image/jpeg');

        return [
            'id'                 => md5($relativePath),
            'name'               => $file->getFilename(),
            'path'               => $relativePath,
            'url'                => $url,
            'absolute_path'      => $realPath,
            'size'               => $size,
            'size_formatted'     => static::formatBytes($size),
            'dimensions'         => $w > 0 ? "{$w} × {$h}" : '—',
            'width'              => $w,
            'height'             => $h,
            'mime'               => $mime,
            'folder'             => $folder,
            'is_seed'            => $isSeed,
            'modified_at'        => $file->getMTime(),
            'modified_formatted' => date('M j, Y g:i a', $file->getMTime()),
        ];
    }

    public static function isImageFile(string $path): bool
    {
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        return in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']);
    }

    public static function formatBytes(int $bytes, int $precision = 1): string
    {
        if ($bytes <= 0) return '0 B';
        $units = ['B', 'KB', 'MB', 'GB'];
        $power = min((int) floor(log($bytes, 1024)), count($units) - 1);
        return round($bytes / pow(1024, $power), $precision).' '.$units[$power];
    }
}
