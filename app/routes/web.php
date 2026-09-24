<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\MentorApplicationController;
use App\Http\Controllers\Admin\PartnerController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\RegistrationController;
use App\Http\Controllers\Admin\ScholarshipApplicationController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\SubscriberController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\StoryController;
use App\Models\Post;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

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
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    // Content editors (9 pages)
    Route::get('/content/{page}', [ContentController::class, 'edit'])->name('content.edit');
    Route::put('/content/{page}', [ContentController::class, 'update'])->name('content.update');

    // Posts (Stories)
    Route::resource('posts', PostController::class)->except(['show']);

    // Partners
    Route::resource('partners', PartnerController::class)->except(['show']);

    // Submissions
    Route::get('/contact-messages', [ContactMessageController::class, 'index'])->name('contact-messages.index');
    Route::patch('/contact-messages/{contactMessage}/status', [ContactMessageController::class, 'updateStatus'])->name('contact-messages.status');
    Route::delete('/contact-messages/{contactMessage}', [ContactMessageController::class, 'destroy'])->name('contact-messages.destroy');

    Route::get('/mentor-applications', [MentorApplicationController::class, 'index'])->name('mentor-applications.index');
    Route::patch('/mentor-applications/{mentorApplication}/status', [MentorApplicationController::class, 'updateStatus'])->name('mentor-applications.status');
    Route::delete('/mentor-applications/{mentorApplication}', [MentorApplicationController::class, 'destroy'])->name('mentor-applications.destroy');

    Route::get('/registrations', [RegistrationController::class, 'index'])->name('registrations.index');
    Route::patch('/registrations/{registration}/status', [RegistrationController::class, 'updateStatus'])->name('registrations.status');
    Route::delete('/registrations/{registration}', [RegistrationController::class, 'destroy'])->name('registrations.destroy');

    Route::get('/scholarship-applications', [ScholarshipApplicationController::class, 'index'])->name('scholarship-applications.index');
    Route::patch('/scholarship-applications/{scholarshipApplication}/status', [ScholarshipApplicationController::class, 'updateStatus'])->name('scholarship-applications.status');
    Route::delete('/scholarship-applications/{scholarshipApplication}', [ScholarshipApplicationController::class, 'destroy'])->name('scholarship-applications.destroy');

    Route::get('/subscribers', [SubscriberController::class, 'index'])->name('subscribers.index');
    Route::delete('/subscribers/{subscriber}', [SubscriberController::class, 'destroy'])->name('subscribers.destroy');

    // Users
    Route::resource('users', UserController::class)->except(['show']);

    // Media Gallery
    Route::get('/media', [MediaController::class, 'index'])->name('media.index');
    Route::post('/media/upload', [MediaController::class, 'upload'])->name('media.upload');
    Route::delete('/media', [MediaController::class, 'destroy'])->name('media.destroy');
    Route::post('/media/optimize', [MediaController::class, 'optimize'])->name('media.optimize');
    Route::post('/media/crop', [MediaController::class, 'crop'])->name('media.crop');

    // Settings
    Route::get('/settings/{tab?}', [SettingController::class, 'edit'])->name('settings.edit');
    Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

// Admin login (public)
Route::middleware('guest')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
});

Route::post('/admin/logout', [AuthController::class, 'logout'])->middleware('auth')->name('admin.logout');

// Sitemap.xml (generated on demand, cached 6h)
Route::get('/sitemap.xml', function () {
    $xml = Cache::remember('sitemap.xml', now()->addHours(6), function () {
        $sitemap = Sitemap::create()
            ->add(Url::create('/')->setPriority(1.0))
            ->add(Url::create('/about'))
            ->add(Url::create('/our-model'))
            ->add(Url::create('/regina-yego'))
            ->add(Url::create('/stawi'))
            ->add(Url::create('/stories'))
            ->add(Url::create('/partners'))
            ->add(Url::create('/get-involved'))
            ->add(Url::create('/contact'));

        foreach (Post::published()->get() as $p) {
            $sitemap->add(
                Url::create('/stories/'.$p->slug)
                    ->setLastModificationDate($p->updated_at)
                    ->setPriority(0.7)
            );
        }

        return $sitemap->render();
    });

    return response($xml, 200, [
        'Content-Type' => 'application/xml; charset=UTF-8',
        'Cache-Control' => 'public, max-age=3600',
    ]);
})->name('sitemap');

// robots.txt — absolute sitemap URL from APP_URL (Apache still serves public/robots.txt first in prod)
Route::get('/robots.txt', function () {
    $sitemapUrl = rtrim(config('app.url'), '/').'/sitemap.xml';

    return response(
        "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\n\nSitemap: {$sitemapUrl}\n",
        200,
        ['Content-Type' => 'text/plain; charset=UTF-8']
    );
})->name('robots');
