<?php

namespace Database\Seeders;

use App\Models\Partner;
use Illuminate\Database\Seeder;

class PartnerSeeder extends Seeder
{
    public function run(): void
    {
        $partners = [
            ['name' => 'Segal Family Foundation', 'logo' => 'Segal-Family-Foundation.png'],
            ['name' => 'Microsoft Give',          'logo' => 'Microsoft-Give-Logo.png'],
            ['name' => 'Galana Energies',         'logo' => 'Galana-Energies_logo.png'],
            ['name' => 'ABSF',                    'logo' => 'ABSF.png'],
            ['name' => 'IFF',                     'logo' => 'IFF-logo-resized.png'],
            ['name' => 'Global Giving',           'logo' => 'GW-logo.jpg'],
            ['name' => 'Partner A',               'logo' => 'logoa.png'],
            ['name' => 'Partner E',               'logo' => 'logoe.png'],
            ['name' => 'Partner G',               'logo' => 'logog.png'],
        ];

        foreach ($partners as $i => $p) {
            Partner::updateOrCreate(
                ['name' => $p['name']],
                ['logo' => $p['logo'], 'sort_order' => $i, 'is_active' => true]
            );
        }
    }
}
