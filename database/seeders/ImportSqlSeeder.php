<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ImportSqlSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $sql_file=database_path('seeders/sql/master_dump_table_data.sql');

        if(File::exists($sql_file)){
            ini_set('memory_limit', '-1');

            // Execute the raw SQL queries
            DB::unprepared(file_get_contents($sql_file));
        }
        else{
            $this->command->error("SQL file not found at: {$sql_file}");
        }
    }
}
