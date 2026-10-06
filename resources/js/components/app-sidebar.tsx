import { Link } from '@inertiajs/react';
import { BookOpen, FileText, FolderGit2, GraduationCap, Hash, LayoutGrid, Presentation, Settings2, User2, UserRoundCog, UserRoundPen } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        roles: ["admin"]
    },
    {
        title: 'Data Users',
        href: '/dashboard/users',
        icon: User2,
        roles: ["admin"]
    },
    {
        title: 'Company',
        href: '/dashboard/companies',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Site',
        href: '/dashboard/sites',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Department',
        href: '/dashboard/departments',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Employee',
        href: '/dashboard/employees',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Equipment',
        href: '/dashboard/equipments',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Shift',
        href: '/dashboard/shifts',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Category',
        href: '/dashboard/categories',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Dedicated',
        href: '/dashboard/dedicateds',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Fuel Ratio Coal',
        href: '/dashboard/fuel_ratio_coals',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Item Category',
        href: '/dashboard/item_categories',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Koefisien Base OB',
        href: '/dashboard/koefisien_base_obs',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Material',
        href: '/dashboard/materials',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Sub Material',
        href: '/dashboard/sub_materials',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Pit Location',
        href: '/dashboard/pit_locations',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Productivity Problem',
        href: '/dashboard/productivity_problems',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Time Range',
        href: '/dashboard/time_ranges',
        icon: Hash,
        roles: ["admin"]
    },
    {
        title: 'Truck Factor',
        href: '/dashboard/truck_factors',
        icon: Hash,
        roles: ["admin"]
    }
];


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
