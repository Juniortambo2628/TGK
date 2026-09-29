<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\ImageOptimizer;
use App\Support\MediaLibrary;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MediaController extends Controller
{
    public function index()
    {
        $search = request('search', '');
        $folder = request('folder', 'all');

        return Inertia::render('Admin/MediaGallery', [
            'media' => MediaLibrary::all($search, $folder),
            'folders' => MediaLibrary::folders(),
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate(['file' => 'required|file|image|max:15360']);

        $folder = trim(preg_replace('#[^a-z0-9/_-]#i', '', (string) $request->input('folder', '')), '/');
        $directory = 'uploads/'.($folder !== '' && $folder !== 'uploads' ? $folder : 'library');

        // Store exactly one optimized file. Previously we also called
        // ->store() first, which left an un-optimized duplicate in the library
        // on every upload.
        $path = ImageOptimizer::optimizeUploadedFile($request->file('file'), 'public', $directory);

        return response()->json(['path' => $path, 'url' => asset('storage/'.$path)]);
    }

    /**
     * JSON list of library media for the in-form "Select from library" picker.
     */
    public function library(Request $request)
    {
        return response()->json([
            'media' => MediaLibrary::all($request->input('search'), $request->input('folder', 'all'))
                ->map(fn ($m) => [
                    'id' => $m['id'],
                    'name' => $m['name'],
                    'path' => $m['path'],
                    'url' => $m['url'],
                    'folder' => $m['folder'],
                ])
                ->values(),
            'folders' => MediaLibrary::folders(),
        ]);
    }

    public function destroy(Request $request)
    {
        $request->validate(['path' => 'required|string']);

        MediaLibrary::delete($request->path);

        return back()->with('success', 'Image deleted.');
    }

    public function optimize(Request $request)
    {
        $request->validate(['path' => 'required|string']);

        MediaLibrary::optimize($request->path);

        return back()->with('success', 'Image optimized.');
    }

    public function crop(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
            'cropData' => 'required|array',
        ]);

        MediaLibrary::crop($request->path, $request->cropData);

        return back()->with('success', 'Image cropped.');
    }
}
