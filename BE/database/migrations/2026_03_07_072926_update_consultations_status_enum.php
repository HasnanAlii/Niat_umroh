<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing records to match new enum values
        DB::table('consultations')->where('status', 'Pending')->update(['status' => 'pending']);
        DB::table('consultations')->where('status', 'In Progress')->update(['status' => 'answered']);
        DB::table('consultations')->where('status', 'Resolved')->update(['status' => 'closed']);
        DB::table('consultations')->where('status', 'Closed')->update(['status' => 'closed']);
        
        // Change enum values
        DB::statement("ALTER TABLE consultations MODIFY COLUMN status ENUM('pending', 'answered', 'closed') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to old enum values
        DB::statement("ALTER TABLE consultations MODIFY COLUMN status ENUM('Pending', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Pending'");
        
        // Update records back to old values
        DB::table('consultations')->where('status', 'pending')->update(['status' => 'Pending']);
        DB::table('consultations')->where('status', 'answered')->update(['status' => 'In Progress']);
        DB::table('consultations')->where('status', 'closed')->update(['status' => 'Closed']);
    }
};
