<?php

namespace Database\Seeders;

use App\Models\Payment;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $payments = [
            // Jamaah 1 - Ahmad
            ['jamaah_id' => 1, 'tabungan_id' => 1, 'amount' => 10000000, 'payment_date' => '2025-01-15', 'payment_method' => 'Transfer BCA', 'status' => 'Approved'],
            ['jamaah_id' => 1, 'tabungan_id' => 1, 'amount' => 1000000, 'payment_date' => '2025-02-10', 'payment_method' => 'Transfer BCA', 'status' => 'Approved'],
            ['jamaah_id' => 1, 'tabungan_id' => 1, 'amount' => 1000000, 'payment_date' => '2025-03-10', 'payment_method' => 'Transfer BCA', 'status' => 'Approved'],
            ['jamaah_id' => 1, 'tabungan_id' => 1, 'amount' => 1500000, 'payment_date' => '2025-04-10', 'payment_method' => 'Transfer BCA', 'status' => 'Approved'],
            ['jamaah_id' => 1, 'tabungan_id' => 1, 'amount' => 5000000, 'payment_date' => '2025-05-10', 'payment_method' => 'Transfer BCA', 'status' => 'Approved'],
            
            // Jamaah 2 - Siti
            ['jamaah_id' => 2, 'tabungan_id' => 2, 'amount' => 8000000, 'payment_date' => '2025-02-01', 'payment_method' => 'Transfer BRI', 'status' => 'Approved'],
            ['jamaah_id' => 2, 'tabungan_id' => 2, 'amount' => 1500000, 'payment_date' => '2025-03-01', 'payment_method' => 'Transfer BRI', 'status' => 'Approved'],
            ['jamaah_id' => 2, 'tabungan_id' => 2, 'amount' => 1500000, 'payment_date' => '2025-04-01', 'payment_method' => 'Transfer BRI', 'status' => 'Approved'],
            ['jamaah_id' => 2, 'tabungan_id' => 2, 'amount' => 4000000, 'payment_date' => '2025-05-01', 'payment_method' => 'Transfer BRI', 'status' => 'Approved'],
            
            // Jamaah 3 - Budi
            ['jamaah_id' => 3, 'tabungan_id' => 3, 'amount' => 15000000, 'payment_date' => '2024-12-20', 'payment_method' => 'Transfer Mandiri', 'status' => 'Approved'],
            ['jamaah_id' => 3, 'tabungan_id' => 3, 'amount' => 2000000, 'payment_date' => '2025-01-20', 'payment_method' => 'Transfer Mandiri', 'status' => 'Approved'],
            ['jamaah_id' => 3, 'tabungan_id' => 3, 'amount' => 2000000, 'payment_date' => '2025-02-20', 'payment_method' => 'Transfer Mandiri', 'status' => 'Approved'],
            ['jamaah_id' => 3, 'tabungan_id' => 3, 'amount' => 6000000, 'payment_date' => '2025-03-20', 'payment_method' => 'Transfer Mandiri', 'status' => 'Approved'],
        ];

        foreach ($payments as $payment) {
            Payment::create($payment);
        }
    }
}
