<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Repositories\SiteRepo;
use App\Models\SiteModel;

class SiteController extends Controller
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
            "siteID"        =>"required|unique:App\Models\SiteModel",
            "companyID"     =>"required|exists:App\Models\CompanyModel,company_code",
            "siteName"      =>"required",
            "createdBy"     =>"required",
            "updatedBy"     =>"required",
            "is_headoffice" =>"required|in:YES,NO",
            "deleted_at"    =>"nullable|in:YES,NO"
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()->first()
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req){
            SiteModel::create([
                "siteID"        =>$req['siteID'],
                "companyID"     =>$req['companyID'],
                "siteName"      =>$req['siteName'],
                "createdBy"     =>$req['createdBy'],
                "updatedBy"     =>$req['updatedBy'],
                "is_headoffice" =>$req['is_headoffice'],
                "deleted_at"    =>isset($req['deleted_at'])?$req['deleted_at']:null
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
        $id_data=SiteModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //VALIDATION
        $validation=Validator::make($req, [
            "siteID"        =>[
                "nullable",
                Rule::unique("App\Models\SiteModel")->ignore($id, "siteID")
            ],
            "companyID"     =>"nullable|exists:App\Models\CompanyModel,company_code",
            "siteName"      =>"nullable",
            "createdBy"     =>"nullable",
            "updatedBy"     =>"nullable",
            "is_headoffice" =>"nullable|in:YES,NO",
            "deleted_at"    =>"nullable|in:YES,NO"
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
            
            if(isset($req['siteID'])){
                $data_update['siteID']=$req['siteID'];
            }
            if(isset($req['companyID'])){
                $data_update['companyID']=$req['companyID'];
            }
            if(isset($req['siteName'])){
                $data_update['siteName']=$req['siteName'];
            }
            if(isset($req['createdBy'])){
                $data_update['createdBy']=$req['createdBy'];
            }
            if(isset($req['updatedBy'])){
                $data_update['updatedBy']=$req['updatedBy'];
            }
            if(isset($req['is_headoffice'])){
                $data_update['is_headoffice']=$req['is_headoffice'];
            }
            if(isset($req['deleted_at'])){
                $data_update['deleted_at']=$req['deleted_at'];
            }

            SiteModel::find($id)->update($data_update);
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
        $id_data=SiteModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req, $id){
            SiteModel::find($id)->delete();
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
        $id_data=SiteModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //SUCCESS
        $data=SiteRepo::get($id);

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
            'companyID'     =>"nullable"
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()->first()
            ], 400);
        }

        //SUCCESS
        $data=SiteRepo::gets($req);

        return response()->json([
            'first_page'    =>1,
            'current_page'  =>$data['current_page'],
            'last_page'     =>$data['last_page'],
            'total'         =>$data['total'],
            'data'          =>$data['data']
        ]);
    }
}
