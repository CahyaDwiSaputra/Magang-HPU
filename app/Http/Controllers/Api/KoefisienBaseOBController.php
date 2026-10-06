<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Repositories\KoefisienBaseOBRepo;
use App\Models\KoefisienBaseOBModel;
use App\Models\SiteModel;

class KoefisienBaseOBController extends Controller
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
            "plan_date"              => "required|date_format:Y-m-d",
            "site"                   => "required|exists:App\Models\SiteModel,siteID",
            "base_ob"                => "required",
            "pengurang_jarak"        => "required",
            "deleted_at"             => "nullable",
            "base_over_distance"     => "required"
        ]);

        if ($validation->fails()) {
            return response()->json([
                'error' => "VALIDATION_ERROR",
                'data'  => $validation->errors()->first()
            ], 400);
        }

        // SUCCESS
        DB::transaction(function () use ($req) {
            KoefisienBaseOBModel::create([
                "plan_date"           => $req['plan_date'],
                "site"                => $req['site'],
                "base_ob"             => $req['base_ob'],
                "pengurang_jarak"     => $req['pengurang_jarak'],
                "deleted_at"          => isset($req['deleted_at'])?$req['deleted_at']:null,
                "base_over_distance"  => $req['base_over_distance']
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
        $id_data = KoefisienBaseOBModel::find($id);
        if (!isset($id_data)) {
            return response()->json([
                'error' => "VALIDATION_ERROR",
                'data'  => "Bad request."
            ], 400);
        }

        // VALIDATION
        $validation = Validator::make($req, [
            "plan_date"              => "nullable|date_format:Y-m-d",
            "site"                   => "nullable|exists:App\Models\SiteModel,siteID",
            "base_ob"                => "nullable",
            "pengurang_jarak"        => "nullable",
            "deleted_at"             => "nullable",
            "base_over_distance"     => "nullable"
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
            
            if (isset($req['plan_date'])) {
                $data_update['plan_date'] = $req['plan_date'];
            }
            if (isset($req['site'])) {
                $data_update['site'] = $req['site'];
            }
            if (isset($req['base_ob'])) {
                $data_update['base_ob'] = $req['base_ob'];
            }
            if (isset($req['pengurang_jarak'])) {
                $data_update['pengurang_jarak'] = $req['pengurang_jarak'];
            }
            if (isset($req['deleted_at'])) {
                $data_update['deleted_at'] = $req['deleted_at'];
            }
            if (isset($req['base_over_distance'])) {
                $data_update['base_over_distance'] = $req['base_over_distance'];
            }

            KoefisienBaseOBModel::find($id)->update($data_update);
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
        $id_data = KoefisienBaseOBModel::find($id);
        if (!isset($id_data)) {
            return response()->json([
                'error' => "VALIDATION_ERROR",
                'data'  => "Bad request."
            ], 400);
        }

        // SUCCESS
        DB::transaction(function () use ($req, $id) {
            KoefisienBaseOBModel::find($id)->delete();
        });

        return response()->json([
            'status' => "ok"
        ]);
    }

    public function get(Request $request, $id)
    {
        $login_data = $request->user();
        $req = $request->all();

        // // ROLE AUTHENTICATION (dikomentari)
        // if (!in_array($login_data['role'], ['admin'])) {
        //     return response('Not Allowed.', 403);
        // }

        // VALIDATION ID
        $id_data = KoefisienBaseOBModel::find($id);
        if (!isset($id_data)) {
            return response()->json([
                'error' => "VALIDATION_ERROR",
                'data'  => "Bad request."
            ], 400);
        }

        // SUCCESS
        $data = KoefisienBaseOBRepo::get($id);

        return response()->json([
            'data' => $data
        ]);
    }

    public function gets(Request $request)
    {
        $login_data = $request->user();
        $req = $request->all();

        // // ROLE AUTHENTICATION (dikomentari)
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
        $data = KoefisienBaseOBRepo::gets($req);

        return response()->json([
            'first_page'   => 1,
            'current_page' => $data['current_page'],
            'last_page'    => $data['last_page'],
            'total'        => $data['total'],
            'data'         => $data['data']
        ]);
    }
}