<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Repositories\TimeRangeRepo;
use App\Models\TimeRangeModel;

class TimeRangeController extends Controller
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
            "time_range" => "required",
            "deleted_at" => "nullable",
            "start_time" => "required",
            "end_time"   => "required"
        ]);

        if ($validation->fails()) {
            return response()->json([
                'error' => "VALIDATION_ERROR",
                'data'  => $validation->errors()->first()
            ], 400);
        }

        // SUCCESS
        DB::transaction(function () use ($req) {
            TimeRangeModel::create([
                "time_range" => $req['time_range'],
                "deleted_at" => isset($req['deleted_at'])?$req['deleted_at']:null,
                "start_time" => $req['start_time'],
                "end_time"   => $req['end_time']
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
        $id_data = TimeRangeModel::find($id);
        if (!isset($id_data)) {
            return response()->json([
                'error' => "VALIDATION_ERROR",
                'data'  => "Bad request."
            ], 400);
        }

        // VALIDATION - semua nullable
        $validation = Validator::make($req, [
            "time_range" => "nullable",
            "deleted_at" => "nullable",
            "start_time" => "nullable",
            "end_time"   => "nullable"
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

            if (isset($req['time_range'])) {
                $data_update['time_range'] = $req['time_range'];
            }
            if (isset($req['deleted_at'])) {
                $data_update['deleted_at'] = $req['deleted_at'];
            }
            if (isset($req['start_time'])) {
                $data_update['start_time'] = $req['start_time'];
            }
            if (isset($req['end_time'])) {
                $data_update['end_time'] = $req['end_time'];
            }

            TimeRangeModel::find($id)->update($data_update);
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
        $id_data = TimeRangeModel::find($id);
        if (!isset($id_data)) {
            return response()->json([
                'error' => "VALIDATION_ERROR",
                'data'  => "Bad request."
            ], 400);
        }

        // SUCCESS
        DB::transaction(function () use ($req, $id) {
            TimeRangeModel::find($id)->delete();
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
        $id_data = TimeRangeModel::find($id);
        if (!isset($id_data)) {
            return response()->json([
                'error' => "VALIDATION_ERROR",
                'data'  => "Bad request."
            ], 400);
        }

        // SUCCESS
        $data = TimeRangeRepo::get($id);

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
        $data = TimeRangeRepo::gets($req);

        return response()->json([
            'first_page'   => 1,
            'current_page' => $data['current_page'],
            'last_page'    => $data['last_page'],
            'total'        => $data['total'],
            'data'         => $data['data']
        ]);
    }
}