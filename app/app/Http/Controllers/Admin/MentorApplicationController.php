<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MentorApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MentorApplicationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Submissions/MentorApplications', [
            'applications' => MentorApplication::latest()->get(),
        ]);
    }

    public function updateStatus(Request $request, MentorApplication $mentorApplication)
    {
        $request->validate(['status' => 'required|in:new,contacted,onboarded,declined']);

        $mentorApplication->update(['status' => $request->status]);

        return back()->with('success', 'Status updated.');
    }

    public function destroy(MentorApplication $mentorApplication)
    {
        $mentorApplication->delete();

        return back()->with('success', 'Application deleted.');
    }
}
