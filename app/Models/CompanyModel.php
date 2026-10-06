<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;


#[Table('mscompanycode', key:"company_code", keyType:"string", incrementing:false)]
#[Fillable([
    "company_code",
    "company_name",
    "createdBy",
    "updatedBy",
    "sap_chart_of_account"
])]
class CompanyModel extends Model
{
    //
    protected $perPage=99999999999999999999;
}
