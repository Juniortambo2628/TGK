<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
        $middleware->redirectGuestsTo(fn ($request) => route('admin.login'));
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, $request) {
            if (! $request->expectsJson()) {
                return Inertia::render('Errors/NotFound', [
                    'seo' => [
                        'title' => 'Page not found · Good Kenyan Foundation',
                        'description' => 'The page you are looking for does not exist. Return home to explore stories, programmes and ways to get involved.',
                        'robots' => 'noindex, follow',
                    ],
                ])
                    ->toResponse($request)
                    ->setStatusCode(404);
            }
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, $request) {
            $status = $e->getStatusCode();
            if ($status === 404 || $request->expectsJson()) {
                return null;
            }
            if (! in_array($status, [403, 419, 500, 503], true)) {
                return null;
            }

            $titles = [
                403 => 'Access denied',
                419 => 'Session expired',
                500 => 'Something went wrong',
                503 => 'Under maintenance',
            ];

            return Inertia::render('Errors/Error', [
                'status' => $status,
                'seo' => [
                    'title' => ($titles[$status] ?? 'Error').' · Good Kenyan Foundation',
                    'description' => 'Good Kenyan Foundation — from school to opportunity. Please try again or return home.',
                    'robots' => 'noindex, follow',
                ],
            ])
                ->toResponse($request)
                ->setStatusCode($status);
        });
    })
    ->create();
