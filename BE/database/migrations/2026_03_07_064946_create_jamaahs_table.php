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
        Schema::create('jamaahs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('nik', 16)->unique();
            $table->string('email')->unique();
            $table->string('phone', 15);
            $table->text('address');
            $table->date('registration_date');
            $table->foreignId('travel_package_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('status', ['Aktif', 'Menunggu', 'Lunas', 'Tertunggak', 'Non-Aktif'])->default('Aktif');
            $table->string('profile_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jamaahs');
    }
};
