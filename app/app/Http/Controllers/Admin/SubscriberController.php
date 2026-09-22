<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Inertia\Inertia;

class SubscriberController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Submissions/Subscribers', [
            'subscribers' => Subscriber::latest()->get(),
        ]);
    }

    public function destroy(Subscriber $subscriber)
    {
        $subscriber->delete();

        return back()->with('success', 'Subscriber removed.');
    }
}
