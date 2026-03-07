<?php

namespace Database\Seeders;

use App\Models\TravelPackage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TravelPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Umroh Plus Turki',
                'duration' => '14 Hari',
                'price' => 35000000,
                'quota' => 45,
                'booked' => 12,
                'available' => 33,
                'departure_date' => '2026-03-15',
                'status' => 'Aktif',
                'rating' => 4.8,
                'hotel_makkah' => 'Hotel Movenpick Makkah',
                'hotel_madinah' => 'Hotel Hilton Madinah',
                'airline' => 'Saudi Airlines',
                'features' => [
                    'Hotel 5* Makkah',
                    'Qashr Al Haram View',
                    'City Tour Istanbul',
                    'Bimbingan Manasik',
                    'Dokter Pendamping'
                ],
                'highlights' => ['Plus Turki', 'Hotel Premium', 'Tour Istanbul'],
                'best_for' => 'Keluarga & Wisata',
                'description' => 'Paket umroh plus wisata ke Turki dengan fasilitas premium'
            ],
            [
                'name' => 'Umroh Reguler',
                'duration' => '9 Hari',
                'price' => 30000000,
                'quota' => 40,
                'booked' => 5,
                'available' => 35,
                'departure_date' => '2026-04-10',
                'status' => 'Aktif',
                'rating' => 4.5,
                'hotel_makkah' => 'Dar Al Tawhid',
                'hotel_madinah' => 'Dar Al Iman',
                'airline' => 'Garuda Indonesia',
                'features' => [
                    'Hotel 4* Makkah',
                    'Dekat Masjidil Haram',
                    'Manasik Lengkap',
                    'Dokter Pendamping',
                    'Transportasi Premium'
                ],
                'highlights' => ['Ekonomis', 'Fasilitas Lengkap', 'Waktu Fleksibel'],
                'best_for' => 'Pertama Kali Umroh',
                'description' => 'Paket umroh reguler dengan fasilitas lengkap dan terjangkau'
            ],
            [
                'name' => 'Umroh Ramadhan',
                'duration' => '14 Hari',
                'price' => 42000000,
                'quota' => 50,
                'booked' => 25,
                'available' => 25,
                'departure_date' => '2026-03-20',
                'status' => 'Aktif',
                'rating' => 4.9,
                'hotel_makkah' => 'Pullman Zamzam',
                'hotel_madinah' => 'Pullman Madinah',
                'airline' => 'Saudi Airlines',
                'features' => [
                    'Hotel 5* Premium',
                    'I\'tikaf di Masjid',
                    'Buka Puasa Jamaah',
                    'Hadiah Khusus',
                    'Kajian Rutin'
                ],
                'highlights' => ['Ramadhan', 'I\'tikaf', 'Kajian Khusus'],
                'best_for' => 'Spiritualitas Tinggi',
                'description' => 'Paket umroh spesial Ramadhan dengan program spiritual lengkap'
            ],
            [
                'name' => 'Umroh Plus Dubai',
                'duration' => '11 Hari',
                'price' => 38000000,
                'quota' => 35,
                'booked' => 15,
                'available' => 20,
                'departure_date' => '2026-05-05',
                'status' => 'Coming Soon',
                'rating' => 4.7,
                'hotel_makkah' => 'Swissotel Makkah',
                'hotel_madinah' => 'Anwar Al Madinah',
                'airline' => 'Emirates',
                'features' => [
                    'Hotel 5* Dubai',
                    'Burj Khalifa Tour',
                    'Desert Safari',
                    'Shopping Tour',
                    'Spa Premium'
                ],
                'highlights' => ['Plus Dubai', 'Modern City', 'Luxury Experience'],
                'best_for' => 'Pengalaman Mewah',
                'description' => 'Paket umroh plus wisata ke Dubai dengan pengalaman mewah'
            ],
        ];

        foreach ($packages as $package) {
            TravelPackage::create($package);
        }
    }
}
