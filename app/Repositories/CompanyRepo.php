<?php

namespace App\Repositories;

use App\Models\CompanyModel;

class CompanyRepo{

    public static function get($id)
    {
        //query
        $query=CompanyModel::find($id);

        return $query->first()->toArray();
    }
    public static function gets($params)
    {
        $params['per_page']=isset($params['per_page'])?trim($params['per_page']):"";
        $params['q']=isset($params['q'])?$params['q']:"";
        
        //columns
        $columns=[
            "company_code",
            "company_name",
            "createdBy",
            "updatedBy",
            "sap_chart_of_account"
        ];

        //query
        $query=CompanyModel::query();
        //--column like
        // $query=$query->where(function($q)use($columns, $params){
        //     foreach($columns as $idx=>$value){
        //         if($idx==0){
        //             $q->where($value, "LIKE", "%".$params['q']."%");
        //             continue;
        //         }

        //         $q->orWhere($value, "LIKE", "%".$params['q']."%");
        //     }
        // });

        //return
        return $query->paginate($params['per_page'])->toArray();
    }
}