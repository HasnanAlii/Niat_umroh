<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Jamaah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register new user and jamaah
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'nik' => 'required|string|max:16|unique:jamaahs',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'travel_package_id' => 'nullable|exists:travel_packages,id',
        ]);

        // Create user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Create jamaah profile
        $jamaah = Jamaah::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'nik' => $validated['nik'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'travel_package_id' => $validated['travel_package_id'] ?? null,
            'registration_date' => now(),
            'status' => 'Menunggu',
        ]);

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'jamaah' => $jamaah,
            'token' => $token,
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Get jamaah data
        $jamaah = Jamaah::where('user_id', $user->id)->first();

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => array_merge($user->toArray(), ['role' => $user->role]),
            'jamaah' => $jamaah,
            'token' => $token,
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get authenticated user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $jamaah = Jamaah::with(['travelPackage', 'tabungan', 'documents', 'payments'])
            ->where('user_id', $user->id)
            ->first();

        return response()->json([
            'user' => $user,
            'jamaah' => $jamaah,
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'current_password' => 'required_with:password',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        // Update user
        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }

        // Update password if provided
        if (isset($validated['password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['Current password is incorrect.'],
                ]);
            }
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        // Update jamaah
        $jamaah = Jamaah::where('user_id', $user->id)->first();
        if ($jamaah) {
            if (isset($validated['name'])) {
                $jamaah->name = $validated['name'];
            }
            if (isset($validated['email'])) {
                $jamaah->email = $validated['email'];
            }
            if (isset($validated['phone'])) {
                $jamaah->phone = $validated['phone'];
            }
            if (isset($validated['address'])) {
                $jamaah->address = $validated['address'];
            }
            $jamaah->save();
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
            'jamaah' => $jamaah,
        ]);
    }
}
