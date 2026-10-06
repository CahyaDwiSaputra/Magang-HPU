<?php

namespace App\Repositories;

use App\Models\EquipmentModel;

class EquipmentRepo{

    public static function get($id)
    {
        //query
        $query=EquipmentModel::find($id);

        return $query->first()->toArray();
    }
    public static function gets($params)
    {
        $params['per_page']=isset($params['per_page'])?trim($params['per_page']):"";
        $params['q']=isset($params['q'])?$params['q']:"";
        
        //columns
        $columns=[
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
        ];

        //query
        $query=EquipmentModel::with("company_rl");
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