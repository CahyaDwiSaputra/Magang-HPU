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
        Schema::table('geofences', function (Blueprint $table) {
            $table->string('color', 20)->default('#3B82F6')->after('radius');
            $table->string('address')->nullable()->after('color');
            $table->string('material', 30)->default('OB')->after('address'); // OB, COAL, MUD, TOP SOIL, LIMONIT, SAPROLIT
            $table->string('geometry_type', 20)->default('circle')->after('material'); // circle, polygon, line
            $table->text('coordinates_json')->nullable()->after('geometry_type');
        });

        Schema::table('ritasi_logs', function (Blueprint $table) {
            $table->string('unit_code', 50)->default('HD-78501')->after('device_id');
            $table->string('load_type', 30)->default('OB')->after('unit_code'); // OB, COAL, MUD, TOP SOIL, LIMONIT, SAPROLIT
            $table->foreignId('pit_geofence_id')->nullable()->after('geofence_id')->constrained('geofences')->nullOnDelete();
            $table->foreignId('dumping_geofence_id')->nullable()->after('pit_geofence_id')->constrained('geofences')->nullOnDelete();
            $table->integer('loading_time')->default(180)->after('dumping_geofence_id'); // detik (LT)
            $table->integer('travel_load_time')->default(480)->after('loading_time'); // detik (TLT)
            $table->integer('dumping_time')->default(90)->after('travel_load_time'); // detik (DT)
            $table->integer('travel_empty_time')->default(420)->after('dumping_time'); // detik (TET)
            $table->double('cycle_time_minutes')->default(19.5)->after('travel_empty_time'); // Total menit edar
            $table->double('distance_km')->default(2.4)->after('cycle_time_minutes'); // Jarak tempuh km
            $table->boolean('pto_confirmed')->default(true)->after('distance_km'); // Status PTO ON saat dumping
            $table->string('status', 30)->default('completed')->after('pto_confirmed'); // completed, in_progress, idling
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geofences', function (Blueprint $table) {
            $table->dropColumn(['color', 'address', 'material', 'geometry_type', 'coordinates_json']);
        });

        Schema::table('ritasi_logs', function (Blueprint $table) {
            $table->dropForeign(['pit_geofence_id']);
            $table->dropForeign(['dumping_geofence_id']);
            $table->dropColumn([
                'unit_code',
                'load_type',
                'pit_geofence_id',
                'dumping_geofence_id',
                'loading_time',
                'travel_load_time',
                'dumping_time',
                'travel_empty_time',
                'cycle_time_minutes',
                'distance_km',
                'pto_confirmed',
                'status',
            ]);
        });
    }
};
