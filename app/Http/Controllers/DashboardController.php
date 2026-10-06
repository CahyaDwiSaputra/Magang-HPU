<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Http;


class DashboardController extends Controller
{

    //DASHBOARD
    public function index(Request $request)
    {

        return Inertia::render('dashboard/dashboard/index', [
        ]);
    }

    //DASHCAM
    public function dashcam(Request $request)
    {

        return Inertia::render('dashboard/dashcam/index', [
        ]);
    }

    public function getTelemetry(Request $request)
    {
        $serverUrl = 'http://10.10.0.53:8080';
        $account = 'admin';
        $password = 'Password.1';
        $devIdno = '240078916116';

        try {
            // 1. Login to get jsession
            $loginResponse = Http::get("$serverUrl/StandardApiAction_login.action", [
                'account' => $account,
                'password' => $password
            ]);

            $loginData = $loginResponse->json();

            // Some CMSV6 versions return jsession directly, others inside 'status' or 'data'. 
            // We safely check for the common jsession key.
            $jsession = $loginData['jsession'] ?? null;
            if (!$jsession) {
                return response()->json(['error' => 'Failed to login to CMSV6', 'data' => $loginData], 500);
            }

            // 2. Fetch Device Status using jsession
            $statusResponse = Http::get("$serverUrl/StandardApiAction_getDeviceStatus.action", [
                'jsession' => $jsession,
                'devIdno' => $devIdno
            ]);

            return response()->json($statusResponse->json());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    //USER
    public function users(Request $request)
    {

        return Inertia::render('dashboard/users/index', [
        ]);
    }

    //COMPANY
    public function companies(Request $request)
    {

        return Inertia::render('dashboard/companies/index', [
        ]);
    }

    //SITE
    public function sites(Request $request)
    {

        return Inertia::render('dashboard/sites/index', [
        ]);
    }

    //DEPARTMENT
    public function departments(Request $request)
    {

        return Inertia::render('dashboard/departments/index', [
        ]);
    }

    //EMPLOYEE
    public function employees(Request $request)
    {

        return Inertia::render('dashboard/employees/index', [
        ]);
    }

    //EQUIPMENT
    public function equipments(Request $request)
    {

        return Inertia::render('dashboard/equipments/index', [
        ]);
    }

    //SHIFT
    public function shifts(Request $request)
    {

        return Inertia::render('dashboard/shifts/index', [
        ]);
    }

    //CATEGORY
    public function categories(Request $request)
    {

        return Inertia::render('dashboard/categories/index', [
        ]);
    }

    //DEDICATED
    public function dedicateds(Request $request)
    {

        return Inertia::render('dashboard/dedicateds/index', [
        ]);
    }

    //FUEL RATIO COAL
    public function fuel_ratio_coals(Request $request)
    {

        return Inertia::render('dashboard/fuel_ratio_coals/index', [
        ]);
    }

    //ITEM CATEGORY
    public function item_categories(Request $request)
    {

        return Inertia::render('dashboard/item_categories/index', [
        ]);
    }

    //KOEFISIEN BASE OB
    public function koefisien_base_obs(Request $request)
    {

        return Inertia::render('dashboard/koefisien_base_obs/index', [
        ]);
    }

    //MATERIAL
    public function materials(Request $request)
    {

        return Inertia::render('dashboard/materials/index', [
        ]);
    }

    //SUB MATERIAL
    public function sub_materials(Request $request)
    {

        return Inertia::render('dashboard/sub_materials/index', [
        ]);
    }

    //PIT LOCATION
    public function pit_locations(Request $request)
    {

        return Inertia::render('dashboard/pit_locations/index', [
        ]);
    }

    //PRODUCTIVITY PROBLEM
    public function productivity_problems(Request $request)
    {

        return Inertia::render('dashboard/productivity_problems/index', [
        ]);
    }

    //TIME RANGE
    public function time_ranges(Request $request)
    {

        return Inertia::render('dashboard/time_ranges/index', [
        ]);
    }

    //TRUCK FACTOR
    public function truck_factors(Request $request)
    {

        return Inertia::render('dashboard/truck_factors/index', [
        ]);
    }
}