<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Repositories\SuratRepo;
use App\Repositories\PengaturanRepo;

class FrontpageController extends Controller
{

    //FRONTPAGE
    public function index(Request $request)
    {

        return Inertia::render('frontpage/frontpage/index', [
        ]);
    }
}