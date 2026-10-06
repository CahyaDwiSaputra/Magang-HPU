<?php

namespace App\Repositories;

use App\Models\SiteModel;

class SiteRepo{

    public static function get($id)
    {
        //query
        $query=SiteModel::find($id);

        return $query->first()->toArray();
    }
    public static function gets($params)
    {
        $params['per_page']=isset($params['per_page'])?trim($params['per_page']):"";
        $params['q']=isset($params['q'])?$params['q']:"";
        $params['companyID']=isset($params['companyID'])?$params['companyID']:"";
        
        //columns
        $columns=[
            "siteID",
            "companyID",
            "siteName",
            "createdBy",
            "updatedBy",
            "is_headoffice",
            "deleted_at"
        ];

        //query
        $query=SiteModel::with("company_rl");
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

        //companyID
        if($params['companyID']!=""){
            $query=$query->where("companyID", $params['companyID']);
        }

        //return
        return $query->paginate($params['per_page'])->toArray();
    }
}