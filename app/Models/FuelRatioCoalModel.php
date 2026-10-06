<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


#[Table('ms_fuel_ratio_coal', key:"id",)]
#[Fillable([
    "id",
    "plan_date",
    "site",
    "fr_coal_getting",
    "fr_coal_hauling",
    "fr_coal_haul_road",
    "deleted_at"
])]
class FuelRatioCoalModel extends Model
{
    //
    protected $perPage=99999999999999999999;


    public function site_rl(): BelongsTo
    {
        return $this->belongsTo(SiteModel::class, 'site', 'siteID');
    }
}
