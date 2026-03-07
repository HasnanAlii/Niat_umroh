<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jamaah;
use App\Models\TravelPackage;
use App\Models\Tabungan;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Book a travel package for jamaah
     */
    public function bookPackage(Request $request)
    {
        $validated = $request->validate([
            'jamaah_id' => 'required|exists:jamaahs,id',
            'travel_package_id' => 'required|exists:travel_packages,id',
            'monthly_payment' => 'nullable|numeric|min:0',
        ]);

        $jamaah = Jamaah::findOrFail($validated['jamaah_id']);
        $package = TravelPackage::findOrFail($validated['travel_package_id']);

        // Check if package is available
        if ($package->booked >= $package->quota) {
            return response()->json([
                'message' => 'Package is fully booked',
            ], 400);
        }

        // Update jamaah package
        $jamaah->travel_package_id = $package->id;
        $jamaah->status = 'Aktif';
        $jamaah->save();

        // Create or update tabungan
        $tabungan = Tabungan::firstOrNew([
            'jamaah_id' => $jamaah->id,
        ]);

        $tabungan->travel_package_id = $package->id;
        $tabungan->target_amount = $package->price;
        $tabungan->monthly_payment = $validated['monthly_payment'] ?? 1000000;
        $tabungan->status = 'Berjalan';
        
        // Calculate next payment date (30 days from now)
        if (!$tabungan->next_payment_date) {
            $tabungan->next_payment_date = now()->addDays(30);
        }

        $tabungan->save();

        // Update package booking count
        $package->increment('booked');

        return response()->json([
            'message' => 'Package booked successfully',
            'jamaah' => $jamaah->load('travelPackage'),
            'tabungan' => $tabungan,
        ], 200);
    }

    /**
     * Cancel booking
     */
    public function cancelBooking(Request $request, $jamaahId)
    {
        $jamaah = Jamaah::findOrFail($jamaahId);

        if (!$jamaah->travel_package_id) {
            return response()->json([
                'message' => 'No active booking found',
            ], 400);
        }

        // Check if can cancel (not already paid significant amount)
        $tabungan = $jamaah->tabungan;
        if ($tabungan && $tabungan->progress > 50) {
            return response()->json([
                'message' => 'Cannot cancel booking. Payment progress is over 50%',
            ], 400);
        }

        // Decrease package booking count
        $package = TravelPackage::find($jamaah->travel_package_id);
        if ($package) {
            $package->decrement('booked');
        }

        // Update jamaah
        $jamaah->travel_package_id = null;
        $jamaah->status = 'Non-Aktif';
        $jamaah->save();

        // Update tabungan status
        if ($tabungan) {
            $tabungan->status = 'Dibatalkan';
            $tabungan->save();
        }

        return response()->json([
            'message' => 'Booking cancelled successfully',
            'jamaah' => $jamaah,
        ]);
    }

    /**
     * Change package
     */
    public function changePackage(Request $request, $jamaahId)
    {
        $validated = $request->validate([
            'new_package_id' => 'required|exists:travel_packages,id',
        ]);

        $jamaah = Jamaah::findOrFail($jamaahId);
        $oldPackage = TravelPackage::find($jamaah->travel_package_id);
        $newPackage = TravelPackage::findOrFail($validated['new_package_id']);

        // Check if new package is available
        if ($newPackage->booked >= $newPackage->quota) {
            return response()->json([
                'message' => 'New package is fully booked',
            ], 400);
        }

        // Update booking counts
        if ($oldPackage) {
            $oldPackage->decrement('booked');
        }
        $newPackage->increment('booked');

        // Update jamaah
        $jamaah->travel_package_id = $newPackage->id;
        $jamaah->save();

        // Update tabungan
        $tabungan = $jamaah->tabungan;
        if ($tabungan) {
            $tabungan->travel_package_id = $newPackage->id;
            $tabungan->target_amount = $newPackage->price;
            $tabungan->save();
        }

        return response()->json([
            'message' => 'Package changed successfully',
            'jamaah' => $jamaah->load('travelPackage'),
            'tabungan' => $tabungan,
        ]);
    }

    /**
     * Get available packages with booking info
     */
    public function availablePackages()
    {
        $packages = TravelPackage::where('status', 'Aktif')
            ->whereRaw('booked < quota')
            ->get()
            ->map(function ($package) {
                return [
                    'id' => $package->id,
                    'name' => $package->name,
                    'duration' => $package->duration,
                    'price' => $package->price,
                    'available_seats' => $package->quota - $package->booked,
                    'departure_date' => $package->departure_date,
                    'features' => $package->features,
                    'highlights' => $package->highlights,
                    'hotel' => $package->hotel,
                    'airline' => $package->airline,
                    'rating' => $package->rating,
                ];
            });

        return response()->json([
            'packages' => $packages,
        ]);
    }
}
