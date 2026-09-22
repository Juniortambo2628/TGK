<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Submissions/Registrations', [
            'registrations' => Registration::latest()->get(),
        ]);
    }

    public function updateStatus(Request $request, Registration $registration)
    {
        $request->validate(['status' => 'required|in:new,contacted,accepted,declined']);

        $registration->update(['status' => $request->status]);

        return back()->with('success', 'Status updated.');
    }

    public function destroy(Registration $registration)
    {
        $registration->delete();

        return back()->with('success', 'Registration deleted.');
    }
}
