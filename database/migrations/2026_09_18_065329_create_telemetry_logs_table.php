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
        Schema::create('telemetry_logs', function (Blueprint $table) {
            $table->id();
            $table->string('device_id')->index();
            $table->double('latitude')->nullable();
            $table->double('longitude')->nullable();
            $table->double('speed')->default(0); // in km/h
            $table->double('odometer')->default(0); // in km
            $table->boolean('is_moving')->default(false);
            $table->timestamp('captured_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('telemetry_logs');
    }
};
