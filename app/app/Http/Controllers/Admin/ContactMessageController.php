<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Submissions/ContactMessages', [
            'messages' => ContactMessage::latest()->get(),
        ]);
    }

    public function updateStatus(Request $request, ContactMessage $contactMessage)
    {
        $request->validate(['is_handled' => 'required|boolean']);

        $contactMessage->update(['is_handled' => $request->boolean('is_handled')]);

        return back()->with('success', 'Status updated.');
    }

    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return back()->with('success', 'Message deleted.');
    }
}
