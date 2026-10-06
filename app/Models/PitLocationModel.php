<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


#[Table('ms_pit_location', key:"id",)]
#[Fillable([
    "id",
    "site",
    "location_name",
    "parent_id",
    "created_by",
    "updated_by",
    "deleted_at"
])]
class PitLocationModel extends Model
{
    //
    protected $perPage=99999999999999999999;

    public function site_rl(): BelongsTo
    {
        return $this->belongsTo(SiteModel::class, 'site', 'siteID');
    }

    public function parent_rl(): BelongsTo
    {
        return $this->belongsTo(PitLocationModel::class, 'parent_id', 'id');
    }
}
