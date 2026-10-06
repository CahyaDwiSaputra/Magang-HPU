<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;


#[Table('ms_material', key:"id",)]
#[Fillable([
    "id",
    "material_name",
    "created_by",
    "updated_by",
    "deleted_at"
])]
class MaterialModel extends Model
{
    //
    protected $perPage=99999999999999999999;
}
