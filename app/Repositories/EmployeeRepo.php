<?php

namespace App\Repositories;

use App\Models\EmployeeModel;

class EmployeeRepo{

    public static function get($id)
    {
        //query
        $query=EmployeeModel::find($id);

        return $query->first()->toArray();
    }
    public static function gets($params)
    {
        $params['per_page']=isset($params['per_page'])?trim($params['per_page']):"";
        $params['q']=isset($params['q'])?$params['q']:"";
        $params['SiteId']=isset($params['SiteId'])?$params['SiteId']:"";
        $params['DeptID']=isset($params['DeptID'])?$params['DeptID']:"";
        
        //columns
        $columns=[
            "EmployeeID",
            "EmployeeName",
            "SiteId",
            "DeptID",
            "Class",
            "Status",
            "PositionName"
        ];

        //query
        $query=EmployeeModel::with("site_rl", "department_rl");
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
        //SiteId
        if($params['SiteId']!=""){
            $query=$query->where("SiteId", $params['SiteId']);
        }
        //DeptID
        if($params['DeptID']!=""){
            $query=$query->where("DeptID", $params['DeptID']);
        }

        //return
        return $query->paginate($params['per_page'])->toArray();
    }
}