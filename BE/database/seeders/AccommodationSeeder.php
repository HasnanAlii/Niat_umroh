<?php

namespace Database\Seeders;

use App\Models\Accommodation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccommodationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accommodations = [
            [
                'name' => 'Hotel Movenpick Makkah',
                'type' => 'Hotel',
                'location' => 'Makkah',
                'rating' => 4.8,
                'capacity' => '200 kamar',
                'price' => 'Rp 3.5jt/malam',
                'status' => 'Aktif',
                'facilities' => ['WiFi', 'Restoran', 'Spa', 'Kolam Renang'],
                'description' => 'Hotel bintang 5 dengan pemandangan Ka\'bah'
            ],
            [
                'name' => 'Hotel Hilton Madinah',
                'type' => 'Hotel',
                'location' => 'Madinah',
                'rating' => 4.7,
                'capacity' => '150 kamar',
                'price' => 'Rp 3jt/malam',
                'status' => 'Aktif',
                'facilities' => ['WiFi', 'Parkir', 'Sarapan', 'Gym'],
                'description' => 'Hotel dekat Masjid Nabawi dengan fasilitas lengkap'
            ],
            [
                'name' => 'Bandara Soekarno-Hatta',
                'type' => 'Bandara',
                'location' => 'Jakarta',
                'rating' => 4.3,
                'capacity' => '500 penumpang/hari',
                'price' => '-',
                'status' => 'Aktif',
                'facilities' => ['Lounge', 'ATM', 'Food Court', 'Worship Room'],
                'description' => 'Bandara internasional utama untuk keberangkatan umroh'
            ],
            [
                'name' => 'Maktab 45 Aziziyah',
                'type' => 'Pemondokan',
                'location' => 'Makkah',
                'rating' => 4.2,
                'capacity' => '300 jamaah',
                'price' => 'Rp 2jt/malam',
                'status' => 'Aktif',
                'facilities' => ['Kamar Mandi Dalam', 'AC', 'Dapur', 'Laundry'],
                'description' => 'Pemondokan nyaman untuk jamaah umroh'
            ],
            [
                'name' => 'Ritz Carlton Makkah',
                'type' => 'Hotel',
                'location' => 'Makkah',
                'rating' => 4.9,
                'capacity' => '180 kamar',
                'price' => 'Rp 5jt/malam',
                'status' => 'Coming Soon',
                'facilities' => ['5-Star', 'Restoran', 'Spa', 'Business Center'],
                'description' => 'Hotel mewah dengan pemandangan Ka\'bah spektakuler'
            ],
        ];

        foreach ($accommodations as $accommodation) {
            Accommodation::create($accommodation);
        }
    }
}
