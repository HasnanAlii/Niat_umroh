<?php

namespace Database\Seeders;

use App\Models\Jamaah;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class JamaahSeeder extends Seeder
{
    public function run(): void
    {
        // Create user for Ahmad
        $user1 = User::create([
            'name' => 'Ahmad Subarjdo',
            'email' => 'ahmad@email.com',
            'password' => Hash::make('password'),
        ]);

        Jamaah::create([
            'user_id' => $user1->id,
            'name' => 'Ahmad Subadrjo',
            'nik' => '3201234567890001',
            'email' => 'ahmad@email.com',
            'phone' => '081234567890',
            'address' => 'Jl. Merdeka No. 123, Jakarta',
            'travel_package_id' => 1, // Umroh Plus Turki
            'registration_date' => '2025-01-15',
            'status' => 'Lunas',
        ]);

        // Create user for Siti
        $user2 = User::create([
            'name' => 'Siti Aisyah',
            'email' => 'siti@email.com',
            'password' => Hash::make('password'),
        ]);

        Jamaah::create([
            'user_id' => $user2->id,
            'name' => 'Siti Aisyah',
            'nik' => '3201234567890002',
            'email' => 'siti@email.com',
            'phone' => '081234567891',
            'address' => 'Jl. Sudirman No. 456, Bandung',
            'travel_package_id' => 2, // Umroh Reguler 9 Hari
            'registration_date' => '2025-02-01',
            'status' => 'Aktif',
        ]);

        // Create user for Budi
        $user3 = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@email.com',
            'password' => Hash::make('password'),
        ]);

        Jamaah::create([
            'user_id' => $user3->id,
            'name' => 'Budi Santoso',
            'nik' => '3201234567890003',
            'email' => 'budi@email.com',
            'phone' => '081234567892',
            'address' => 'Jl. Asia Afrika No. 789, Surabaya',
            'travel_package_id' => 3, // Umroh Ramadhan Premium
            'registration_date' => '2024-12-20',
            'status' => 'Aktif',
        ]);
    }
}
