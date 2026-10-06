<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;


#[Table('ms_status_dedicated', key:"id",)]
#[Fillable([
    "dedicated_value",
    "deleted_at"
])]
class DedicatedModel extends Model
{
    //
    protected $perPage=99999999999999999999;
}
