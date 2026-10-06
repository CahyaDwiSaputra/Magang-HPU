<?php

namespace App\Repositories;

use App\Models\PitLocationModel;

class PitLocationRepo
{

    public static function get($id)
    {
        //query
        $query = PitLocationModel::find($id);

        return $query->first()->toArray();
    }

    public static function gets($params)
    {
        $params['per_page'] = isset($params['per_page']) ? trim($params['per_page']) : "";
        $params['q']        = isset($params['q']) ? $params['q'] : "";
        $params['site']     = isset($params['site']) ? trim($params['site']) : "";
        $params['parent_id'] = isset($params['parent_id']) ? trim($params['parent_id']) : "";
        
        //columns
        $columns = [
            "site",
            "location_name",
            "parent_id",
            "created_by",
            "updated_by",
            "deleted_at"
        ];

        //query
        $query = PitLocationModel::with("site_rl", "parent_rl");

        //-- filter by site
        if ($params['site'] != "") {
            $query = $query->where("site", $params['site']);
        }

        //-- filter by parent_id
        if ($params['parent_id'] != "") {
            $query = $query->where("parent_id", $params['parent_id']);
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