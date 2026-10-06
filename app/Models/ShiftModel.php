<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


#[Table('msshift', key:"id",)]
#[Fillable([
    "id",
    "siteId",
    "shift",
    "start_time",
    "end_time",
    "created_by",
    "updated_by"
])]
class ShiftModel extends Model
{
    //
    protected $perPage=99999999999999999999;

    public function site_rl(): BelongsTo
    {
        return $this->belongsTo(SiteModel::class, 'siteId', 'siteID');
    }
}
