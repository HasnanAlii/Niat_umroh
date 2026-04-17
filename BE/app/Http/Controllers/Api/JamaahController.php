<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jamaah;
use App\Models\Tabungan;
use App\Models\TravelPackage;
use App\Models\User;
use App\Http\Resources\JamaahResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JamaahController extends Controller
{
    public function index()
    {
        $jamaahs = Jamaah::with(['travelPackage', 'tabungan', 'documents', 'payments'])
            ->latest()
            ->get();
        
        return JamaahResource::collection($jamaahs);
    }

    public function show($id)
    {
        $jamaah = Jamaah::with(['travelPackage', 'tabungan', 'documents', 'payments', 'consultations'])
            ->findOrFail($id);
        
        return new JamaahResource($jamaah);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nik' => 'required|string|max:16|unique:jamaahs',
            'email' => 'required|email|unique:jamaahs',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'travel_package_id' => 'nullable|exists:travel_packages,id',
            'total_paid' => 'nullable|numeric|min:0',
            'registration_date' => 'nullable|date',
            'status' => 'nullable|in:pending,confirmed,completed,cancelled',
        ]);

        $jamaah = DB::transaction(function () use ($validated) {
            // Create user account for Jamaah
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => 'password', // Will be hashed by model mutator
                'role' => 'jamaah',
            ]);

            $jamaahData = $validated;
            $jamaahData['user_id'] = $user->id;
            $jamaahData['registration_date'] = now();

            $jamaah = Jamaah::create($jamaahData);

            $this->syncTabungan(
                $jamaah,
                $jamaahData['travel_package_id'] ?? null,
                $validated['total_paid'] ?? 0
            );

            return $jamaah;
        });

        return new JamaahResource($jamaah->load(['travelPackage', 'tabungan']));
    }

    public function update(Request $request, $id)
    {
        $jamaah = Jamaah::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'nik' => 'sometimes|string|max:16|unique:jamaahs,nik,' . $id,
            'email' => 'sometimes|email|unique:jamaahs,email,' . $id,
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'travel_package_id' => 'nullable|exists:travel_packages,id',
            'total_paid' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:pending,confirmed,completed,cancelled',
        ]);

        DB::transaction(function () use ($jamaah, $validated) {
            $jamaah->update($validated);

            $updatedJamaah = $jamaah->fresh();
            $travelPackageId = $validated['travel_package_id'] ?? $updatedJamaah->travel_package_id;

            if ($travelPackageId) {
                $this->syncTabungan(
                    $updatedJamaah,
                    $travelPackageId,
                    $validated['total_paid'] ?? null
                );
            }
        });

        return new JamaahResource($jamaah->fresh()->load(['travelPackage', 'tabungan']));
    }

    public function destroy($id)
    {
        $jamaah = Jamaah::findOrFail($id);
        $jamaah->delete();
        
        return response()->json(['message' => 'Jamaah deleted successfully']);
    }

    private function syncTabungan(Jamaah $jamaah, ?int $travelPackageId, ?float $currentAmount = null): void
    {
        if (!$travelPackageId) {
            return;
        }

        $travelPackage = TravelPackage::findOrFail($travelPackageId);

        $tabungan = Tabungan::firstOrNew([
            'jamaah_id' => $jamaah->id,
        ]);

        $tabungan->travel_package_id = $travelPackage->id;
        $tabungan->target_amount = $travelPackage->price;
        $tabungan->monthly_payment = $tabungan->monthly_payment ?? 1000000;

        if ($currentAmount !== null) {
            $tabungan->current_amount = $currentAmount;
        } else {
            $tabungan->current_amount = $tabungan->current_amount ?? 0;
        }

        $tabungan->progress = $tabungan->target_amount > 0
            ? min(100, (int) round(($tabungan->current_amount / $tabungan->target_amount) * 100))
            : 0;
        $tabungan->status = $tabungan->status ?? 'Berjalan';

        if (!$tabungan->next_payment_date) {
            $tabungan->next_payment_date = now()->addDays(30);
        }

        $tabungan->save();
    }
}
