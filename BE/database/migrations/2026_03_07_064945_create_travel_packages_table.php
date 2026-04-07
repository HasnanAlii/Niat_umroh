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
        Schema::create('travel_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('duration');
            $table->decimal('price', 15, 2);
            $table->integer('quota');
            $table->integer('booked')->default(0);
            $table->integer('available');
            $table->date('departure_date');
            $table->enum('status', ['Aktif', 'Coming Soon', 'Hampir Penuh', 'Penuh', 'Non-Aktif'])->default('Aktif');
            $table->decimal('rating', 3, 2)->default(0);
            $table->string('hotel_makkah')->nullable();
            $table->string('hotel_madinah')->nullable();
            $table->string('airline')->nullable();
            $table->json('features')->nullable();
            $table->json('highlights')->nullable();
            $table->string('best_for')->nullable();
            $table->string('photo')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('accommodation_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('travel_packages');
    }
};
