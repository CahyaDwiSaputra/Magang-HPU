<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


#[Table('msequipment', key:"equipment_id", keyType:"string", incrementing:false)]
#[Fillable([
    "equipment_id",
    "manufacturer",
    "model_number",
    "tank_capacity",
    "category",
    "category_desc",
    "auth_group",
    "auth_text",
    "company_code",
    "createdBy",
    "updatedBy",
    "deleted"
])]
class EquipmentModel extends Model
{
    //
    protected $perPage=99999999999999999999;


    public function company_rl(): BelongsTo
    {
        return $this->belongsTo(CompanyModel::class, 'company_code', 'company_code');
    }

}
