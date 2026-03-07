<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tabungan;
use App\Http\Resources\TabunganResource;
use Illuminate\Http\Request;

class TabunganController extends Controller
{
    public function index(Request $request)
    {
        $query = Tabungan::with(['jamaah']);
        
        if ($request->has('jamaah_id')) {
            $query->where('jamaah_id', $request->jamaah_id);
        }
        
        $tabungans = $query->latest()->get();
        return TabunganResource::collection($tabungans);
    }

    public function show($id)
    {
        $tabungan = Tabungan::with(['jamaah'])->findOrFail($id);
        return new TabunganResource($tabungan);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jamaah_id' => 'required|exists:jamaahs,id',
            'target_amount' => 'required|numeric|min:0',
            'current_amount' => 'nullable|numeric|min:0',
            'monthly_payment' => 'nullable|numeric|min:0',
            'next_payment_date' => 'nullable|date',
            'status' => 'nullable|in:active,completed,cancelled',
        ]);

        $tabungan = Tabungan::create($validated);
        return new TabunganResource($tabungan);
    }

    public function update(Request $request, $id)
    {
        $tabungan = Tabungan::findOrFail($id);
        
        $validated = $request->validate([
            'target_amount' => 'sometimes|numeric|min:0',
            'current_amount' => 'sometimes|numeric|min:0',
            'monthly_payment' => 'sometimes|numeric|min:0',
            'next_payment_date' => 'sometimes|date',
            'status' => 'sometimes|in:active,completed,cancelled',
        ]);

        $tabungan->update($validated);
        return new TabunganResource($tabungan);
    }

    public function destroy($id)
    {
        $tabungan = Tabungan::findOrFail($id);
        $tabungan->delete();
        
        return response()->json(['message' => 'Tabungan deleted successfully']);
    }
}
