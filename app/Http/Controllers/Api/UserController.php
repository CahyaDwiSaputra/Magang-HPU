<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Models\User as UserModel;
use App\Repositories\UserRepo;


class UserController extends Controller
{
    
    /**
     * tambah user
     *
     * @authenticated
     * @group Users
     */
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
            'employee_id'=>"present|required_if:role,operator",
            'username'  =>"required|unique:App\Models\User",
            'password'  =>"required",
            'role'      =>"required|in:admin|operator",
            'name'      =>"required",
            'avatar_url'=>"present",
            'no_wa'     =>"required|numeric",
            'email'     =>"required|email"
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()->first()
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req){
            UserModel::create([
                'employee_id'   =>$req['employee_id']!=""?$req['employee_id']:null,
                'username'      =>$req['username'],
                'password'      =>$req['password'],
                'role'          =>$req['role'],
                'name'          =>$req['name'],
                'avatar_url'    =>$req['avatar_url'],
                'no_wa'         =>$req['no_wa'],
                'email'         =>$req['email']
            ]);
        });

        return response()->json([
            'status'=>"ok"
        ]);
    }

    /**
     * update user
     *
     * @authenticated
     * @bodyParam id diambil dari id(abaikan ini). No-example
     * @group Users
     */
    public function update(Request $request, $id)
    {
        $login_data=$request->user();
        $req=$request->all();

        //ROLE AUTHENTICATION
        if(!in_array($login_data['role'], ['admin'])){
            return response('Not Allowed.', 403);
        }

        //VALIDATION ID
        $id_data=UserModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //VALIDATION
        $validation=Validator::make($req, [
            'password'  =>"present",
            'name'      =>"required",
            'avatar_url'=>"present",
            'no_wa'     =>"required|numeric",
            'email'     =>"required|email"
            
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()->first()
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req, $id){
            $data_update=[
                'username'  =>$req['username'],
                'name'      =>$req['name'],
                'avatar_url'=>$req['avatar_url'],
                'no_wa'     =>$req['no_wa'],
                'email'     =>$req['email']
            ];
            if(trim($req['password'])!=""){
                $data_update['password']=Hash::make($req['password']);
            }

            UserModel::where("id", $id)->update($data_update);
        });

        return response()->json([
            'status'=>"ok"
        ]);
    }

    /**
     * hapus user
     *
     * @authenticated
     * @bodyParam id diambil dari id(abaikan ini). No-example
     * @group Users
     */
    public function delete(Request $request, $id)
    {
        $login_data=$request->user();
        $req=$request->all();

        //ROLE AUTHENTICATION
        if(!in_array($login_data['role'], ['admin'])){
            return response('Not Allowed.', 403);
        }

        //VALIDATION ID
        $id_data=UserModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //SUCCESS
        DB::transaction(function()use($req, $id){
            UserModel::where("id", $id)->delete();
        });

        return response()->json([
            'status'=>"ok"
        ]);
    }

    /**
     * user
     *
     * @authenticated
     * @bodyParam id diambil dari id(abaikan ini). No-example
     * @group Users
     */
    public function get(Request $request, $id)
    {
        $login_data=$request->user();
        $req=$request->all();

        //ROLE AUTHENTICATION
        // if(!in_array($login_data['role'], ['admin'])){
        //     return response('Not Allowed.', 403);
        // }

        //VALIDATION ID
        $id_data=UserModel::find($id);
        if(!isset($id_data)){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>"Bad request."
            ], 400);
        }

        //SUCCESS
        $data=UserRepo::get($id);

        return response()->json([
            'data'      =>$data
        ]);
    }

    /**
     * list user
     *
     * @authenticated
     * @group Users
     */
    public function gets(Request $request)
    {
        $login_data=$request->user();
        $req=$request->all();

        //ROLE AUTHENTICATION
        // if(!in_array($login_data['role'], ['admin'])){
        //     return response('Not Allowed.', 403);
        // }

        //VALIDATION
        //Query parameters
        $validation=Validator::make($req, [
            'per_page'  =>"nullable|integer|min:1",
            'q'         =>"nullable",
            'role'      =>"nullable"
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()->first()
            ], 400);
        }

        //SUCCESS
        $user=UserRepo::gets($req);

        return response()->json([
            'first_page'    =>1,
            'current_page'  =>$user['current_page'],
            'last_page'     =>$user['last_page'],
            'total'         =>$user['total'],
            'data'          =>$user['data']
        ]);
    }
}