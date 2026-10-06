<?php

namespace App\Repositories;

use App\Models\TruckFactorModel;

class TruckFactorRepo
{

    public static function get($id)
    {
        //query
        $query = TruckFactorModel::find($id);

        return $query->first()->toArray();
    }

    public static function gets($params)
    {
        $params['per_page'] = isset($params['per_page']) ? trim($params['per_page']) : "";
        $params['q']        = isset($params['q']) ? $params['q'] : "";
        $params['site']     = isset($params['site']) ? trim($params['site']) : "";
        $params['location_id'] = isset($params['location_id']) ? trim($params['location_id']) : "";
        
        //columns
        $columns = [
            "site",
            "location_id",
            "model_number",
            "truck_factor",
            "created_by",
            "updated_by",
            "deleted_at"
        ];

        //query
        $query = TruckFactorModel::with("site_rl", "location_rl");

        //-- filter by site
        if ($params['site'] != "") {
            $query = $query->where("site", $params['site']);
        }

        //-- filter by location_id
        if ($params['location_id'] != "") {
            $query = $query->where("location_id", $params['location_id']);
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