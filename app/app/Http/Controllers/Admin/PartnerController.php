<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartnerController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Partners/Index', [
            'partners' => Partner::orderBy('sort_order')->get()->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'logo_url' => $p->logo_url,
                'url' => $p->url,
                'sort_order' => $p->sort_order,
                'is_active' => $p->is_active,
            ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Partners/Form', ['partner' => null]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|max:120',
            'url' => 'nullable|max:300',
            'logo' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        Partner::create($data);

        return redirect()->route('admin.partners.index')->with('success', 'Partner created.');
    }

    public function edit(Partner $partner)
    {
        return Inertia::render('Admin/Partners/Form', [
            'partner' => [
                'id' => $partner->id,
                'name' => $partner->name,
                'logo' => $partner->logo,
                'logo_url' => $partner->logo_url,
                'url' => $partner->url,
                'sort_order' => $partner->sort_order,
                'is_active' => $partner->is_active,
            ],
        ]);
    }

    public function update(Request $request, Partner $partner)
    {
        $data = $request->validate([
            'name' => 'required|max:120',
            'url' => 'nullable|max:300',
            'logo' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $partner->update($data);

        return redirect()->route('admin.partners.index')->with('success', 'Partner updated.');
    }

    public function destroy(Partner $partner)
    {
        $partner->delete();

        return redirect()->route('admin.partners.index')->with('success', 'Partner deleted.');
    }
}
