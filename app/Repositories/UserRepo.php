<?php

namespace App\Repositories;

use App\Models\User as UserModel;

class UserRepo{

    public static function get($id)
    {
        //query
        $query=UserModel::where('id', $id);

        return $query->first()->toArray();
    }
    public static function gets($params)
    {
        $params['per_page']=isset($params['per_page'])?trim($params['per_page']):"";
        $params['q']=isset($params['q'])?$params['q']:"";
        $params['role']=isset($params['role'])?$params['role']:"";
        
        //columns
        $columns=["name", "username", "role", "email", "no_wa"];

        //query
        $query=UserModel::query();
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
        //--role
        if($params['role']!=""){
            $query=$query->where("role", $params['role']);
        }
        
        $query=$query->orderByDesc("id");

        //return
        return $query->paginate($params['per_page'])->toArray();
    }
}