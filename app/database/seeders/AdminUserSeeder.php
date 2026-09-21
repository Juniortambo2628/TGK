<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@goodkenyan.org'],
            [
                'name' => 'Good Kenyan Admin',
                'password' => Hash::make('changeme-now'),
                'email_verified_at' => now(),
            ]
        );
    }
}
