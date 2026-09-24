<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Posts/Index', [
            'posts' => Post::latest('published_at')->latest()->get()->map->toPublicArray(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Posts/Form', [
            'post' => null,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|max:200',
            'slug' => 'required|max:200|unique:posts,slug',
            'excerpt' => 'nullable|max:500',
            'body' => 'required',
            'hero_image' => 'nullable|string',
            'seo_title' => 'nullable|max:200',
            'seo_description' => 'nullable|max:300',
            'published_at' => 'nullable|date',
        ]);

        Post::create($data);

        Cache::forget('sitemap.xml');

        return redirect()->route('admin.posts.index')->with('success', 'Story created.');
    }

    public function edit(Post $post)
    {
        return Inertia::render('Admin/Posts/Form', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'body' => $post->body,
                'hero_image' => $post->hero_image,
                'seo_title' => $post->seo_title,
                'seo_description' => $post->seo_description,
                'published_at' => optional($post->published_at)->toIso8601String(),
            ],
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $data = $request->validate([
            'title' => 'required|max:200',
            'slug' => 'required|max:200|unique:posts,slug,'.$post->id,
            'excerpt' => 'nullable|max:500',
            'body' => 'required',
            'hero_image' => 'nullable|string',
            'seo_title' => 'nullable|max:200',
            'seo_description' => 'nullable|max:300',
            'published_at' => 'nullable|date',
        ]);

        $post->update($data);

        Cache::forget('sitemap.xml');

        return redirect()->route('admin.posts.index')->with('success', 'Story updated.');
    }

    public function destroy(Post $post)
    {
        $post->delete();

        Cache::forget('sitemap.xml');

        return redirect()->route('admin.posts.index')->with('success', 'Story deleted.');
    }
}
