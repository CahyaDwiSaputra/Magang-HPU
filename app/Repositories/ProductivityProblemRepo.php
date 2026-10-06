<?php

namespace App\Repositories;

use App\Models\ProductivityProblemModel;

class ProductivityProblemRepo
{

    public static function get($id)
    {
        //query
        $query = ProductivityProblemModel::find($id);

        return $query->first()->toArray();
    }

    public static function gets($params)
    {
        $params['per_page'] = isset($params['per_page']) ? trim($params['per_page']) : "";
        $params['q']        = isset($params['q']) ? $params['q'] : "";
        
        //columns
        $columns = [
            "prod_problem",
            "problem_description",
            "created_by",
            "updated_by",
            "deleted_at"
        ];

        //query
        $query = ProductivityProblemModel::query();
        
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