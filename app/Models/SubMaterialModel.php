<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


#[Table('ms_submaterial', key:"id",)]
#[Fillable([
    "id",
    "site",
    "submaterial_name",
    "material_id",
    "factor",
    "created_by",
    "updated_by",
    "deleted_at"
])]
class SubMaterialModel extends Model
{
    //
    protected $perPage=99999999999999999999;

    public function site_rl(): BelongsTo
    {
        return $this->belongsTo(SiteModel::class, 'site', 'siteID');
    }

    public function material_rl(): BelongsTo
    {
        return $this->belongsTo(MaterialModel::class, 'material_id', 'id');
    }
}
