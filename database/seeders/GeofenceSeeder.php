<?php

namespace Database\Seeders;

use App\Models\Geofence;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GeofenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonFile = database_path('data/hauling_geofences.json');

        if (!file_exists($jsonFile)) {
            $this->command?->error("File data geofence tidak ditemukan: {$jsonFile}");
            return;
        }

        $items = json_decode(file_get_contents($jsonFile), true);

        if (!is_array($items) || empty($items)) {
            $this->command?->error("Format data geofence JSON tidak valid atau kosong.");
            return;
        }

        $this->command?->info("Memproses " . count($items) . " geofences (POI operasional & checkpoint STA)...");

        $now = now();
        $count = 0;

        DB::transaction(function () use ($items, $now, &$count) {
            foreach ($items as $item) {
                Geofence::updateOrCreate(
                    ['name' => $item['name']],
                    [
                        'site'             => $item['site'] ?? 'HPA',
                        'type'             => $item['type'],
                        'latitude'         => $item['latitude'],
                        'longitude'        => $item['longitude'],
                        'radius'           => $item['radius'],
                        'color'            => $item['color'] ?? '#3B82F6',
                        'address'          => $item['address'] ?? null,
                        'material'         => $item['material'] ?? 'OB',
                        'geometry_type'    => $item['geometry_type'] ?? 'circle',
                        'coordinates_json' => $item['coordinates_json'] ?? null,
                        'updated_at'       => $now,
                    ]
                );
                $count++;
            }
        });

        $this->command?->info("Sukses mengimpor {$count} geofences ke database!");
    }
}
