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
        Schema::table('dashcam_face_recognitions', function (Blueprint $table) {
            if (!Schema::hasColumn('dashcam_face_recognitions', 'vehicle_id')) {
                $table->string('vehicle_id')->nullable();
            }
            if (!Schema::hasColumn('dashcam_face_recognitions', 'plate_no')) {
                $table->string('plate_no')->nullable();
            }
            if (!Schema::hasColumn('dashcam_face_recognitions', 'site')) {
                $table->string('site')->nullable();
            }
            if (!Schema::hasColumn('dashcam_face_recognitions', 'shift')) {
                $table->string('shift')->nullable();
            }
            if (!Schema::hasColumn('dashcam_face_recognitions', 'status')) {
                $table->string('status')->default('active');
            }
            if (!Schema::hasColumn('dashcam_face_recognitions', 'verification_method')) {
                $table->string('verification_method')->nullable()->default('face_recognition');
            }
            if (!Schema::hasColumn('dashcam_face_recognitions', 'is_current_active')) {
                $table->boolean('is_current_active')->default(true);
            }
            if (!Schema::hasColumn('dashcam_face_recognitions', 'started_at')) {
                $table->timestamp('started_at')->nullable();
            }
            if (!Schema::hasColumn('dashcam_face_recognitions', 'ended_at')) {
                $table->timestamp('ended_at')->nullable();
            }
            if (!Schema::hasColumn('dashcam_face_recognitions', 'notes')) {
                $table->text('notes')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dashcam_face_recognitions', function (Blueprint $table) {
            $cols = ['vehicle_id', 'plate_no', 'site', 'shift', 'status', 'verification_method', 'is_current_active', 'started_at', 'ended_at', 'notes'];
            foreach ($cols as $col) {
                if (Schema::hasColumn('dashcam_face_recognitions', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
