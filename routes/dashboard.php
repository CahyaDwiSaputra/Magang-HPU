<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::get('/', [DashboardController::class, 'index'])->name("dashboard");

//DASHCAM
Route::controller(DashboardController::class)->prefix("/dashcam")->group(function(){
    Route::get("/", "dashcam");
    Route::get("/telemetry", "getTelemetry");
});

//USER
Route::controller(DashboardController::class)->prefix("/users")->group(function(){
    Route::get("/", "users");
});

//COMPANY
Route::controller(DashboardController::class)->prefix("/companies")->group(function(){
    Route::get("/", "companies");
});

//SITE
Route::controller(DashboardController::class)->prefix("/sites")->group(function(){
    Route::get("/", "sites");
});

//DEPARTMENT
Route::controller(DashboardController::class)->prefix("/departments")->group(function(){
    Route::get("/", "departments");
});

//EMPLOYEE
Route::controller(DashboardController::class)->prefix("/employees")->group(function(){
    Route::get("/", "employees");
});

//EQUIPMENT
Route::controller(DashboardController::class)->prefix("/equipments")->group(function(){
    Route::get("/", "equipments");
});

//SHIFT
Route::controller(DashboardController::class)->prefix("/shifts")->group(function(){
    Route::get("/", "shifts");
});

//CATEGORY
Route::controller(DashboardController::class)->prefix("/categories")->group(function(){
    Route::get("/", "categories");
});

//DEDICATED
Route::controller(DashboardController::class)->prefix("/dedicateds")->group(function(){
    Route::get("/", "dedicateds");
});

//FUEL RATIO COAL
Route::controller(DashboardController::class)->prefix("/fuel_ratio_coals")->group(function(){
    Route::get("/", "fuel_ratio_coals");
});

//ITEM CATEGORY
Route::controller(DashboardController::class)->prefix("/item_categories")->group(function(){
    Route::get("/", "item_categories");
});

//KOEFISIEN BASE OB
Route::controller(DashboardController::class)->prefix("/koefisien_base_obs")->group(function(){
    Route::get("/", "koefisien_base_obs");
});

//MATERIAL
Route::controller(DashboardController::class)->prefix("/materials")->group(function(){
    Route::get("/", "materials");
});

//SUB MATERIAL
Route::controller(DashboardController::class)->prefix("/sub_materials")->group(function(){
    Route::get("/", "sub_materials");
});

//PIT LOCATION
Route::controller(DashboardController::class)->prefix("/pit_locations")->group(function(){
    Route::get("/", "pit_locations");
});

//PRODUCTIVITY PROBLEM
Route::controller(DashboardController::class)->prefix("/productivity_problems")->group(function(){
    Route::get("/", "productivity_problems");
});

//TIME RANGE
Route::controller(DashboardController::class)->prefix("/time_ranges")->group(function(){
    Route::get("/", "time_ranges");
});

//TRUCK FACTOR
Route::controller(DashboardController::class)->prefix("/truck_factors")->group(function(){
    Route::get("/", "truck_factors");
});