<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


#[Table('ms_base_ob_and_distance', key:"id",)]
#[Fillable([
    "id",
    "plan_date",
    "site",
    "base_ob",
    "pengurang_jarak",
    "deleted_at",
    "base_over_distance"
])]
class KoefisienBaseOBModel extends Model
{
    //
    protected $perPage=99999999999999999999;

    public function site_rl(): BelongsTo
    {
        return $this->belongsTo(SiteModel::class, 'site', 'siteID');
    }
}
