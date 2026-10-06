<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;


#[Table('ms_status_category', key:"id",)]
#[Fillable([
    "status_category",
    "deleted_at"
])]
class CategoryModel extends Model
{
    //
    protected $perPage=99999999999999999999;
}
