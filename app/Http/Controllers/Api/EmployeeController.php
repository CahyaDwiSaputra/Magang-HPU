<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Repositories\EmployeeRepo;
use App\Models\EmployeeModel;

class EmployeeController extends Controller
{

    public function add(Request $request)
    {
        $login_data=$request->user();
        $req=$request->all();

        //ROLE AUTHENTICATION
        if(!in_array($login_data['role'], ['admin'])){
            return response('Not Allowed.', 403);
        }

        //VALIDATION
        $validation=Validator::make($req, [
            "EmployeeID"        =>"required|unique:App\Models\EmployeeModel",
            "EmployeeName"      =>"required",
            "SiteId"        =>"required|exists:App\Models\SiteModel,siteID",
            "DeptID"        =>"required|exists:App\Models\DepartmentModel,deptID",
            "Class"         =>"present",
            "Status"        =>"present",
            "PositionName"  =>"present"
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()->first()
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req){
            EmployeeModel::create([
                "EmployeeID"    =>$req['EmployeeID'],
                "EmployeeName"  =>$req['EmployeeName'],
                "SiteId"        =>$req['SiteId'],
                "DeptID"        =>$req['DeptID'],
                "Class"         =>$req['Class'],
                "Status"        =>$req['Status'],
                "PositionName"  =>$req['PositionName']
            ]);
        });

        return response()->json([
            'status'=>"ok"
        ]);
    }

    public function update(Request $request, $id)
    {
        $login_data=$request->user();
        $req=$request->all();

        //ROLE AUTHENTICATION
        if(!in_array($login_data['role'], ['admin'])){
            return response('Not Allowed.', 403);
        }

        //VALIDATION ID
        $id_data=EmployeeModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //VALIDATION
        $validation=Validator::make($req, [
            "EmployeeID"        =>[
                "nullable",
                Rule::unique("App\Models\EmployeeModel")->ignore($id, "EmployeeID")
            ],
            "EmployeeName"      =>"nullable",
            "SiteId"        =>"nullable|exists:App\Models\SiteModel,siteID",
            "DeptID"        =>"nullable|exists:App\Models\DepartmentModel,deptID",
            "Class"         =>"nullable",
            "Status"        =>"nullable",
            "PositionName"  =>"nullable"
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()->first()
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req, $id){
            $data_update=[];
            
            if(isset($req['EmployeeID'])){
                $data_update['EmployeeID']=$req['EmployeeID'];
            }
            if(isset($req['EmployeeName'])){
                $data_update['EmployeeName']=$req['EmployeeName'];
            }
            if(isset($req['SiteId'])){
                $data_update['SiteId']=$req['SiteId'];
            }
            if(isset($req['DeptID'])){
                $data_update['DeptID']=$req['DeptID'];
            }
            if(isset($req['Class'])){
                $data_update['Class']=$req['Class'];
            }
            if(isset($req['Status'])){
                $data_update['Status']=$req['Status'];
            }
            if(isset($req['PositionName'])){
                $data_update['PositionName']=$req['PositionName'];
            }

            EmployeeModel::find($id)->update($data_update);
        });

        return response()->json([
            'status'=>"ok"
        ]);
    }

    public function delete(Request $request, $id)
    {
        $login_data=$request->user();
        $req=$request->all();

        //ROLE AUTHENTICATION
        if(!in_array($login_data['role'], ['admin'])){
            return response('Not Allowed.', 403);
        }

        //VALIDATION ID
        $id_data=EmployeeModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req, $id){
            EmployeeModel::find($id)->delete();
        });

        return response()->json([
            'status'=>"ok"
        ]);
    }

    public function get(Request $request, $id)
    {
        $login_data=$request->user();
        $req=$request->all();

        // //ROLE AUTHENTICATION
        // if(!in_array($login_data['role'], ['admin'])){
        //     return response('Not Allowed.', 403);
        // }

        //VALIDATION ID
        $id_data=EmployeeModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //SUCCESS
        $data=EmployeeRepo::get($id);

        return response()->json([
            'data'      =>$data
        ]);
    }

    public function gets(Request $request)
    {
        $login_data=$request->user();
        $req=$request->all();

        // //ROLE AUTHENTICATION
        // if(!in_array($login_data['role'], ['admin'])){
        //     return response('Not Allowed.', 403);
        // }

        //VALIDATION
        //Query parameters
        $validation=Validator::make($req, [
            'per_page'      =>"nullable|integer|min:1",
            'q'             =>"nullable",
            'SiteId'        =>"nullable",
            'DeptID'        =>"nullable"
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()->first()
            ], 400);
        }

        //SUCCESS
        $data=EmployeeRepo::gets($req);

        return response()->json([
            'first_page'    =>1,
            'current_page'  =>$data['current_page'],
            'last_page'     =>$data['last_page'],
            'total'         =>$data['total'],
            'data'          =>$data['data']
        ]);
    }
}
