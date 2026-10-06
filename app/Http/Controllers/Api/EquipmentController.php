<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Repositories\EquipmentRepo;
use App\Models\EquipmentModel;

class EquipmentController extends Controller
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
            "equipment_id"      =>"required|unique:App\Models\EquipmentModel",
            "manufacturer"      =>"required",
            "model_number"      =>"required",
            "tank_capacity"     =>"required",
            "category"          =>"required",
            "category_desc"     =>"required",
            "auth_group"        =>"required",
            "auth_text"         =>"required",
            "company_code"      =>"nullable|exists:App\Models\CompanyModel",
            "createdBy"         =>"required",
            "updatedBy"         =>"required",
            "deleted"           =>"present|in:YES,NO"
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()->first()
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req){
            EquipmentModel::create([
                "equipment_id"      =>$req['equipment_id'],
                "manufacturer"      =>$req['manufacturer'],
                "model_number"      =>$req['model_number'],
                "tank_capacity"     =>$req['tank_capacity'],
                "category"          =>$req['category'],
                "category_desc"     =>$req['category_desc'],
                "auth_group"        =>$req['auth_group'],
                "auth_text"         =>$req['auth_text'],
                "company_code"      =>$req['company_code'],
                "createdBy"         =>$req['createdBy'],
                "updatedBy"         =>$req['updatedBy'],
                "deleted"           =>$req['deleted']
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
        $id_data=EquipmentModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //VALIDATION
        $validation=Validator::make($req, [
            "equipment_id"      =>[
                "nullable",
                Rule::unique("App\Models\EquipmentModel")->ignore($id, "equipment_id")
            ],
            "manufacturer"      =>"nullable",
            "model_number"      =>"nullable",
            "tank_capacity"     =>"nullable",
            "category"          =>"nullable",
            "category_desc"     =>"nullable",
            "auth_group"        =>"nullable",
            "auth_text"         =>"nullable",
            "company_code"      =>"nullable|exists:App\Models\CompanyModel",
            "createdBy"         =>"nullable",
            "updatedBy"         =>"nullable",
            "deleted"           =>"nullable|in:YES,NO"
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
            if(isset($req['equipment_id'])){
                $data_update['equipment_id']=$req['equipment_id'];
            }
            if(isset($req['manufacturer'])){
                $data_update['manufacturer']=$req['manufacturer'];
            }
            if(isset($req['model_number'])){
                $data_update['model_number']=$req['model_number'];
            }
            if(isset($req['tank_capacity'])){
                $data_update['tank_capacity']=$req['tank_capacity'];
            }
            if(isset($req['category'])){
                $data_update['category']=$req['category'];
            }
            if(isset($req['category_desc'])){
                $data_update['category_desc']=$req['category_desc'];
            }
            if(isset($req['auth_group'])){
                $data_update['auth_group']=$req['auth_group'];
            }
            if(isset($req['auth_text'])){
                $data_update['auth_text']=$req['auth_text'];
            }
            if(isset($req['company_code'])){
                $data_update['company_code']=$req['company_code'];
            }
            if(isset($req['createdBy'])){
                $data_update['createdBy']=$req['createdBy'];
            }
            if(isset($req['updatedBy'])){
                $data_update['updatedBy']=$req['updatedBy'];
            }
            if(isset($req['deleted'])){
                $data_update['deleted']=$req['deleted'];
            }

            EquipmentModel::find($id)->update($data_update);
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
        $id_data=EquipmentModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req, $id){
            EquipmentModel::find($id)->delete();
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
        $id_data=EquipmentModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //SUCCESS
        $data=EquipmentRepo::get($id);

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
            'q'             =>"nullable"
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()->first()
            ], 400);
        }

        //SUCCESS
        $data=EquipmentRepo::gets($req);

        return response()->json([
            'first_page'    =>1,
            'current_page'  =>$data['current_page'],
            'last_page'     =>$data['last_page'],
            'total'         =>$data['total'],
            'data'          =>$data['data']
        ]);
    }
}
