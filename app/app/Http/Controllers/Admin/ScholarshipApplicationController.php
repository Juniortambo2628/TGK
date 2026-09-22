<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ScholarshipApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScholarshipApplicationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Submissions/ScholarshipApplications', [
            'applications' => ScholarshipApplication::latest()->get(),
        ]);
    }

    public function updateStatus(Request $request, ScholarshipApplication $scholarshipApplication)
    {
        $request->validate(['status' => 'required|in:new,contacted,committed,declined']);

        $scholarshipApplication->update(['status' => $request->status]);

        return back()->with('success', 'Status updated.');
    }

    public function destroy(ScholarshipApplication $scholarshipApplication)
    {
        $scholarshipApplication->delete();

        return back()->with('success', 'Application deleted.');
    }
}
