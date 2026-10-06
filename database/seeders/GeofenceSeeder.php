<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GeofenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Geofence::where('name', 'Dumping Area (Simulasi)')->delete();

        $geofences = [
            [
                'name'          => 'Pit Front A (Loading OB)',
                'type'          => 'loading',
                'material'      => 'OB',
                'color'         => '#6B7280', // Grey for OB (Slide 28)
                'address'       => 'Site BDA - Front Pit 1 (Loading OB)',
                'geometry_type' => 'circle',
                'latitude'      => -7.658200,
                'longitude'     => 111.189500,
                'radius'        => 120,
            ],
            [
                'name'          => 'Pit Front B (Coal Getting)',
                'type'          => 'loading',
                'material'      => 'COAL',
                'color'         => '#1E293B', // Black for Coal (Slide 28)
                'address'       => 'Site BDA - Seam 3 Coal Getting',
                'geometry_type' => 'circle',
                'latitude'      => -7.657100,
                'longitude'     => 111.188200,
                'radius'        => 100,
            ],
            [
                'name'          => 'Disposal Timur (Waste Dump)',
                'type'          => 'dumping',
                'material'      => 'OB',
                'color'         => '#8B5CF6', // Purple for Dumping
                'address'       => 'Area Disposal Timur HPU',
                'geometry_type' => 'circle',
                'latitude'      => -7.659397,
                'longitude'     => 111.191127,
                'radius'        => 150,
            ],
            [
                'name'          => 'Disposal Barat (Waste Dump)',
                'type'          => 'dumping',
                'material'      => 'OB',
                'color'         => '#A855F7',
                'address'       => 'Area Disposal Barat HPU',
                'geometry_type' => 'circle',
                'latitude'      => -7.661200,
                'longitude'     => 111.187800,
                'radius'        => 130,
            ],
            [
                'name'          => 'ROM Stockpile (Coal Dumping)',
                'type'          => 'dumping',
                'material'      => 'COAL',
                'color'         => '#0F172A',
                'address'       => 'ROM Stockpile & Crusher Facility',
                'geometry_type' => 'circle',
                'latitude'      => -7.662500,
                'longitude'     => 111.193500,
                'radius'        => 120,
            ],
            [
                'name'          => 'Workshop & Basecamp HPU',
                'type'          => 'parking',
                'material'      => 'OB',
                'color'         => '#10B981', // Green for Basecamp
                'address'       => 'Main Office & Heavy Equipment Workshop',
                'geometry_type' => 'circle',
                'latitude'      => -7.656500,
                'longitude'     => 111.193000,
                'radius'        => 100,
            ],
        ];

        foreach ($geofences as $g) {
            \App\Models\Geofence::updateOrCreate(
                ['name' => $g['name']],
                $g
            );
        }
    }
}
