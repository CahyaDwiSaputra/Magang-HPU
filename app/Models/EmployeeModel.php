<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


#[Table('msemployee', key:"EmployeeID", keyType:"string", incrementing:false)]
#[Fillable([
    "EmployeeID",
    "EmployeeName",
    "SiteId",
    "DeptID",
    "Class",
    "Status",
    "PositionName"
])]
class EmployeeModel extends Model
{
    //
    protected $perPage=99999999999999999999;

    
    public function site_rl(): BelongsTo
    {
        return $this->belongsTo(SiteModel::class, 'SiteId', 'siteID');
    }

    public function department_rl(): BelongsTo
    {
        return $this->belongsTo(DepartmentModel::class, 'DeptID', 'deptID');
    }
}
