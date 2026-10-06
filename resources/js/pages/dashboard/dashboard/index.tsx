import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import axios from "axios"
import {modbus_sensor_request} from "@/config/request"
import { Head } from "@inertiajs/react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Cable, Check, Flag, Fuel, Gauge, Hourglass, MapPin, Microchip, Phone, Recycle, Search, Star, TrendingUp, Truck, User } from "lucide-react"
import CountUp from "react-countup"
import { Alert, AlertTitle } from "@/components/ui/alert"
import LayoutNavbar from "@/components/layout-navbar"
import { Map, Marker } from "pigeon-maps"

export default function Page(props) {
    // Data for the unit tree
    const mainUnits = ['EX39103CT', 'HD45108MB'];
    const generalUnits = ['WT49113MB', 'DT49132MB', 'LT45105MB'];

    return (
        <LayoutNavbar className="bg-transparent">
        {/* <SidebarProvider> */}
            <Head title="Dashboard"/>
            {/* <AppSidebar variant="inset" />
            <SidebarInset> */}
                {/* <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
                    <div className="flex items-center gap-2 px-4"> */}
                        {/* <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        /> */}
                        {/* <h1 className="text-base font-medium">Dashboard</h1>
                    </div>
                </header> */}
                {/* <div className="p-6">
                    <Alert className="bg-teal-200 dark:bg-teal-700 border-0">
                        <Check className="!size-9" />
                        <AlertTitle className="text-base ml-5 py-2">
                            Selamat datang <strong>{props.auth.user.name}</strong> di halaman Administrator!
                        </AlertTitle>
                    </Alert>
                </div> */}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-4 xl:col-span-3 space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-1.5">
                                    <Search className="w-3.5 h-3.5" />
                                    SEARCH
                                </span>
                                <span className="bg-gray-100 text-gray-700 px-3 py-0.5 rounded-full text-xs font-medium">
                                    ALL HPU
                                </span>
                            </div>

                            <div className="relative mb-3">
                                <input
                                    type="text"
                                    placeholder="Cari unit, operator..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:ring-0 focus:border-blue-500 outline-none text-gray-800"
                                />
                                <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-3">
                                <SearchChip label="(5) BDA" active />
                                <SearchChip label="ALL HPU" />
                            </div>

                            <div className="mt-2 space-y-2">
                                <div className="font-semibold text-gray-900 text-sm">MAIN UNIT:</div>
                                <div className="pl-3 border-l-2 border-gray-200 space-y-1">
                                    {mainUnits.map((unit) => (
                                        <div key={unit} className="flex items-center gap-2 text-sm text-gray-700">
                                            <Microchip className="w-3.5 h-3.5 text-blue-500" />
                                            {unit}
                                        </div>
                                    ))}
                                </div>

                                <div className="font-semibold text-gray-900 text-sm pt-1">UNIT GENERAL:</div>
                                <div className="pl-3 border-l-2 border-gray-200 space-y-1">
                                    {generalUnits.map((unit) => (
                                        <div key={unit} className="flex items-center gap-2 text-sm text-gray-700">
                                            <Truck className="w-3.5 h-3.5 text-gray-500" />
                                            {unit}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Operator Mini Card */}
                        {/* <div className="bg-white rounded-2xl shadow-sm p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm">
                                    T
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-gray-900 text-sm">TAUFIQ (90012030)</div>
                                    <div className="text-xs text-gray-500">HD-78501</div>
                                </div>
                                <StarRating rating={4} />
                            </div>
                        </div> */}

                        <div className="mx-auto text-xs text-gray-300 flex justify-between px-1">
                            <span>&copy; 2026 SMART FLEET</span>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-4">
                        {/* Operator Detail & Current Trip */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Operator Detail Card */}
                            <div className="bg-white rounded-2xl shadow-sm p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" />
                                            OPERATOR DETAIL
                                        </span>
                                        <div className="mt-1.5 text-lg font-bold text-gray-900">
                                            TAUFIQ (90012030)
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                EX-39103CT
                                            </span>
                                            <div className='flex gap-1'>
                                                <StarRating rating={4} />
                                                <span className='text-gray-700 text-sm'>(4.6)</span>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                +62 812 3456 7890
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                Site A
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-24 h-32 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-bold">
                                        <User size={50} strokeWidth={1}/>
                                    </div>
                                </div>
                            </div>

                            {/* Current Trip Card */}
                            <div className="bg-white rounded-2xl shadow-sm p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-1.5">
                                        <Activity className="w-3.5 h-3.5" />
                                        CURRENT TRIP
                                    </span>
                                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Flag className="w-3 h-3" />
                                        ARRIVED
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-1 mt-2">
                                    <div>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">START</span>
                                        <div className="text-sm font-bold text-gray-900">10:00 WITA</div>
                                        <div className="text-xs text-gray-500">12/09/2025</div>
                                    </div>
                                    <div>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">NOW</span>
                                        <div className="text-sm font-bold text-gray-900">11:00 WITA</div>
                                        <div className="text-xs text-gray-500">12/09/2025</div>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-sm">
                                    <Flag className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-gray-700">Finish · Arrived to Check Area</span>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white rounded-2xl shadow-sm p-4'>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    UNIT LOCATION
                                </span>
                            </div>
                            <div className='mt-2 w-full h-[400px] min-h-80 overflow-hidden rounded-xl'>
                                <Map height={400} defaultCenter={[-7.554863, 111.6582568]} defaultZoom={14}>
                                    <Marker width={50} anchor={[-7.554863, 111.6582568]} />
                                </Map>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5" />
                                    SUMMARY
                                </span>
                                {/* <div className="flex items-center gap-3 text-xs bg-gray-50 px-3 py-1 rounded-full">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Trip Progress
                                    </span>
                                    <span className="font-bold text-gray-900">50%</span>
                                </div> */}
                            </div>

                            {/* Progress Bar */}
                            {/* <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '50%' }} />
                            </div> */}

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-2 mt-3">
                                <div className="bg-white rounded-xl p-3 border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <Fuel className='w-5 h-5 text-gray-400'/>
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Cons</span>
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-bold text-gray-900">98,765</span>
                                                <span className="text-xs font-medium text-gray-500">jam</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-3 border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <Gauge className='w-5 h-5 text-gray-400'/>
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</span>
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-bold text-gray-900">15</span>
                                                <span className="text-xs font-medium text-gray-500">km/jam</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-3 border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <Recycle className='w-5 h-5 text-gray-400'/>
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Cycle Time</span>
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-bold text-gray-900">25</span>
                                                <span className="text-xs font-medium text-gray-500">menit</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-3 border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <Hourglass className='w-5 h-5 text-gray-400'/>
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hour Meter</span>
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-bold text-gray-900">98,765</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fuel and Additional Info */}
                            {/* <div className="mt-3 pt-3 flex flex-wrap items-center justify-between">
                                <div>
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        <Activity className="w-3 h-3" />
                                        RIT
                                    </span>
                                    <div className="text-base font-bold text-gray-900">
                                        20 <span className="text-xs font-normal text-gray-500">OB</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />
                                        OB Load
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Circle className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                                        20 RIT
                                    </span>
                                </div>
                            </div> */}
                        </div>

                    </div>
                </div>
                
            {/* </SidebarInset>
        </SidebarProvider> */}
        </LayoutNavbar>
    )
}

// Search unit chip
const SearchChip = ({ label, active = false }) => (
    <span
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            active
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
    >
        {label}
    </span>
)

// Star rating component
const StarRating = ({ rating = 4, maxStars = 5 }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(maxStars)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${
                        i < rating ? 'text-orange-400 fill-orange-400' : 'text-gray-300'
                    }`}
                />
            ))}
        </div>
    );
}
