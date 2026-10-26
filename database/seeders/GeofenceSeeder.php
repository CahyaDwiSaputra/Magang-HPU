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
        // Dummy geofences di Jawa dinonaktifkan agar peta bersih.
        // Zona tambang riil akan dibuat secara manual melalui fitur zona/tarik area.
    }
}
