<?php

namespace App\Repositories;

use App\Models\KoefisienBaseOBModel;

class KoefisienBaseOBRepo
{

    public static function get($id)
    {
        //query
        $query = KoefisienBaseOBModel::find($id);

        return $query->first()->toArray();
    }

    public static function gets($params)
    {
        $params['per_page'] = isset($params['per_page']) ? trim($params['per_page']) : "";
        $params['q']        = isset($params['q']) ? $params['q'] : "";
        $params['site']     = isset($params['site']) ? trim($params['site']) : "";
        
        //columns
        $columns = [
            "plan_date",
            "site",
            "base_ob",
            "pengurang_jarak",
            "deleted_at",
            "base_over_distance"
        ];

        //query
        $query = KoefisienBaseOBModel::with("site_rl");
        
        //-- filter by site
        if ($params['site'] != "") {
            $query = $query->where("site", $params['site']);
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