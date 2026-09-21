<?php

use App\Http\Controllers\FormController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\StoryController;
use Illuminate\Support\Facades\Route;

// Public pages
Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/our-model', [PageController::class, 'ourModel'])->name('our-model');
Route::get('/regina-yego', [PageController::class, 'reginaYego'])->name('regina-yego');
Route::get('/stawi', [PageController::class, 'stawi'])->name('stawi');
Route::get('/partners', [PageController::class, 'partners'])->name('partners');
Route::get('/get-involved', [PageController::class, 'getInvolved'])->name('get-involved');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');

// Stories
Route::get('/stories', [StoryController::class, 'index'])->name('stories.index');
Route::get('/stories/{slug}', [StoryController::class, 'show'])->name('stories.show');

// Legacy WordPress permalinks → new story slugs, so shared links keep working
Route::redirect('/isabel-cohort-11', '/stories/isabel-cohort-11', 301);
Route::redirect('/robert', '/stories/roberts-rise', 301);
Route::redirect('/lyann-jerono', '/stories/lyann-jerono', 301);
Route::redirect('/vinicky', '/stories/vinicky-journey-cohort-5', 301);
Route::redirect('/blog', '/stories', 301);

// Forms
Route::post('/newsletter', [FormController::class, 'subscribe'])->name('newsletter');
Route::post('/contact', [FormController::class, 'contact'])->name('contact.submit');
Route::post('/get-involved/mentor', [FormController::class, 'mentor'])->name('mentor');
Route::post('/get-involved/scholarship', [FormController::class, 'scholarship'])->name('scholarship');
Route::post('/get-involved/register', [FormController::class, 'register'])->name('register');

// Sitemap.xml (generated on demand, cached 6h)
Route::get('/sitemap.xml', function () {
    return \Illuminate\Support\Facades\Cache::remember('sitemap.xml', now()->addHours(6), function () {
        $sitemap = \Spatie\Sitemap\Sitemap::create()
            ->add(\Spatie\Sitemap\Tags\Url::create('/')->setPriority(1.0))
            ->add(\Spatie\Sitemap\Tags\Url::create('/about'))
            ->add(\Spatie\Sitemap\Tags\Url::create('/our-model'))
            ->add(\Spatie\Sitemap\Tags\Url::create('/regina-yego'))
            ->add(\Spatie\Sitemap\Tags\Url::create('/stawi'))
            ->add(\Spatie\Sitemap\Tags\Url::create('/stories'))
            ->add(\Spatie\Sitemap\Tags\Url::create('/partners'))
            ->add(\Spatie\Sitemap\Tags\Url::create('/get-involved'))
            ->add(\Spatie\Sitemap\Tags\Url::create('/contact'));

        foreach (\App\Models\Post::published()->get() as $p) {
            $sitemap->add(
                \Spatie\Sitemap\Tags\Url::create('/stories/'.$p->slug)
                    ->setLastModificationDate($p->updated_at)
                    ->setPriority(0.7)
            );
        }

        return $sitemap->render();
    });
})->name('sitemap');
