<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $stories = json_decode(file_get_contents(database_path('seeders/data/stories.json')), true);

        foreach ($stories as $s) {
            Post::updateOrCreate(
                ['slug' => $s['slug']],
                [
                    'title' => $s['title'],
                    'excerpt' => $s['excerpt'],
                    'body' => $s['body'],
                    'hero_image' => $s['hero_image'],
                    'seo_title' => $s['title'],
                    'seo_description' => $s['excerpt'],
                    'published_at' => $s['published_at'],
                ]
            );
        }
    }
}
