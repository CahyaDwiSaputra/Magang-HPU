<?php

namespace App\Repositories;

use App\Models\ShiftModel;

class ShiftRepo{

    public static function get($id)
    {
        //query
        $query=ShiftModel::find($id);

        return $query->first()->toArray();
    }
    public static function gets($params)
    {
        $params['per_page']=isset($params['per_page'])?trim($params['per_page']):"";
        $params['q']=isset($params['q'])?$params['q']:"";
        $params['siteId']=isset($params['siteId'])?$params['siteId']:"";
        
        //columns
        $columns=[
            "siteId",
            "shift",
            "start_time",
            "end_time",
            "created_by",
            "updated_by"
        ];

        //query
        $query=ShiftModel::with("site_rl");
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
        //siteId
        if($params['siteId']!=""){
            $query=$query->where("siteId", $params['siteId']);
        }

        //return
        return $query->paginate($params['per_page'])->toArray();
    }
}