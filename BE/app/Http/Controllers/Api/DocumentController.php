<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Http\Resources\DocumentResource;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    private function normalizeStatus(?string $status): ?string
    {
        if ($status === null) {
            return null;
        }

        $normalized = strtolower(trim($status));

        return match ($normalized) {
            'pending', 'perlu upload' => 'Perlu Upload',
            'verified', 'lengkap' => 'Lengkap',
            'rejected', 'ditolak' => 'Ditolak',
            'dalam review', 'in review', 'review' => 'Dalam Review',
            default => $status,
        };
    }

    public function index(Request $request)
    {
        $query = Document::with(['jamaah']);
        
        if ($request->has('jamaah_id')) {
            $query->where('jamaah_id', $request->jamaah_id);
        }
        
        $documents = $query->latest()->get();
        return DocumentResource::collection($documents);
    }

    public function show($id)
    {
        $document = Document::with(['jamaah'])->findOrFail($id);
        return new DocumentResource($document);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jamaah_id' => 'required|exists:jamaahs,id',
            'document_type' => 'required|string|max:100',
            'document_number' => 'nullable|string|max:100',
            'file_path' => 'nullable|string',
            'expiry_date' => 'nullable|date',
            'status' => 'nullable|string',
        ]);

        $validated['status'] = $this->normalizeStatus($validated['status'] ?? null) ?? 'Perlu Upload';

        $document = Document::create($validated);
        return new DocumentResource($document);
    }

    public function update(Request $request, $id)
    {
        $document = Document::findOrFail($id);
        
        $validated = $request->validate([
            'document_type' => 'sometimes|string|max:100',
            'document_number' => 'nullable|string|max:100',
            'file_path' => 'nullable|string',
            'expiry_date' => 'nullable|date',
            'status' => 'sometimes|string',
        ]);

        if (array_key_exists('status', $validated)) {
            $validated['status'] = $this->normalizeStatus($validated['status']) ?? 'Perlu Upload';
        }

        $document->update($validated);
        return new DocumentResource($document);
    }

    public function destroy($id)
    {
        $document = Document::findOrFail($id);
        $document->delete();
        
        return response()->json(['message' => 'Document deleted successfully']);
    }
}
