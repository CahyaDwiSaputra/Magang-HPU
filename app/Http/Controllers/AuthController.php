<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;


class AuthController extends Controller
{

/**
     * Show the login page.
     */
    public function login(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function login_userpass(Request $request)
    {
        $req=$request->all();

        //VALIDATION
        $validation=Validator::make($req, [
            'username'  =>"required",
            'password'  =>"required",
            'remember'  =>"required|boolean"
        ]);
        if($validation->fails()){
            return response()->json([
                'error' =>"VALIDATION_ERROR",
                'data'  =>$validation->errors()
            ], 400);
        }

        //AUTH
        $user=Auth::attempt(
            [
                'username'  =>$req['username'],
                'password'  =>$req['password']
            ], 
            $req['remember']
        );
        if(!$user){
            return back()
                ->withErrors([
                    'username' => 'The provided credentials do not match our records.',
                ]);
        }

        $request->session()->regenerate();

        return redirect("/dashboard");
    }

    /**
     * Destroy an authenticated session.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response("Unauthenticated.", 401);
    }
}
