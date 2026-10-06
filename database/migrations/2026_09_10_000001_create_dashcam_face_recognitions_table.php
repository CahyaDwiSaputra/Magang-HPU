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
        Schema::create('dashcam_face_recognitions', function (Blueprint $table) {
            $table->id();
            $table->string('device_id')->nullable();
            $table->string('driver_name');
            $table->string('employee_id')->nullable();
            $table->decimal('confidence', 5, 2)->default(0);
            $table->timestamp('captured_at')->nullable();
            $table->string('photo_url')->nullable();
            $table->string('source')->nullable()->default('dashcam');
            $table->timestamp('received_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dashcam_face_recognitions');
    }
};
