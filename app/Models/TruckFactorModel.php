<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


#[Table('ms_truck_factor', key:"id",)]
#[Fillable([
    "id",
    "site",
    "location_id",
    "model_number",
    "truck_factor",
    "created_by",
    "updated_by",
    "deleted_at"
])]
class TruckFactorModel extends Model
{
    //
    protected $perPage=99999999999999999999;

    public function site_rl(): BelongsTo
    {
        return $this->belongsTo(SiteModel::class, 'site', 'siteID');
    }

    public function location_rl(): BelongsTo
    {
        return $this->belongsTo(PitLocationModel::class, 'location_id', 'id');
    }
}
