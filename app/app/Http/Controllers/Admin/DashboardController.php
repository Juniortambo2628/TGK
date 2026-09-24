<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\MentorApplication;
use App\Models\Registration;
use App\Models\Subscriber;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'registrations' => Registration::count(),
                'mentors' => MentorApplication::count(),
                'messages' => ContactMessage::count(),
                'subscribers' => Subscriber::count(),
            ],
            'recentRegistrations' => Registration::latest()->take(6)->get(),
            'trendData' => $this->getTrendData(),
            'programmeData' => $this->getProgrammeData(),
        ]);
    }

    protected function getTrendData()
    {
        $months = collect();

        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $months->push([
                'month' => $date->format('M Y'),
                'registrations' => Registration::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)->count(),
                'mentors' => MentorApplication::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)->count(),
            ]);
        }

        return $months;
    }

    protected function getProgrammeData()
    {
        return Registration::selectRaw('programme, count(*) as count')
            ->groupBy('programme')
            ->pluck('count', 'programme');
    }
}
