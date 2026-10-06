<?php

namespace App\Repositories;

use App\Models\DepartmentModel;

class DepartmentRepo{

    public static function get($id)
    {
        //query
        $query=DepartmentModel::find($id);

        return $query->first()->toArray();
    }
    public static function gets($params)
    {
        $params['per_page']=isset($params['per_page'])?trim($params['per_page']):"";
        $params['q']=isset($params['q'])?$params['q']:"";
        
        //columns
        $columns=[
            "deptID",
            "deptCode",
            "deptName",
            "createdBy",
            "updatedBy"
        ];

        //query
        $query=DepartmentModel::query();
        //--column like
        $query=$query->where(function($q)use($columns, $params){
            foreach($columns as $idx=>$value){
                if($idx==0){
                    $q->where($value, "LIKE", "%".$params['q']."%");
                    continue;
                }

                $q->orWhere($value, "LIKE", "%".$params['q']."%");
            }
        });

        //return
        return $query->paginate($params['per_page'])->toArray();
    }
}