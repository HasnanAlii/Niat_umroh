<?php

namespace Database\Seeders;

use App\Models\Tabungan;
use Illuminate\Database\Seeder;

class TabunganSeeder extends Seeder
{
    public function run(): void
    {
        Tabungan::create([
            'jamaah_id' => 1,
            'travel_package_id' => 1,
            'target_amount' => 35000000,
            'current_amount' => 18500000,
            'monthly_payment' => 1000000,
            'next_payment_date' => '2026-02-10',
            'status' => 'Berjalan',
        ]);

        Tabungan::create([
            'jamaah_id' => 2,
            'travel_package_id' => 2,
            'target_amount' => 28000000,
            'current_amount' => 15000000,
            'monthly_payment' => 1500000,
            'next_payment_date' => '2026-02-15',
            'status' => 'Berjalan',
        ]);

        Tabungan::create([
            'jamaah_id' => 3,
            'travel_package_id' => 3,
            'target_amount' => 42000000,
            'current_amount' => 25000000,
            'monthly_payment' => 2000000,
            'next_payment_date' => '2026-02-20',
            'status' => 'Berjalan',
        ]);
    }
}
