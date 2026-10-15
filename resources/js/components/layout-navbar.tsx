import React, { Children, useState } from 'react';
import { 
    Search, 
    Menu, 
    Star, 
    User, 
    Phone, 
    MapPin, 
    Flag, 
    Clock, 
    Gauge, 
    RotateCw, 
    Hourglass, 
    Fuel, 
    Database, 
    CheckCircle,
    Truck,
    Microchip,
    Circle,
    ChartPie,
    MapPin as MapPinIcon,
    UserCog,
    Bell,
    Users,
    Briefcase,
    FileText,
    Activity,
    LandPlot,
    Recycle,
    DatabaseIcon,
    User2,
    Settings2,
    LogOut,
    ChevronDown,
    Video
} from 'lucide-react';
import { Map, Marker } from "pigeon-maps"
import { useOutsideClick } from '@/hooks/use-outsideclick'
import clsx from 'clsx'
import * as _ from "underscore"
import { Link, usePage } from '@inertiajs/react';
import { auth_request } from '@/configs/request';
import { useInitials } from '@/hooks/use-initials';

const menu_items=[
    {
        id: 'dashboard',
        label: 'DASHBOARD',
        icon: ChartPie,
        href:"/dashboard"
    },
    {
        id: 'dashcam',
        label: 'DASHCAM',
        icon: Video,
        href:"/dashboard/dashcam"
    },
    {
        id: 'users',
        label: 'USERS',
        icon: User2,
        href:"/dashboard/users"
    },
    {
        id: 'master',
        label: 'MASTER DATA',
        icon: DatabaseIcon,
        sub_items: [
            { label: 'Company', href: '/dashboard/companies' },
            { label: 'Site', href: '/dashboard/sites' },
            { label: 'Department', href: '/dashboard/departments' },
            { label: 'Employee', href: '/dashboard/employees' },
            { label: 'Equipment', href: '/dashboard/equipments' },
            { label: 'Shift', href: '/dashboard/shifts' },
            { label: 'Category', href: '/dashboard/categories' },
            { label: 'Dedicated', href: '/dashboard/dedicateds' },
            { label: 'Fuel Ratio Coal', href: '/dashboard/fuel_ratio_coals' },
            { label: 'Item Category', href: '/dashboard/item_categories' },
            { label: 'Koefisien Base OB', href: '/dashboard/koefisien_base_obs' },
            { label: 'Material', href: '/dashboard/materials' },
            { label: 'Sub Material', href: '/dashboard/sub_materials' },
            { label: 'Pit Location', href: '/dashboard/pit_locations' },
            { label: 'Productivity Problem', href: '/dashboard/productivity_problems' },
            { label: 'Time Range', href: '/dashboard/time_ranges' },
            { label: 'Truck Factor', href: '/dashboard/truck_factors' }
        ]
    },
]

const Layout = ({children, className}: {children: React.ReactNode, className?: string}) => {

    return (
        <div className="background-frontpage min-h-screen p-4 md:p-6 font-sans">
            <div className="mx-auto max-w-7xl transition-all">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2 px-3">
                        <span className="text-3xl font-extrabold tracking-tight text-white">
                            SMART FLEET
                        </span>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-wrap items-center gap-1 px-3 ml-auto">
                        {menu_items.map(list=>(
                            <NavLink 
                                item={list}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                        <UserMenu/>
                    </div>
                </div>

                <div className={clsx("bg-background rounded-2xl overflow-hidden shadow-2xl", className)}>
                    {children}
                </div>

            </div>
        </div>
    );
};

// Navigation link component
const NavLink = ({ item, active=false }) => {
    const [open_menu, setOpenMenu]=useState(false)

    const page=usePage()

    const menuRef=useOutsideClick(()=>setOpenMenu(false))

    return (
        <div className='relative' ref={menuRef}>
            
            {!_.isUndefined(item.sub_items)?
                <span
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                        (item.sub_items.filter(f=>f.href==page.url).length>0)
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-300 hover:bg-white hover:text-gray-900'
                    }`}
                    onClick={e=>setOpenMenu(!open_menu)}
                >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                    <ChevronDown 
                        size={15} 
                        className={clsx(
                            "transition-transform duration-200",
                            {"rotate-180":open_menu}
                        )}
                    />
                </span>
            :
                <Link
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                        (page.url==item.href)
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-300 hover:bg-white hover:text-gray-900'
                    }`}
                    href={item.href}
                >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                </Link>
            }

            {!_.isUndefined(item.sub_items)&&
                <div 
                    className={clsx(
                        "absolute top-full right-0 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[200px] py-2 z-50 transition-all mt-5 opacity-0 invisible",
                        {"!visible !mt-1 !opacity-100":open_menu}
                    )}
                >
                    {item.sub_items.map(list => (
                        <Link
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors cursor-pointer"
                            href={list.href}
                        >
                            {list.label}
                        </Link>
                    ))}
                </div>
            }
        </div>
    )
}

// User menu
const UserMenu=(props)=>{
    const [open_menu, setOpenMenu]=useState(false)

    const auth=usePage().props.auth
    const getInitials = useInitials()

    const menuRef=useOutsideClick(()=>setOpenMenu(false))

    const handleLogout = () => {
        auth_request.logout()
        .catch(err=>{
            if(err.response.status==401){
                window.location.href="/"
            }
        })
    }

    return (
        <div className='relative px-3' ref={menuRef}>
            <div 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-sm cursor-pointer transition-all duration-200"
                onClick={e=>setOpenMenu(!open_menu)}
            >
                <span>{getInitials(auth.user.name)}</span>
            </div>
            <div 
                className={clsx(
                    "absolute top-full right-0 p-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 transition-all mt-5 opacity-0 invisible",
                    {"!visible !mt-1 !opacity-100":open_menu}
                )}
            >
                <div >
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-gray-400"
                        >
                            {getInitials(auth.user.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-gray-900 truncate">{auth.user.name}</div>
                            <div className="text-xs text-gray-500">{auth.user.role}</div>
                        </div>
                    </div>
                </div>
                <div class="border-t border-gray-100 py-1 mt-2">
                    <div
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors cursor-pointer rounded-lg"
                    >
                        <User2 size={15}/> Profile
                    </div>
                    <Link
                        as="button"
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors cursor-pointer rounded-lg"
                        onClick={handleLogout}
                    >
                        <LogOut size={15}/> Logout
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Layout