<?php

namespace App\Repositories;

use App\Models\ItemCategoryModel;

class ItemCategoryRepo{

    public static function get($id)
    {
        //query
        $query=ItemCategoryModel::find($id);

        return $query->first()->toArray();
    }
    public static function gets($params)
    {
        $params['per_page']=isset($params['per_page'])?trim($params['per_page']):"";
        $params['q']=isset($params['q'])?$params['q']:"";
        $params['category_id']=isset($params['category_id'])?$params['category_id']:"";
        $params['dedicated']=isset($params['dedicated'])?$params['dedicated']:"";
        
        //columns
        $columns=[
            "category_id",
            "item_category",
            "deleted_at",
            "required_operator",
            "dedicated"
        ];

        //query
        $query=ItemCategoryModel::with("category_rl", "dedicated_rl");
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
        //category_id
        if($params['category_id']!=""){
            $query=$query->where("category_id", $params['category_id']);
        }
        //dedicated
        if($params['dedicated']!=""){
            $query=$query->where("dedicated", $params['dedicated']);
        }

        //return
        return $query->paginate($params['per_page'])->toArray();
    }
}