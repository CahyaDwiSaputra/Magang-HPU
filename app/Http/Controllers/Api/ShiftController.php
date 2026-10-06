<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Repositories\ShiftRepo;
use App\Models\ShiftModel;

class ShiftController extends Controller
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
            "siteId"    =>"required|exists:App\Models\SiteModel,siteID",
            "shift"     =>"required",
            "start_time"=>"required",
            "end_time"  =>"required",
            "created_by"=>"required",
            "updated_by"=>"required"
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()->first()
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req){
            ShiftModel::create([
                "siteId"    =>$req['siteId'],
                "shift"     =>$req['shift'],
                "start_time"=>$req['start_time'],
                "end_time"  =>$req['end_time'],
                "created_by"=>$req['created_by'],
                "updated_by"=>$req['updated_by']
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
        $id_data=ShiftModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //VALIDATION
        $validation=Validator::make($req, [
            "siteId"    =>"nullable|exists:App\Models\SiteModel,siteID",
            "shift"     =>"nullable",
            "start_time"=>"nullable",
            "end_time"  =>"nullable",
            "created_by"=>"nullable",
            "updated_by"=>"nullable"
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
            if(isset($req['siteId'])){
                $data_update['siteId']=$req['siteId'];
            }
            if(isset($req['shift'])){
                $data_update['shift']=$req['shift'];
            }
            if(isset($req['start_time'])){
                $data_update['start_time']=$req['start_time'];
            }
            if(isset($req['end_time'])){
                $data_update['end_time']=$req['end_time'];
            }
            if(isset($req['created_by'])){
                $data_update['created_by']=$req['created_by'];
            }
            if(isset($req['updated_by'])){
                $data_update['updated_by']=$req['updated_by'];
            }

            ShiftModel::find($id)->update($data_update);
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
        $id_data=ShiftModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req, $id){
            ShiftModel::find($id)->delete();
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
        $id_data=ShiftModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //SUCCESS
        $data=ShiftRepo::get($id);

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
        $data=ShiftRepo::gets($req);

        return response()->json([
            'first_page'    =>1,
            'current_page'  =>$data['current_page'],
            'last_page'     =>$data['last_page'],
            'total'         =>$data['total'],
            'data'          =>$data['data']
        ]);
    }
}
