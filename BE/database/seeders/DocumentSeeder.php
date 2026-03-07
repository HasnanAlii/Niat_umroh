<?php

namespace Database\Seeders;

use App\Models\Document;
use Illuminate\Database\Seeder;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        $documents = [
            // Jamaah 1 - Ahmad
            ['jamaah_id' => 1, 'document_type' => 'Paspor', 'expiry_date' => '2028-12-31', 'status' => 'Lengkap'],
            ['jamaah_id' => 1, 'document_type' => 'KTP', 'expiry_date' => null, 'status' => 'Lengkap'],
            ['jamaah_id' => 1, 'document_type' => 'KK', 'expiry_date' => null, 'status' => 'Lengkap'],
            ['jamaah_id' => 1, 'document_type' => 'Foto 4x6', 'expiry_date' => null, 'status' => 'Lengkap'],
            ['jamaah_id' => 1, 'document_type' => 'Sertifikat Vaksin', 'expiry_date' => '2026-06-30', 'status' => 'Perlu Upload'],
            
            // Jamaah 2 - Siti
            ['jamaah_id' => 2, 'document_type' => 'Paspor', 'expiry_date' => '2029-01-15', 'status' => 'Lengkap'],
            ['jamaah_id' => 2, 'document_type' => 'KTP', 'expiry_date' => null, 'status' => 'Lengkap'],
            ['jamaah_id' => 2, 'document_type' => 'KK', 'expiry_date' => null, 'status' => 'Lengkap'],
            ['jamaah_id' => 2, 'document_type' => 'Foto 4x6', 'expiry_date' => null, 'status' => 'Lengkap'],
            ['jamaah_id' => 2, 'document_type' => 'Sertifikat Vaksin', 'expiry_date' => '2026-08-30', 'status' => 'Lengkap'],
            
            // Jamaah 3 - Budi
            ['jamaah_id' => 3, 'document_type' => 'Paspor', 'expiry_date' => '2027-06-30', 'status' => 'Lengkap'],
            ['jamaah_id' => 3, 'document_type' => 'KTP', 'expiry_date' => null, 'status' => 'Lengkap'],
            ['jamaah_id' => 3, 'document_type' => 'KK', 'expiry_date' => null, 'status' => 'Lengkap'],
            ['jamaah_id' => 3, 'document_type' => 'Foto 4x6', 'expiry_date' => null, 'status' => 'Perlu Upload'],
            ['jamaah_id' => 3, 'document_type' => 'Sertifikat Vaksin', 'expiry_date' => '2026-09-30', 'status' => 'Perlu Upload'],
        ];

        foreach ($documents as $document) {
            Document::create($document);
        }
    }
}
