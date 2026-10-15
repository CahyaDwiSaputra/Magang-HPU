<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\ShiftController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DedicatedController;
use App\Http\Controllers\Api\FuelRatioCoalController;
use App\Http\Controllers\Api\ItemCategoryController;
use App\Http\Controllers\Api\KoefisienBaseOBController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\SubMaterialController;
use App\Http\Controllers\Api\PitLocationController;
use App\Http\Controllers\Api\ProductivityProblemController;
use App\Http\Controllers\Api\TimeRangeController;
use App\Http\Controllers\Api\TruckFactorController;
use App\Http\Controllers\Api\DashcamController;
use App\Http\Controllers\Api\CmsV6ProxyController;


//FILE
Route::controller(FileController::class)->prefix("/file")->group(function(){
    Route::post("/upload", "upload");
    Route::post("/upload_avatar", "upload_avatar");
});

//USER
Route::controller(UserController::class)->prefix("/users")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

//COMPANY
Route::controller(CompanyController::class)->prefix("/companies")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

//SITE
Route::controller(SiteController::class)->prefix("/sites")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

//DEPARTMENT
Route::controller(DepartmentController::class)->prefix("/departments")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

//EMPLOYEE
Route::controller(EmployeeController::class)->prefix("/employees")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

//EQUIPMENT
Route::controller(EquipmentController::class)->prefix("/equipments")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

//SHIFT
Route::controller(ShiftController::class)->prefix("/shifts")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

//CATEGORY
Route::controller(CategoryController::class)->prefix("/categories")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

//DEDICATED
Route::controller(DedicatedController::class)->prefix("/dedicateds")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

//FUELRATIOCOAL
Route::controller(FuelRatioCoalController::class)->prefix("/fuel_ratio_coals")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

//ITEM CATEGORY
Route::controller(ItemCategoryController::class)->prefix("/item_categories")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

//KOEFISIEN BASE OB
Route::controller(KoefisienBaseOBController::class)->prefix("/koefisien_base_obs")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

// MATERIAL
Route::controller(MaterialController::class)->prefix("/materials")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

// SUBMATERIAL
Route::controller(SubMaterialController::class)->prefix("/sub_materials")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

// PITLOCATION
Route::controller(PitLocationController::class)->prefix("/pit_locations")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

// PRODUCTIVITY PROBLEM
Route::controller(ProductivityProblemController::class)->prefix("/productivity_problems")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

// TIMERANGE
Route::controller(TimeRangeController::class)->prefix("/time_ranges")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

// TRUCK FACTOR
Route::controller(TruckFactorController::class)->prefix("/truck_factors")->group(function(){
    Route::post("/", "add");
    Route::put("/{id}", "update");
    Route::delete("/{id}", "delete");
    Route::get("/", "gets");
    Route::get("/{id}", "get");
});

// DASHCAM & FACE RECOGNITION
Route::controller(DashcamController::class)->prefix("/dashcam")->withoutMiddleware(['auth', 'api'])->group(function(){
    Route::post("/face-recognition", "faceRecognition");
    Route::get("/face-recognition/history", "history");
    Route::get("/face-recognition/latest", "latest");
    Route::get("/drivers", "getDrivers");
    Route::post("/drivers/register", "registerDriver");
    Route::get("/active-driver", "getActiveDriver");
    Route::post("/checkout", "checkout");
    Route::get("/geofences", "getGeofences");
    Route::post("/geofences", "createGeofence");
    Route::delete("/geofences/{id}", "deleteGeofence");
    Route::get("/ritasi-today", "getRitasiToday");
    Route::post("/ritasi/record", "recordRitasi");
    Route::post("/ritasi/reset", "resetRitasi");
});

// CMSV6 PROXY — semua request ke server CMSV6 dilewatkan melalui backend (menghindari CORS)
Route::controller(CmsV6ProxyController::class)->prefix('/cmsv6')->withoutMiddleware(['auth', 'api'])->group(function () {
    Route::get('/session',             'session');           // Ambil jsession aktif
    Route::get('/vehicles',            'vehicles');          // Daftar armada dashcam PT. HPU
    Route::get('/status',              'deviceStatus');      // Status perangkat (GPS, speed, fuel)
    Route::get('/alarms',              'alarms');            // AI / DMS alarms (sinkronisasi Alarm Center)
    Route::post('/alarms/handle',       'handleAlarm');       // Selesaikan 1 alarm
    Route::post('/alarms/batch-handle', 'batchHandleAlarms'); // Selesaikan semua alarm
    Route::post('/alarms/trigger',      'triggerAlarm');      // Simulasi alarm untuk testing demo
    Route::get('/track',               'trackDetail');       // Riwayat GPS / last known location
    Route::get('/vehicle-info',        'vehicleInfo');       // Info kendaraan & driver
    Route::post('/snapshot',           'snapshot');          // Snapshot dari kamera dashcam
});