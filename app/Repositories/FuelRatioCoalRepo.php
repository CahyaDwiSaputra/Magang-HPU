<?php

namespace App\Repositories;

use App\Models\FuelRatioCoalModel;

class FuelRatioCoalRepo{

    public static function get($id)
    {
        //query
        $query=FuelRatioCoalModel::find($id);

        return $query->first()->toArray();
    }
    public static function gets($params)
    {
        $params['per_page']=isset($params['per_page'])?trim($params['per_page']):"";
        $params['q']=isset($params['q'])?$params['q']:"";
        $params['site']=isset($params['site'])?$params['site']:"";
        
        //columns
        $columns=[
            "plan_date",
            "site",
            "fr_coal_getting",
            "fr_coal_hauling",
            "fr_coal_haul_road",
            "deleted_at"
        ];

        //query
        $query=FuelRatioCoalModel::with("site_rl");
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
        //site
        if($params['site']!=""){
            $query=$query->where("site", $params['site']);
        }

        //return
        return $query->paginate($params['per_page'])->toArray();
    }
}