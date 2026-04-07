<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AccommodationResource;
use App\Models\Accommodation;
use Illuminate\Http\Request;

class AccommodationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Accommodation::query();
        
        // Filter by type if provided
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        // Filter by location if provided
        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }
        
        $accommodations = $query->orderBy('rating', 'desc')->get();
        
        return AccommodationResource::collection($accommodations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'type'        => 'required|in:hotel Mekah,hotel Madinah,Bandara,Maskapai',
            'location'    => 'required|string',
            'address'     => 'nullable|string',
            'rating'      => 'nullable|numeric|min:0|max:5',
            'capacity'    => 'nullable|string',
            'price'       => 'nullable|string',
            'status'      => 'nullable|in:Aktif,Coming Soon,Non-Aktif',
            'facilities'  => 'nullable|array',
            'facilities.*'=> 'string',
            'description' => 'nullable|string',
            'image'       => 'nullable|string',
        ]);

        // Default status
        $validated['status'] = $validated['status'] ?? 'Aktif';

        $accommodation = Accommodation::create($validated);
        
        return new AccommodationResource($accommodation);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $accommodation = Accommodation::findOrFail($id);
        
        return new AccommodationResource($accommodation);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $accommodation = Accommodation::findOrFail($id);
        
        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'type'        => 'sometimes|in:hotel Mekah,hotel Madinah,Bandara,Maskapai',
            'location'    => 'sometimes|string',
            'address'     => 'nullable|string',
            'rating'      => 'nullable|numeric|min:0|max:5',
            'capacity'    => 'nullable|string',
            'price'       => 'nullable|string',
            'status'      => 'nullable|in:Aktif,Coming Soon,Non-Aktif',
            'facilities'  => 'nullable|array',
            'facilities.*'=> 'string',
            'description' => 'nullable|string',
            'image'       => 'nullable|string',
        ]);

        $accommodation->update($validated);
        
        return new AccommodationResource($accommodation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $accommodation = Accommodation::findOrFail($id);
        $accommodation->delete();
        
        return response()->json([
            'message' => 'Accommodation deleted successfully'
        ]);
    }
}

