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
        Schema::create('accommodations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['hotel Mekah', 'Maskapai', 'hotel Madinah'])->default('hotel Mekah');
            $table->string('location');
            $table->decimal('rating', 3, 2)->default(0);
            $table->string('capacity')->nullable();
            $table->string('price')->nullable();
            $table->enum('status', ['Aktif', 'Coming Soon', 'Non-Aktif'])->default('Aktif');
            $table->json('facilities')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accommodations');
    }
};
