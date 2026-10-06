<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;


#[Table('ms_time_range', key:"id",)]
#[Fillable([
    "id",
    "time_range",
    "deleted_at",
    "start_time",
    "end_time"
])]
class TimeRangeModel extends Model
{
    //
    protected $perPage=99999999999999999999;
}
