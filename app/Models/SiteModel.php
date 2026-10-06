<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


#[Table('mssite', key:"siteID", keyType:"string", incrementing:false)]
#[Fillable([
    "siteID",
    "companyID",
    "siteName",
    "createdBy",
    "updatedBy",
    "is_headoffice",
    "deleted_at"
])]
class SiteModel extends Model
{
    //
    protected $perPage=99999999999999999999;

    public function company_rl(): BelongsTo
    {
        return $this->belongsTo(CompanyModel::class, 'companyID', 'company_code');
    }
}
