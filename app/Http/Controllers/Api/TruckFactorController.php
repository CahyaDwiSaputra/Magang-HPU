<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Repositories\TruckFactorRepo;
use App\Models\TruckFactorModel;
use App\Models\SiteModel;
use App\Models\PitLocationModel;

class TruckFactorController extends Controller
{

    public function add(Request $request)
    {
        $login_data = $request->user();
        $req = $request->all();

        // ROLE AUTHENTICATION
        if (!in_array($login_data['role'], ['admin'])) {
            return response('Not Allowed.', 403);
        }

        // VALIDATION
        $validation = Validator::make($req, [
            "site"          => "required|exists:App\Models\SiteModel,siteID",
            "location_id"   => "required|exists:App\Models\PitLocationModel,id",
            "model_number"  => "required",
            "truck_factor"  => "required",
            "created_by"    => "required",
            "updated_by"    => "required",
            "deleted_at"    => "nullable"
        ]);

        if ($validation->fails()) {
            return response()->json([
                'error' => "VALIDATION_ERROR",
                'data'  => $validation->errors()->first()
            ], 400);
        }

        // SUCCESS
        DB::transaction(function () use ($req) {
            TruckFactorModel::create([
                "site"          => $req['site'],
                "location_id"   => $req['location_id'],
                "model_number"  => $req['model_number'],
                "truck_factor"  => $req['truck_factor'],
                "created_by"    => $req['created_by'],
                "updated_by"    => $req['updated_by'],
                "deleted_at"    => isset($req['deleted_at'])?$req['deleted_at']:null
            ]);
        });

        return response()->json([
            'status' => "ok"
        ]);
    }

    public function update(Request $request, $id)
    {
        $login_data = $request->user();
        $req = $request->all();

        // ROLE AUTHENTICATION
        if (!in_array($login_data['role'], ['admin'])) {
            return response('Not Allowed.', 403);
        }

        // VALIDATION ID
        $id_data = TruckFactorModel::find($id);
        if (!isset($id_data)) {
            return response()->json([
                'error' => "VALIDATION_ERROR",
                'data'  => "Bad request."
            ], 400);
        }

        // VALIDATION - semua nullable
        $validation = Validator::make($req, [
            "site"          => "nullable|exists:App\Models\SiteModel,siteID",
            "location_id"   => "nullable|exists:App\Models\PitLocationModel,id",
            "model_number"  => "nullable",
            "truck_factor"  => "nullable",
            "created_by"    => "nullable",
            "updated_by"    => "nullable",
            "deleted_at"    => "nullable"
        ]);

        if ($validation->fails()) {
            return response()->json([
                'error' => "VALIDATION_ERROR",
                'data'  => $validation->errors()->first()
            ], 400);
        }

        // SUCCESS
        DB::transaction(function () use ($req, $id) {
            $data_update = [];

            if (isset($req['site'])) {
                $data_update['site'] = $req['site'];
            }
            if (isset($req['location_id'])) {
                $data_update['location_id'] = $req['location_id'];
            }
            if (isset($req['model_number'])) {
                $data_update['model_number'] = $req['model_number'];
            }
            if (isset($req['truck_factor'])) {
                $data_update['truck_factor'] = $req['truck_factor'];
            }
            if (isset($req['created_by'])) {
                $data_update['created_by'] = $req['created_by'];
            }
            if (isset($req['updated_by'])) {
                $data_update['updated_by'] = $req['updated_by'];
            }
            if (isset($req['deleted_at'])) {
                $data_update['deleted_at'] = $req['deleted_at'];
            }

            TruckFactorModel::find($id)->update($data_update);
        });

        return response()->json([
            'status' => "ok"
        ]);
    }

    public function delete(Request $request, $id)
    {
        $login_data = $request->user();
        $req = $request->all();

        // ROLE AUTHENTICATION
        if (!in_array($login_data['role'], ['admin'])) {
            return response('Not Allowed.', 403);
        }

        // VALIDATION ID
        $id_data = TruckFactorModel::find($id);
        if (!isset($id_data)) {
            return response()->json([
                'error' => "VALIDATION_ERROR",
                'data'  => "Bad request."
            ], 400);
        }

        // SUCCESS
        DB::transaction(function () use ($req, $id) {
            TruckFactorModel::find($id)->delete();
        });

        return response()->json([
            'status' => "ok"
        ]);
    }

    public function get(Request $request, $id)
    {
        $login_data = $request->user();
        $req = $request->all();

        // // ROLE AUTHENTICATION
        // if (!in_array($login_data['role'], ['admin'])) {
        //     return response('Not Allowed.', 403);
        // }

        // VALIDATION ID
        $id_data = TruckFactorModel::find($id);
        if (!isset($id_data)) {
            return response()->json([
                'error' => "VALIDATION_ERROR",
                'data'  => "Bad request."
            ], 400);
        }

        // SUCCESS
        $data = TruckFactorRepo::get($id);

        return response()->json([
            'data' => $data
        ]);
    }

    public function gets(Request $request)
    {
        $login_data = $request->user();
        $req = $request->all();

        // // ROLE AUTHENTICATION
        // if (!in_array($login_data['role'], ['admin'])) {
        //     return response('Not Allowed.', 403);
        // }

        // VALIDATION - Query parameters
        $validation = Validator::make($req, [
            'per_page' => "nullable|integer|min:1",
            'q'        => "nullable"
        ]);

        if ($validation->fails()) {
            return response()->json([
                'error' => "VALIDATION_ERROR",
                'data'  => $validation->errors()->first()
            ], 400);
        }

        // SUCCESS
        $data = TruckFactorRepo::gets($req);

        return response()->json([
            'first_page'   => 1,
            'current_page' => $data['current_page'],
            'last_page'    => $data['last_page'],
            'total'        => $data['total'],
            'data'         => $data['data']
        ]);
    }
}