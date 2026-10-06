<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Repositories\FuelRatioCoalRepo;
use App\Models\FuelRatioCoalModel;

class FuelRatioCoalController extends Controller
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
            "site"    =>"required|exists:App\Models\SiteModel,siteID",
            "plan_date"         =>"required|date_format:Y-m-d",
            "fr_coal_getting"   =>"required",
            "fr_coal_hauling"   =>"required",
            "fr_coal_haul_road" =>"required",
            "deleted_at"        =>"nullable"
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()->first()
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req){
            FuelRatioCoalModel::create([
                "site"    =>$req['site'],
                "plan_date"         =>$req['plan_date'],
                "fr_coal_getting"   =>$req['fr_coal_getting'],
                "fr_coal_hauling"   =>$req['fr_coal_hauling'],
                "fr_coal_haul_road" =>$req['fr_coal_haul_road'],
                "deleted_at"        =>isset($req['deleted_at'])?$req['deleted_at']:null
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
        $id_data=FuelRatioCoalModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //VALIDATION
        $validation=Validator::make($req, [
            "site"    =>"nullable|exists:App\Models\SiteModel,siteID",
            "plan_date"         =>"nullable|date_format:Y-m-d",
            "fr_coal_getting"   =>"nullable",
            "fr_coal_hauling"   =>"nullable",
            "fr_coal_haul_road" =>"nullable",
            "deleted_at"        =>"nullable"
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
            if(isset($req['site'])){
                $data_update['site']=$req['site'];
            }
            if(isset($req['plan_date'])){
                $data_update['plan_date']=$req['plan_date'];
            }
            if(isset($req['fr_coal_getting'])){
                $data_update['fr_coal_getting']=$req['fr_coal_getting'];
            }
            if(isset($req['fr_coal_hauling'])){
                $data_update['fr_coal_hauling']=$req['fr_coal_hauling'];
            }
            if(isset($req['fr_coal_haul_road'])){
                $data_update['fr_coal_haul_road']=$req['fr_coal_haul_road'];
            }
            if(isset($req['deleted_at'])){
                $data_update['deleted_at']=$req['deleted_at'];
            }

            FuelRatioCoalModel::find($id)->update($data_update);
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
        $id_data=FuelRatioCoalModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req, $id){
            FuelRatioCoalModel::find($id)->delete();
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
        $id_data=FuelRatioCoalModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //SUCCESS
        $data=FuelRatioCoalRepo::get($id);

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
            'site'          =>"nullable"
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()->first()
            ], 400);
        }

        //SUCCESS
        $data=FuelRatioCoalRepo::gets($req);

        return response()->json([
            'first_page'    =>1,
            'current_page'  =>$data['current_page'],
            'last_page'     =>$data['last_page'],
            'total'         =>$data['total'],
            'data'          =>$data['data']
        ]);
    }
}
