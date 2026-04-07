<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TravelPackageResource;
use App\Models\TravelPackage;
use Illuminate\Http\Request;

class TravelPackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $packages = TravelPackage::orderBy('departure_date', 'asc')->get();
        
        return TravelPackageResource::collection($packages);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'duration' => 'required|string',
            'price' => 'required|numeric',
            'quota' => 'required|integer',
            'departure_date' => 'required|date',
            'status' => 'in:Aktif,Coming Soon,Hampir Penuh,Penuh,Non-Aktif',
            'hotel_makkah' => 'nullable|string',
            'hotel_madinah' => 'nullable|string',
            'airline' => 'nullable|string',
            'accommodation_id' => 'nullable|exists:accommodations,id',
            'photo' => 'nullable|image|max:2048',
        ]);

        $validated['booked'] = 0;
        $validated['available'] = $validated['quota'];
        $validated['rating'] = 0;

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('travel_packages', 'public');
            $validated['photo'] = $path;
        }

        $package = TravelPackage::create($validated);
        return new TravelPackageResource($package);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $package = TravelPackage::findOrFail($id);
        
        return new TravelPackageResource($package);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $package = TravelPackage::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'duration' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'quota' => 'sometimes|integer',
            'departure_date' => 'sometimes|date',
            'status' => 'sometimes|in:Aktif,Coming Soon,Hampir Penuh,Penuh,Non-Aktif',
            'accommodation_id' => 'nullable|exists:accommodations,id',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('travel_packages', 'public');
            $validated['photo'] = $path;
        }

        $package->update($validated);
        return new TravelPackageResource($package);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $package = TravelPackage::findOrFail($id);
        $package->delete();
        
        return response()->json([
            'message' => 'Package deleted successfully'
        ]);
    }
}
