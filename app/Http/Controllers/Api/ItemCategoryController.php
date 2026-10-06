<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Repositories\ItemCategoryRepo;
use App\Models\ItemCategoryModel;

class ItemCategoryController extends Controller
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
            "category_id"       =>"required|exists:App\Models\CategoryModel,id",
            "item_category"     =>"required",
            "deleted_at"        =>"nullable",
            "required_operator" =>"present",
            "dedicated"         =>"present|exists:App\Models\DedicatedModel,id"
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()->first()
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req){
            ItemCategoryModel::create([
                "category_id"       =>$req['category_id'],
                "item_category"     =>$req['item_category'],
                "deleted_at"        =>isset($req['deleted_at'])?$req['deleted_at']:null,
                "required_operator" =>$req['required_operator'],
                "dedicated"         =>$req['dedicated']
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
        $id_data=ItemCategoryModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //VALIDATION
        $validation=Validator::make($req, [
            "category_id"       =>"nullable|exists:App\Models\CategoryModel,id",
            "item_category"     =>"nullable",
            "deleted_at"        =>"nullable",
            "required_operator" =>"nullable",
            "dedicated"         =>"nullable|exists:App\Models\DedicatedModel,id"
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
            if(isset($req['category_id'])){
                $data_update['category_id']=$req['category_id'];
            }
            if(isset($req['item_category'])){
                $data_update['item_category']=$req['item_category'];
            }
            if(isset($req['deleted_at'])){
                $data_update['deleted_at']=$req['deleted_at'];
            }
            if(isset($req['required_operator'])){
                $data_update['required_operator']=$req['required_operator'];
            }
            if(isset($req['dedicated'])){
                $data_update['dedicated']=$req['dedicated'];
            }

            ItemCategoryModel::find($id)->update($data_update);
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
        $id_data=ItemCategoryModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req, $id){
            ItemCategoryModel::find($id)->delete();
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
        $id_data=ItemCategoryModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //SUCCESS
        $data=ItemCategoryRepo::get($id);

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
            'siteId'        =>"nullable"
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()->first()
            ], 400);
        }

        //SUCCESS
        $data=ItemCategoryRepo::gets($req);

        return response()->json([
            'first_page'    =>1,
            'current_page'  =>$data['current_page'],
            'last_page'     =>$data['last_page'],
            'total'         =>$data['total'],
            'data'          =>$data['data']
        ]);
    }
}
