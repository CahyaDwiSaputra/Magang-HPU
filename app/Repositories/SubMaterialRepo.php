<?php

namespace App\Repositories;

use App\Models\SubMaterialModel;

class SubMaterialRepo
{

    public static function get($id)
    {
        //query
        $query = SubMaterialModel::find($id);

        return $query->first()->toArray();
    }

    public static function gets($params)
    {
        $params['per_page'] = isset($params['per_page']) ? trim($params['per_page']) : "";
        $params['q']        = isset($params['q']) ? $params['q'] : "";
        $params['site']     = isset($params['site']) ? trim($params['site']) : "";
        $params['material_id'] = isset($params['material_id']) ? trim($params['material_id']) : "";
        
        //columns
        $columns = [
            "site",
            "submaterial_name",
            "material_id",
            "factor",
            "created_by",
            "updated_by",
            "deleted_at"
        ];

        //query
        $query = SubMaterialModel::with("site_rl", "material_rl");

        //-- filter by site
        if ($params['site'] != "") {
            $query = $query->where("site", $params['site']);
        }

        //-- filter by material_id
        if ($params['material_id'] != "") {
            $query = $query->where("material_id", $params['material_id']);
        }

        //-- column like
        $query = $query->where(function ($q) use ($columns, $params) {
            foreach ($columns as $idx => $value) {
                if ($idx == 0) {
                    $q->where($value, "LIKE", "%" . $params['q'] . "%");
                    continue;
                }

                $q->orWhere($value, "LIKE", "%" . $params['q'] . "%");
            }
        });

        //return
        return $query->paginate($params['per_page'])->toArray();
    }
}