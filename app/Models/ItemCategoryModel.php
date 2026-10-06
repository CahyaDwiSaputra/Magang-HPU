<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


#[Table('ms_status_item_category', key:"id",)]
#[Fillable([
    "id",
    "category_id",
    "item_category",
    "deleted_at",
    "required_operator",
    "dedicated"
])]
class ItemCategoryModel extends Model
{
    //
    protected $perPage=99999999999999999999;


    public function category_rl(): BelongsTo
    {
        return $this->belongsTo(CategoryModel::class, 'category_id', 'id');
    }

    public function dedicated_rl(): BelongsTo
    {
        return $this->belongsTo(DedicatedModel::class, 'dedicated', 'id');
    }
}
