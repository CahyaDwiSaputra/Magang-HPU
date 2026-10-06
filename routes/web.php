<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FrontpageController;


//AUTH 
Route::redirect("/", "/login");
Route::get('/login', [AuthController::class, 'login'])->name('login');
Route::post('/login_userpass', [AuthController::class, 'login_userpass'])->name("login_userpass");
Route::middleware(["auth"])->post('/logout', [AuthController::class, 'logout']);

//DASHBOARD ROUTE
Route::middleware(["auth"])->prefix("/dashboard")->group(base_path('routes/dashboard.php'));

//FRONTPAGE ROUTE
// Route::get('/', [FrontpageController::class, 'index']);

//API ROUTE
Route::middleware(["auth", "api"])->prefix("/api")->group(base_path('routes/api.php'));

//CMSV6 WASM DECODER PROXY
use Illuminate\Support\Facades\Http;
Route::get('/libcmsv6decode.wasm', function () {
    $response = Http::get('http://10.10.0.53:8080/libcmsv6decode.wasm');
    return response($response->body(), 200)->header('Content-Type', 'application/wasm');
});



