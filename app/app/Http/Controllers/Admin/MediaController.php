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

        $file = $request->file('file');
        $path = $file->store('uploads/library', 'public');
        ImageOptimizer::optimizeUploadedFile($file, 'public', 'uploads/library');

        return response()->json(['path' => $path, 'url' => asset('storage/'.$path)]);
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
