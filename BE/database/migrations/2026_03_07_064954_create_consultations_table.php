<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jamaah_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('phone', 15);
            $table->string('email');
            $table->string('subject');
            $table->text('message');
            $table->string('category')->nullable();
            $table->foreignId('travel_package_id')->nullable()->constrained()->onDelete('set null');
            $table->date('preferred_date')->nullable();
            $table->enum('status', ['Pending', 'In Progress', 'Resolved', 'Closed'])->default('Pending');
            $table->foreignId('handled_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('response')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};
