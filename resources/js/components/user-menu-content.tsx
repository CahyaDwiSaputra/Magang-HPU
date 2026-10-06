import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { prefersDark, useAppearance } from '@/hooks/use-appearance';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { Switch } from './ui/switch';
import { auth_request } from '@/configs/request';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        auth_request.logout()
        .catch(err=>{
            if(err.response.status==401){
                window.location.href="/"
            }
        })
    };

    const {appearance, updateAppearance}=useAppearance()
    const isDark=prefersDark()

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className='flex items-center justify-between px-2 py-3'>
                <span className='text-sm mr-1'>Dark Mode</span>
                <Switch 
                    checked={appearance=="dark"||(appearance=="system"&&isDark)}
                    onCheckedChange={e=>updateAppearance(e?"dark":"light")}
                />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" href="" as="button" prefetch onClick={cleanup}>
                    <UserIcon className="mr-2" />
                    Profile
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link className="block w-full" method="post" as="button" onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
