<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;


#[Table('ms_productivity_problem', key:"id",)]
#[Fillable([
    "id",
    "prod_problem",
    "problem_description",
    "created_by",
    "updated_by",
    "deleted_at"
])]
class ProductivityProblemModel extends Model
{
    //
    protected $perPage=99999999999999999999;
}
