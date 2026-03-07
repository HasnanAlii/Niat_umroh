<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jamaah;
use App\Http\Resources\JamaahResource;
use Illuminate\Http\Request;

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

        $jamaah = Jamaah::create($validated);
        return new JamaahResource($jamaah);
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

        $jamaah->update($validated);
        return new JamaahResource($jamaah);
    }

    public function destroy($id)
    {
        $jamaah = Jamaah::findOrFail($id);
        $jamaah->delete();
        
        return response()->json(['message' => 'Jamaah deleted successfully']);
    }
}
