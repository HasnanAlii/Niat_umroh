<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use App\Http\Resources\ConsultationResource;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    public function index(Request $request)
    {
        $query = Consultation::with(['jamaah']);
        
        if ($request->has('jamaah_id')) {
            $query->where('jamaah_id', $request->jamaah_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $consultations = $query->latest()->get();
        return ConsultationResource::collection($consultations);
    }

    public function show($id)
    {
        $consultation = Consultation::with(['jamaah'])->findOrFail($id);
        return new ConsultationResource($consultation);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jamaah_id' => 'nullable|exists:jamaahs,id',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'travel_package_id' => 'nullable|exists:travel_packages,id',
            'preferred_date' => 'nullable|date',
        ]);

        $consultation = Consultation::create([
            'jamaah_id' => $validated['jamaah_id'] ?? null,
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'travel_package_id' => $validated['travel_package_id'] ?? null,
            'preferred_date' => $validated['preferred_date'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Consultation request submitted successfully',
            'consultation' => new ConsultationResource($consultation),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $consultation = Consultation::findOrFail($id);
        
        $validated = $request->validate([
            'subject' => 'sometimes|string|max:255',
            'message' => 'sometimes|string',
            'status' => 'sometimes|in:pending,answered,closed',
            'response' => 'nullable|string',
        ]);

        if (isset($validated['response'])) {
            $consultation->response = $validated['response'];
            $consultation->responded_at = now();
        }

        if (isset($validated['status'])) {
            $consultation->status = $validated['status'];
        }

        $consultation->save();

        return response()->json([
            'message' => 'Consultation updated successfully',
            'consultation' => new ConsultationResource($consultation),
        ]);
    }

    public function respond(Request $request, $id)
    {
        $validated = $request->validate([
            'response' => 'required|string',
        ]);

        $consultation = Consultation::findOrFail($id);
        $consultation->response = $validated['response'];
        $consultation->status = 'answered';
        $consultation->responded_at = now();
        $consultation->save();

        return response()->json([
            'message' => 'Response sent successfully',
            'consultation' => new ConsultationResource($consultation),
        ]);
    }

    public function close($id)
    {
        $consultation = Consultation::findOrFail($id);
        $consultation->status = 'closed';
        $consultation->save();

        return response()->json([
            'message' => 'Consultation closed',
            'consultation' => new ConsultationResource($consultation),
        ]);
    }

    public function destroy($id)
    {
        $consultation = Consultation::findOrFail($id);
        $consultation->delete();
        
        return response()->json(['message' => 'Consultation deleted successfully']);
    }
}
