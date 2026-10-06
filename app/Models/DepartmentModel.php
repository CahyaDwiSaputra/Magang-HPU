<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;


#[Table('msdepartement', key:"deptID",)]
#[Fillable([
    "deptCode",
    "deptName",
    "createdBy",
    "updatedBy"
])]
class DepartmentModel extends Model
{
    //
    protected $perPage=99999999999999999999;
    
}
