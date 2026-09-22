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

// Admin (React + Inertia)
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard — root /admin goes here
    Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard.index');

    // Content editors (9 pages)
    Route::get('/content/{page}', [\App\Http\Controllers\Admin\ContentController::class, 'edit'])->name('content.edit');
    Route::put('/content/{page}', [\App\Http\Controllers\Admin\ContentController::class, 'update'])->name('content.update');

    // Posts (Stories)
    Route::resource('posts', \App\Http\Controllers\Admin\PostController::class)->except(['show']);

    // Partners
    Route::resource('partners', \App\Http\Controllers\Admin\PartnerController::class)->except(['show']);

    // Submissions
    Route::get('/contact-messages', [\App\Http\Controllers\Admin\ContactMessageController::class, 'index'])->name('contact-messages.index');
    Route::patch('/contact-messages/{contactMessage}/status', [\App\Http\Controllers\Admin\ContactMessageController::class, 'updateStatus'])->name('contact-messages.status');
    Route::delete('/contact-messages/{contactMessage}', [\App\Http\Controllers\Admin\ContactMessageController::class, 'destroy'])->name('contact-messages.destroy');

    Route::get('/mentor-applications', [\App\Http\Controllers\Admin\MentorApplicationController::class, 'index'])->name('mentor-applications.index');
    Route::patch('/mentor-applications/{mentorApplication}/status', [\App\Http\Controllers\Admin\MentorApplicationController::class, 'updateStatus'])->name('mentor-applications.status');
    Route::delete('/mentor-applications/{mentorApplication}', [\App\Http\Controllers\Admin\MentorApplicationController::class, 'destroy'])->name('mentor-applications.destroy');

    Route::get('/registrations', [\App\Http\Controllers\Admin\RegistrationController::class, 'index'])->name('registrations.index');
    Route::patch('/registrations/{registration}/status', [\App\Http\Controllers\Admin\RegistrationController::class, 'updateStatus'])->name('registrations.status');
    Route::delete('/registrations/{registration}', [\App\Http\Controllers\Admin\RegistrationController::class, 'destroy'])->name('registrations.destroy');

    Route::get('/scholarship-applications', [\App\Http\Controllers\Admin\ScholarshipApplicationController::class, 'index'])->name('scholarship-applications.index');
    Route::patch('/scholarship-applications/{scholarshipApplication}/status', [\App\Http\Controllers\Admin\ScholarshipApplicationController::class, 'updateStatus'])->name('scholarship-applications.status');
    Route::delete('/scholarship-applications/{scholarshipApplication}', [\App\Http\Controllers\Admin\ScholarshipApplicationController::class, 'destroy'])->name('scholarship-applications.destroy');

    Route::get('/subscribers', [\App\Http\Controllers\Admin\SubscriberController::class, 'index'])->name('subscribers.index');
    Route::delete('/subscribers/{subscriber}', [\App\Http\Controllers\Admin\SubscriberController::class, 'destroy'])->name('subscribers.destroy');

    // Users
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class)->except(['show']);

    // Media Gallery
    Route::get('/media', [\App\Http\Controllers\Admin\MediaController::class, 'index'])->name('media.index');
    Route::post('/media/upload', [\App\Http\Controllers\Admin\MediaController::class, 'upload'])->name('media.upload');
    Route::delete('/media', [\App\Http\Controllers\Admin\MediaController::class, 'destroy'])->name('media.destroy');
    Route::post('/media/optimize', [\App\Http\Controllers\Admin\MediaController::class, 'optimize'])->name('media.optimize');
    Route::post('/media/crop', [\App\Http\Controllers\Admin\MediaController::class, 'crop'])->name('media.crop');

    // Settings
    Route::get('/settings/{tab?}', [\App\Http\Controllers\Admin\SettingController::class, 'edit'])->name('settings.edit');
    Route::put('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');

    // Profile
    Route::get('/profile', [\App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [\App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profile.update');
});

// Admin login (public)
Route::middleware('guest')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [\App\Http\Controllers\Admin\AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [\App\Http\Controllers\Admin\AuthController::class, 'login'])->name('login.post');
});

Route::post('/admin/logout', [\App\Http\Controllers\Admin\AuthController::class, 'logout'])->middleware('auth')->name('admin.logout');

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
